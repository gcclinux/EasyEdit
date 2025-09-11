const fs = require('fs');
const fsPromises = fs.promises;
const { app, BrowserWindow, screen, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const detect = require('detect-port');
const defaultPort = 3024;
const viteDevPort = defaultPort; // Using same port for consistency
const { shell } = require('electron');
const config = 'easyedit.json';
const configPath = path.join(app.getPath('userData'), config);

// Disable hardware acceleration
app.disableHardwareAcceleration();

let mainWindow = null;
let server = null;

// saveConfig function to save window bounds to a JSON file (synchronous to ensure persistence)
function saveConfig(window) {
  try {
    if (!window || window.isDestroyed && window.isDestroyed()) return;
    const b = window.getBounds();
    const details = {
      width: b.width,
      height: b.height,
      x: b.x,
      y: b.y
    };
    // write synchronously so we don't lose data when quitting
    fs.writeFileSync(configPath, JSON.stringify(details, null, 2), 'utf-8');
  } catch (err) {
    // log but don't throw — window may already be gone
    console.error('Failed to save window bounds:', err);
  }
}

async function setupServer(isDev) {
  const port = await detect(defaultPort);
  
  if (isDev) {
    console.log('Running in development mode');
    return port;
  } else {
    const app = express();
    app.use(express.static(path.join(__dirname, 'dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
    
    server = app.listen(port);
    return port;
  }
}

const openLinkInNewWindow = (url) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const newWindow = new BrowserWindow({
    width: width / 2 + width / 4,
    height: height / 2 + height / 4,
    icon: path.join(__dirname, 'public', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  newWindow.setMenuBarVisibility(false);
  newWindow.loadURL(url);
};

// Create a new BrowserWindow when `app` is ready
async function createMainWindow() {
  const isDev = (await import('electron-is-dev')).default;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const iconPath = path.join(__dirname, 'public', process.platform === 'win32' ? 'icon.ico' : 'icon.png');

  // default window options
  let windowOptions = {
    width: Math.min(1200, width),
    height: Math.min(800, height),
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  };

  // Load persisted bounds if config exists
  try {
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, 'utf-8');
      const bounds = JSON.parse(raw);
      if (bounds && bounds.width && bounds.height && bounds.x !== undefined && bounds.y !== undefined) {
        windowOptions = {
          ...windowOptions,
          width: bounds.width,
          height: bounds.height,
          x: bounds.x,
          y: bounds.y
        };
      }
    }
  } catch (err) {
    console.error('Failed to read window bounds from config:', err);
  }

  mainWindow = new BrowserWindow(windowOptions);

  // ensure we save bounds when window is closed
  mainWindow.on('close', () => {
    try {
      // only attempt to save if window still valid
      if (mainWindow && !mainWindow.isDestroyed()) saveConfig(mainWindow);
    } catch (err) {
      console.error('Error saving bounds on close:', err);
    }
  });

  // (optional) also clear reference on 'closed'
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Add Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: http://localhost:* ws://localhost:*"
        ]
      }
    });
  });

  const port = await setupServer(isDev);
  const startUrl = isDev 
    ? `http://localhost:${viteDevPort}` 
    : `http://localhost:${port}`;

  try {
    await mainWindow.loadURL(startUrl);
  } catch (err) {
    console.error('Failed to load URL:', err);
  }

  // Open DevTools in development
  // if (isDev) {
  //   mainWindow.webContents.openDevTools();
  // }

  // Inject custom CSS to hide the scrollbar and disable scrolling
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
      body::-webkit-scrollbar { display: none; }
      body { overflow: hidden; }
    `);
  });

  // Handle command line file opening after window loads
  const args = process.argv.slice(2);
  if (args.length > 0) {
    const filePath = args[0];
    await handleFileOpen(filePath);
  }

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return mainWindow;
}

async function handleFileOpen(filePath) {
  try {
    // First check if path exists and is not a directory
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      //console.log('Path is a directory, skipping:', filePath);
      return;
    }

    const content = await fsPromises.readFile(filePath, 'utf-8');
    //console.log('File content loaded successfully');

    return new Promise((resolve) => {
      if (mainWindow.webContents.isLoading()) {
        mainWindow.webContents.once('did-finish-load', () => {
          mainWindow.webContents.send('file-opened', content);
          resolve();
        });
      } else {
        mainWindow.webContents.send('file-opened', content);
        resolve();
      }
    });
  } catch (err) {
    if (err.code === 'EISDIR') {
      console.log('Skipping directory:', filePath);
    } else if (err.code === 'ENOENT') {
      console.error('File not found:', filePath);
    } else {
      console.error('Error reading file:', err);
    }
  }
}

function setupIPCHandlers() {
  ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Text Files', extensions: ['txt', 'md'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (!canceled) {
      return await handleFileOpen(filePaths[0]);
    }
  });

  ipcMain.handle('dialog:saveFile', async (event, content) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow);

    if (!canceled) {
      await fsPromises.writeFile(filePath, content);
      return filePath;
    }
  });
}

function createMenuTemplate() {
  const menuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "Open File",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            const result = await dialog.showOpenDialog({
              properties: ['openFile']
            });
            if (!result.canceled) {
              try {
                const filePath = result.filePaths[0];
                const content = await fsPromises.readFile(filePath, 'utf-8');
                mainWindow.webContents.send('file-opened', content);
              } catch (err) {
                console.error('Error reading file:', err);
              }
            }
          }
        },
        { role: "reload" },
        { 
          label: 'Exit', 
          accelerator: 'Ctrl+Q', 
          click: () => { 
            try {
              // Save bounds for all open windows before quitting
              BrowserWindow.getAllWindows().forEach(w => {
                try {
                  if (w && !w.isDestroyed()) saveConfig(w);
                } catch (e) {
                  console.error('Error saving window during Exit:', e);
                }
              });
            } catch (e) {
              console.error('Error during Exit save loop:', e);
            } finally {
              // Use app.quit() — let Electron close windows gracefully
              app.quit();
            }
          } 
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { role: "selectall" },
      ],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Go Back",
          accelerator: "CommandOrControl+B",
          click: () => {
            const focusedWindow = BrowserWindow.getFocusedWindow();
            if (focusedWindow && focusedWindow.webContents.navigationHistory.canGoBack()) {
              focusedWindow.webContents.navigationHistory.goBack();
            }
          },
        },
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        {
          label: "PreviewPanel",
          submenu: [
            {
              label: "Increase LineHeight",
              accelerator: "CommandOrControl+M",
              click: () => {
                mainWindow.webContents.send('update-preview-spacing', {
                  action: 'increase',
                  selector: '.preview-horizontal, .preview-parallel, .preview-horizontal-full'
                });
              },
            },
            {
              label: "Decrease LineHeight",
              accelerator: "CommandOrControl+L",
              click: () => {
                mainWindow.webContents.send('update-preview-spacing', {
                  action: 'decrease',
                  selector: '.preview-horizontal, .preview-parallel, .preview-horizontal-full'
                });
              },
            },
          ],
        },
       { role: "toggledevtools" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: 'Check for Updates',
          click: () => {
            const iconPath = path.join(__dirname, 'public', process.platform === 'win32' ? 'icon.ico' : 'icon.png');
            releaseWindow = new BrowserWindow({
              width: 600,
              height: 480,
              modal: true,
              icon: iconPath,
              parent: mainWindow,
              webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
              },
            });
            releaseWindow.setMenuBarVisibility(false);
            releaseWindow.loadFile(path.join(__dirname, 'release','release.html'));
            releaseWindow.webContents.on('will-navigate', (event, url) => {
              event.preventDefault();
              openLinkInNewWindow(url);
            });
            
            releaseWindow.webContents.setWindowOpenHandler(({ url }) => {
              openLinkInNewWindow(url);
              return { action: 'deny' };
            });
          },
        },
        { type: "separator" },
        {
          label: 'About',
          click: () => {
            const iconPath = path.join(__dirname, 'public', process.platform === 'win32' ? 'icon.ico' : 'icon.png');
            const aboutWindow = new BrowserWindow({
              width: 600,
              height: 550,
              modal: true,
              icon: iconPath,
              parent: mainWindow,
              webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
              },
            });
            aboutWindow.setMenuBarVisibility(false);
            aboutWindow.loadFile(path.join(__dirname, 'about','about.html'));
          },
        },
      ],
    }
  ];

  return menuTemplate;
}

function setupMenu() {
  const menu = Menu.buildFromTemplate(createMenuTemplate());
  Menu.setApplicationMenu(menu);
}

// App lifecycle management
app.whenReady().then(async () => {
  await createMainWindow();
  setupMenu();
  setupIPCHandlers();

  // Handle command line file opening
  if (process.argv.length > 1) {
    const filePath = path.isAbsolute(process.argv[process.argv.length - 1])
      ? process.argv[process.argv.length - 1]
      : path.resolve(process.cwd(), process.argv[process.argv.length - 1]);

    //console.log('Attempting to open:', filePath);
    await handleFileOpen(filePath);
  }

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Ensure app-wide quit also saves bounds (covers menu role 'quit' / app.quit())
app.on('before-quit', (e) => {
  try {
    if (mainWindow && !mainWindow.isDestroyed()) {
      saveConfig(mainWindow);
    }
  } catch (err) {
    console.error('Error saving config in before-quit:', err);
  }
});

module.exports = { mainWindow, saveConfig };