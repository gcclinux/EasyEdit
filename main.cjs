const fs = require('fs');
const fsPromises = fs.promises;
const { app, BrowserWindow, screen, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const detect = require('detect-port');
const defaultPort = 3000;
const viteDevPort = defaultPort; // Using same port for consistency
const { shell } = require('electron');
const config = 'easyedit.json';
const configPath = path.join(app.getPath('userData'), config);

// Disable hardware acceleration
app.disableHardwareAcceleration();

let mainWindow = null;
let server = null;

// saveConfig function to save window bounds and line height to a JSON file
async function saveConfig(window) {
  const bounds = window.getBounds();

  // Get line height value using Promise
  const lineHeight = await new Promise((resolve) => {
    window.webContents.send('get-line-height');
    ipcMain.once('line-height-value', (_event, value) => {
      resolve(Number(value.current).toFixed(1));
    });
  });

  const details = {
    ...bounds,
    lineheight: parseFloat(lineHeight)
  };
  fs.writeFileSync(configPath, JSON.stringify(details, null, 2));
}

async function setupServer(isDev) {
  if (isDev) {
    return `http://localhost:${viteDevPort}`; // Using defaultPort for Vite
  } else {
    const availablePort = await detect(defaultPort);
    const app = express();

    // Serve static files from dist
    app.use(express.static(path.join(__dirname, 'dist')));

    // Handle SPA routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    // Start server
    server = app.listen(availablePort);
    return `http://localhost:${availablePort}`;
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
  const configPath = path.join(app.getPath('userData'), config);

  let initialLineHeight = 1.0; // Default line height

  let windowOptions = {
    width: width,
    height: height,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  };

  // Check if config file exists and read bounds and line height
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config && config.width && config.height && config.x !== undefined && config.y !== undefined) {
        windowOptions = { ...windowOptions, ...config };
      }
      if (config.lineheight !== undefined) {
        initialLineHeight = config.lineheight;
      }
    } catch (error) {
      console.error('Error reading config file:', error);
    }
  }

  try {
    const serverUrl = await setupServer(isDev);
    mainWindow = new BrowserWindow(windowOptions);

  // Inject custom CSS to hide the scrollbar and disable scrolling
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.insertCSS(`
        body::-webkit-scrollbar { display: none; }
        body { overflow: hidden; }
      `);
    // Send initial line height value to renderer
    mainWindow.webContents.send('init-line-height', initialLineHeight);
    });
    await mainWindow.loadURL(serverUrl);

    // Handle command line file opening after window loads
    const args = process.argv.slice(2);
    if (args.length > 0) {
      const filePath = args[0];
      await handleFileOpen(filePath);
    }
  } catch (err) {
    console.error('Failed to start server:', err);
  }

  // Open external links in the default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('close', async () => {
    await saveConfig(mainWindow);
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
          label: "Exit",
          click: async () => {
            await saveConfig(mainWindow);
            app.quit();

          },
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

module.exports = { mainWindow, saveConfig };