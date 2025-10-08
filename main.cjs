const fs = require('fs');
const fsPromises = fs.promises;
const { app, BrowserWindow, screen, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const express = require('express');
const { detect } = require('detect-port');
const defaultPort = 3024;
const viteDevPort = defaultPort; // Using same port for consistency
const { shell } = require('electron');
const { exec } = require('child_process');
const https = require('https');
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
    return port;
  } else {
    const app = express();
    app.use(express.static(path.join(__dirname, 'dist')));
    
    // Fallback middleware: serve index.html for any request not handled by static files.
    // Use a simple middleware instead of a route pattern to avoid path-to-regexp
    // parsing differences between the dev environment and the packaged app.
    app.use((req, res) => {
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
    minWidth: 1200,
    minHeight: 800,
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

  // Ensure the application menu is removed and the window menu bar is hidden.
  // This is a temporary measure to disable the Electron menubar entirely.
  try {
    // Clear any application menu that may have been set previously.
    Menu.setApplicationMenu(null);
    // Hide the menu bar on the main window (works on Windows/Linux).
    if (mainWindow && typeof mainWindow.setMenuBarVisibility === 'function') {
      mainWindow.setMenuBarVisibility(false);
    }
  } catch (err) {
    console.error('Failed to remove/hide application menu:', err);
  }

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
        // Detect WSL (Windows Subsystem for Linux). In WSL, Linux openers like xdg-open
        // are often unavailable; prefer calling the Windows host to open the URL.
        let isWSL = false;
        try {
          if (fs.existsSync('/proc/version')) {
            const ver = fs.readFileSync('/proc/version', 'utf8').toLowerCase();
            if (ver.indexOf('microsoft') !== -1 || ver.indexOf('wsl') !== -1) isWSL = true;
          }
        } catch (wslErr) {
          // ignore
        }

        if (isWSL) {
          try {
            // Prefer cmd.exe start which opens the default Windows browser from WSL.
            exec(`cmd.exe /C start "" "${url.replace(/"/g, '\\"')}"`, (e) => { if (e) console.error('Fallback cmd.exe start failed:', e); });
            return { success: true, fallback: true, wsl: true };
          } catch (we) {
            console.error('WSL fallback failed:', we);
            // continue to general Linux attempts below
          }
        }
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

// Support opening external links from renderer safely when running inside Electron
ipcMain.handle('open-external', async (_event, url) => {
  // Detect WSL up-front so we can prefer Windows host openers instead of shell.openExternal
  let isWSL = false;
  try {
    if (fs.existsSync('/proc/version')) {
      const ver = fs.readFileSync('/proc/version', 'utf8').toLowerCase();
      if (ver.indexOf('microsoft') !== -1 || ver.indexOf('wsl') !== -1) isWSL = true;
    }
  } catch (wslErr) {
    // ignore
  }

  // If running inside WSL, prefer invoking the Windows cmd.exe to open the URL
  if (isWSL) {
    try {
      // Try plain cmd.exe first (should be available in WSL distros), else try absolute path
      const tryCmd = (cmd) => new Promise((resolve) => {
        exec(`${cmd} /C start "" "${url.replace(/"/g, '\\"')}"`, (e) => {
          if (e) {
            console.error('WSL cmd fallback failed for', cmd, e);
            resolve({ success: false, error: String(e) });
          } else {
            resolve({ success: true, used: cmd });
          }
        });
      });

      let res = await tryCmd('cmd.exe');
      if (!res.success) {
        // common absolute path in WSL mounts
        const alt = '/mnt/c/Windows/System32/cmd.exe';
        if (fs.existsSync(alt)) {
          res = await tryCmd(alt);
        }
      }
      return res;
    } catch (we) {
      console.error('WSL open-external fallback failed:', we);
      return { success: false, error: String(we) };
    }
  }

  // Try shell.openExternal first, then fall back to platform commands if necessary.
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (err) {
    console.warn('shell.openExternal failed, attempting platform fallback:', err);
    // Platform-specific fallbacks
    try {
      if (process.platform === 'darwin') {
        exec(`open "${url}"`, (e) => { if (e) console.error('Fallback open failed:', e); });
        return { success: true, fallback: true };
      } else if (process.platform === 'win32') {
        // start is a shell builtin on Windows; use cmd to run it
        exec(`cmd /c start "" "${url}"`, (e) => { if (e) console.error('Fallback start failed:', e); });
        return { success: true, fallback: true };
      } else {
        // Linux and other Unix-like: try common openers by absolute path first
        const candidates = [
          '/usr/bin/xdg-open',
          '/bin/xdg-open',
          '/usr/local/bin/xdg-open',
          '/usr/bin/gio',
          '/usr/bin/gnome-open',
          '/usr/bin/kde-open5'
        ];
        let used = false;
        for (const c of candidates) {
          try {
            if (fs.existsSync(c)) {
              // gio needs different args: 'gio open <url>' works
              if (c.endsWith('/gio')) {
                exec(`${c} open "${url}"`, (e) => { if (e) console.error(`Fallback ${c} failed:`, e); });
              } else {
                exec(`${c} "${url}"`, (e) => { if (e) console.error(`Fallback ${c} failed:`, e); });
              }
              used = true;
              break;
            }
          } catch (fsErr) {
            // ignore and try next
          }
        }

        if (!used) {
          // Last resort: try xdg-open on PATH (may still fail if missing)
          exec(`xdg-open "${url}"`, (e) => { if (e) console.error('Fallback xdg-open failed:', e); });
        }

        return { success: true, fallback: true, usedPath: used };
      }
    } catch (err2) {
      console.error('All methods to open external URL failed:', err2);
      return { success: false, error: String(err2) };
    }
  }
});

// Provide version info to renderer processes in packaged apps where fetch('/package.json') is unavailable
ipcMain.handle('get-version-info', async () => {
  const result = { version: 'unknown', latest: 'unknown' };
  try {
    // Read package.json from app directory
    const pkgPath = path.join(__dirname, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
        const pkg = JSON.parse(pkgRaw);
        result.version = pkg.version || 'unknown';
      } catch (e) {
        // ignore
      }
    }

    // Try local latest.json first
    const localLatest = path.join(__dirname, 'release', 'latest.json');
    if (fs.existsSync(localLatest)) {
      try {
        const latestRaw = fs.readFileSync(localLatest, 'utf8');
        const latest = JSON.parse(latestRaw);
        result.latest = latest.version || 'unknown';
        return result;
      } catch (e) {
        // ignore and try network
      }
    }

    // Fetch remote latest.json from GitHub raw
    const ghUrl = 'https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/release/latest.json';
    result.latest = await new Promise((resolve) => {
      https.get(ghUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json.version || 'unknown');
          } catch (e) {
            resolve('unknown');
          }
        });
      }).on('error', () => resolve('unknown'));
    });
  } catch (err) {
    console.error('get-version-info failed:', err);
  }
  return result;
});

// App lifecycle management
app.whenReady().then(async () => {
  await createMainWindow();
  // Temporarily disable the application menu. To re-enable, uncomment the
  // call to setupMenu() below.
  // setupMenu();
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