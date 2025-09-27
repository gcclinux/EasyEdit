const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (content) => ipcRenderer.invoke('dialog:saveFile', content),
  handleFileOpened: (callback) => ipcRenderer.on('file-opened', callback),
  handlePreviewSpacing: (callback) => {
    if (callback) {
      ipcRenderer.on('update-preview-spacing', callback);
    } else {
      ipcRenderer.removeAllListeners('update-preview-spacing');
    }
  },
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getLineHeight: () => ipcRenderer.send('get-line-height'),
  setLineHeight: (callback) => {
    if (callback) {
      ipcRenderer.on('line-height-value', (_event, value) => callback(value));
    } else {
      ipcRenderer.removeAllListeners('line-height-value');
    }
  }
});