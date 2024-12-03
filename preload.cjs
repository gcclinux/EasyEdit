// preload.cjs
const { contextBridge, ipcRenderer } = require('electron');

console.log('[Preload] Initializing...');

contextBridge.exposeInMainWorld('electron', {
  debugLog: (message) => {
    console.log('[Renderer Debug]:', message);
    ipcRenderer.send('debug-channel', message);
  },
  onFileOpened: (callback) => {
    console.log('[Preload] Registering file-opened handler');
    
    const wrappedCallback = (event, content) => {
      console.log('[Preload] File-opened event received');
      ipcRenderer.send('debug-channel', 'Processing file-opened event');
      callback(event, content);
    };

    ipcRenderer.on('file-opened', wrappedCallback);
    ipcRenderer.send('debug-channel', 'Handler registered');
    
    return () => {
      ipcRenderer.removeListener('file-opened', wrappedCallback);
      console.log('[Preload] Handler removed');
    };
  }
});

ipcRenderer.send('renderer-ready');
console.log('[Preload] Initialization complete');