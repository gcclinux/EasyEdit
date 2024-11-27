const fs = require('fs');
const fsPromises = fs.promises;
const { app, BrowserWindow, screen, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const detect = require('detect-port');
const defaultPort = 3000;
const viteDevPort = defaultPort; // Using same port for consistency
const { shell } = require('electron');

// Disable hardware acceleration
app.disableHardwareAcceleration();

let mainWindow = null;
let server = null;

function saveWindowBounds(window) {
  const bounds = window.getBounds();
  const configPath = path.join(app.getPath('userData'), '.config.json');
  //console.log('Saving window bounds to:', configPath);
  fs.writeFileSync(configPath, JSON.stringify(bounds, null, 2));
  //console.log('Window bounds saved:', bounds);
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

async function createMainWindow() {
  const isDev = (await import('electron-is-dev')).default;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const iconPath = path.join(__dirname, 'public', process.platform === 'win32' ? 'icon.ico' : 'icon.png');
  const configPath = path.join(app.getPath('userData'), '.config.json');

  let windowOptions = {
    width: width,
    height: height,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
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
          label: 'About',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'EasyEdit',
              message: 'EasyEdit v1.2.5 \n\n EasyEdit is an easy markdown editor that allows you to write MarkDown (MD) and preview it in real-time. You can save, load .md files and export to HTML & PDF. \n\n'
              +'Developed by: Ricardo Wagemaker https://github.com/gcclinux\n'
              +'Contributed by: Lewis Halstead https://github.com/Lewish1998\n\n'
              +'GitHub: https://github.com/gcclinux/EasyEdit \n'
              +'License: MIT\n',
              buttons: ['OK']
            });
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

module.exports = { mainWindow, saveWindowBounds };