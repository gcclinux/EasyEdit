const { app, BrowserWindow, screen, Menu, dialog, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// Disable hardware acceleration
app.disableHardwareAcceleration();

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const iconPath = path.join(__dirname, "public", process.platform === 'win32' ? 'icon.ico' : 'icon.png');
  const preloadPath = path.join(__dirname, "preload.js");

  // Check if preload.js exists
  if (!fs.existsSync(preloadPath)) {
    console.error(`Preload script not found: ${preloadPath}`);
    return;
  }

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    icon: iconPath,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL("http://localhost:3000");
}

// Define the menu template
const menuTemplate = [
  {
    label: "File",
    submenu: [
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
      { role: "pasteandmatchstyle" },
      { role: "delete" },
      { role: "selectall" },
    ],
  },
  {
    label: "View",
    submenu: [
      { role: "toggledevtools" },
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
            type: 'error',
            title: 'EasyEdit',
            message: 'EasyEdit v1.0 \n\n EasyEdit is an easy markdown editor that allows you to write MarkDown (MD) and preview it in real-time. You can save, load .md files and export to PDF. \n',
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