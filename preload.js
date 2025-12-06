const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (content) => ipcRenderer.invoke('dialog:saveFile', content),
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),
  isGitRepository: (dirPath) => ipcRenderer.invoke('fs:isGitRepository', dirPath),
  getBasename: (filePath) => ipcRenderer.invoke('path:basename', filePath),
  handleFileOpened: (callback) => ipcRenderer.on('file-opened', callback),
  handlePreviewSpacing: (callback) => {
    if (callback) {
      ipcRenderer.on('update-preview-spacing', callback);
    } else {
      ipcRenderer.removeAllListeners('update-preview-spacing');
    }
  },
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getVersionInfo: () => ipcRenderer.invoke('get-version-info'),
  getLineHeight: () => ipcRenderer.send('get-line-height'),
  setLineHeight: (callback) => {
    if (callback) {
      ipcRenderer.on('line-height-value', (_event, value) => callback(value));
    } else {
      ipcRenderer.removeAllListeners('line-height-value');
    }
  },
  git: {
    clone: (args) => ipcRenderer.invoke('git:clone', args),
    pull: (args) => ipcRenderer.invoke('git:pull', args),
    push: (args) => ipcRenderer.invoke('git:push', args),
    fetch: (args) => ipcRenderer.invoke('git:fetch', args),
    status: (args) => ipcRenderer.invoke('git:status', args),
    add: (args) => ipcRenderer.invoke('git:add', args),
    commit: (args) => ipcRenderer.invoke('git:commit', args),
    log: (args) => ipcRenderer.invoke('git:log', args),
    currentBranch: (args) => ipcRenderer.invoke('git:currentBranch', args),
    listBranches: (args) => ipcRenderer.invoke('git:listBranches', args),
    checkout: (args) => ipcRenderer.invoke('git:checkout', args),
    listFiles: (args) => ipcRenderer.invoke('git:listFiles', args),
    readFile: (args) => ipcRenderer.invoke('git:readFile', args),
    writeFile: (args) => ipcRenderer.invoke('git:writeFile', args),
    isGitRepo: (args) => ipcRenderer.invoke('git:isGitRepo', args),
    init: (args) => ipcRenderer.invoke('git:init', args),
    findRepoRoot: (args) => ipcRenderer.invoke('git:findRepoRoot', args),
  }
});