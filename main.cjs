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

  // Handle file open
  ipcMain.handle('dialog:openFile', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [{ name: 'Markdown Files', extensions: ['md'] }]
    });
    if (result.canceled) return;
    const filePath = result.filePaths[0];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent;
  });
}

// Define the menu template
const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Load Document",
        click: async () => {
          const content = await mainWindow.webContents.send('open-file');
          mainWindow.webContents.send('file-opened', content);
        },
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
        label: "Learn More",
        click: async () => {
          const { shell } = require('electron');
          await shell.openExternal('https://electronjs.org');
        },
      },
    ],
  },
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