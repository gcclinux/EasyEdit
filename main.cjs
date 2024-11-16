const fs = require('fs');
const fsPromises = fs.promises;
const { app, BrowserWindow, screen, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const detect = require('detect-port');
const defaultPort = 3000;
const viteDevPort = defaultPort; // Using same port for consistency

// Disable hardware acceleration
app.disableHardwareAcceleration();

let mainWindow = null;
let server = null;

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

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  try {
    const serverUrl = await setupServer(isDev);
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
    console.log('File content loaded successfully');
    
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
        { role: "togglefullscreen" },
        { type: "separator" },
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
              message: 'EasyEdit v1.0.8 \n\n EasyEdit is an easy markdown editor that allows you to write MarkDown (MD) and preview it in real-time. You can save, load .md files and export to HTML & PDF. \n\nDeveloped by: Ricardo Wagemaker <wagemra@gmail.com> \nGitHub: https://github.com/gcclinux/EasyEdit \nLicense: MIT\n',
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
      
    console.log('Attempting to open:', filePath);
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

module.exports = { mainWindow };