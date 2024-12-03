const fs = require('fs');
const fsPromises = fs.promises;
const { app, BrowserWindow, screen, Menu, dialog } = require('electron');
const path = require('path');
const express = require('express');
const detect = require('detect-port');
const defaultPort = 3000;
const viteDevPort = defaultPort; // Using same port for consistency
const { shell } = require('electron');

// Add IPC handler for debugging
const { ipcMain } = require('electron');
ipcMain.on('debug-channel', (event, message) => {
  console.log('[Main Debug]:', message);
});

// Disable hardware acceleration
app.disableHardwareAcceleration();

let mainWindow = null;
let server = null;

function saveWindowBounds(window) {
  const bounds = window.getBounds();
  const configPath = path.join(app.getPath('userData'), '.config.json');
  fs.writeFileSync(configPath, JSON.stringify(bounds, null, 2));
}

// async function setupServer(isDev) {
//   if (isDev) {
//     console.log('[Main] Dev mode: Using Vite server');
//     return `http://localhost:${viteDevPort}`; // Using defaultPort for Vite
//   } else {
//     console.log('[Main] Prod mode: Loading local files');
//     const availablePort = await detect(defaultPort);
//     const app = express();

//     // Serve static files from dist
//     app.use(express.static(path.join(__dirname, 'dist')));

//     // Handle SPA routing
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(__dirname, 'dist', 'index.html'));
//     });

//     // Start server
//     server = app.listen(availablePort);
//     return `http://localhost:${availablePort}`;
//   }
// }

async function setupServer(isDev) {
  if (isDev) {
    console.log('[Main] Dev mode: Using Vite server');
    return `http://localhost:${viteDevPort}`;
  } else {
    console.log('[Main] Prod mode: Starting Express server');
    const availablePort = await detect(defaultPort);
    const expressApp = express();

    // Serve static files from dist
    const distPath = path.join(__dirname, isDev ? '' : 'dist');
    console.log('[Main] Serving static files from:', distPath);
    expressApp.use(express.static(distPath));

    // Handle SPA routing
    expressApp.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });

    // Start server with error handling
    return new Promise((resolve, reject) => {
      server = expressApp.listen(availablePort, (err) => {
        if (err) {
          console.error('[Main] Server failed to start:', err);
          reject(err);
          return;
        }
        console.log(`[Main] Server started on port ${availablePort}`);
        resolve(`http://localhost:${availablePort}`);
      });
    });
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
  const configPath = path.join(app.getPath('userData'), '.config.json');
  const preLoader = path.join(__dirname, 'preload.cjs');

  let windowOptions = {
    width: width,
    height: height,
    icon: iconPath,
    webPreferences: {
      preload: preLoader,
      contextIsolation: true,    
      nodeIntegration: false
    }
  };

  // Check if config file exists and read bounds
  if (fs.existsSync(configPath)) {
    try {
      const bounds = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (bounds && bounds.width && bounds.height && bounds.x !== undefined && bounds.y !== undefined) {
        windowOptions = { ...windowOptions, ...bounds };
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

  mainWindow.on('close', () => {
    saveWindowBounds(mainWindow);
  });

  return mainWindow;
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
            console.log('[Main] Open File clicked');
            const result = await dialog.showOpenDialog({
              properties: ['openFile']
            });
            
            if (!result.canceled) {
              try {
                const filePath = result.filePaths[0];
                console.log('[Main] Reading file:', filePath);
                const content = await fsPromises.readFile(filePath, 'utf-8');
                console.log('[Main] File loaded, length:', content.length);
                
                if (!mainWindow) {
                  console.error('[Main] mainWindow is null!');
                  return;
                }
    
                mainWindow.webContents.send('file-opened', content);
                console.log('[Main] Sent file-opened event');
              } catch (err) {
                console.error('[Main] Error reading file:', err);
              }
            }
          }
        },
        { type: 'separator' },
        { role: "reload" },
        {
          label: "Exit",
          click: () => {
            saveWindowBounds(mainWindow);
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
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
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

app.whenReady().then(async () => {
  await createMainWindow();
  setupMenu();
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow();
    setupMenu();
  }
});

module.exports = { mainWindow, saveWindowBounds };