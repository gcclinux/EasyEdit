const fs = require('fs');
const fsPromises = fs.promises;
const { app, BrowserWindow, screen, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const express = require('express');

// Disable hardware acceleration
app.disableHardwareAcceleration();

let mainWindow;

async function createWindow() {
  const isDev = (await import('electron-is-dev')).default;
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const iconPath = path.join(__dirname, "public", process.platform === 'win32' ? 'icon.ico' : 'icon.png');

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: iconPath,
    webPreferences: {
      // preload: preloadPath,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    const app = express();
    const port = 3000;

    app.use(express.static(path.join(__dirname, 'dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    server = app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      mainWindow.loadURL(`http://localhost:${port}`);
    });
  }
}


// Define the menu template
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
      // { role: "toggledevtools" },
      { type: "separator" },
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      { type: "separator" },
      { role: "togglefullscreen" },
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
            message: 'EasyEdit v1.0 \n\n EasyEdit is an easy markdown editor that allows you to write MarkDown (MD) and preview it in real-time. You can save, load .md files and export to PDF. \n\nDeveloped by: Ricardo Wagemaker <wagemra@gmail.com> \nGitHub: https://github.com/gcclinux/EasyEdit \nLicense: MIT\n',
            buttons: ['OK']
          });
        },
      },
    ],
  }
];

// Set the application menu
const menu = Menu.buildFromTemplate(menuTemplate);
Menu.setApplicationMenu(menu);

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});