const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('darkMode', {
  toggle: (isDarkMode) => ipcRenderer.send('dark-mode:toggle', isDarkMode),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});

contextBridge.exposeInMainWorld('dialog', {
  openFile: (options) => ipcRenderer.invoke('dialog:openFile', options),
});

contextBridge.exposeInMainWorld('api', {
  format: (options) => ipcRenderer.invoke('api:format', options),
  getImgUrl: (options) => ipcRenderer.invoke('api:getImgUrl', options),
  watermark: (options) => ipcRenderer.invoke('api:watermark', options),
});
