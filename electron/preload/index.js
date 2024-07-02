const { contextBridge, ipcRenderer } = require('electron/renderer');

contextBridge.exposeInMainWorld('darkMode', {
  toggle: (isDarkMode) => ipcRenderer.send('dark-mode:toggle', isDarkMode),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});

contextBridge.exposeInMainWorld('dialog', {
  openFile: (options) => ipcRenderer.invoke('dialog:openFile', options),
});

const apiList = ['format', 'getImgUrl', 'watermark', 'resize', 'extract'];

const apiMethods = {};
apiList.forEach((api) => {
  apiMethods[api] = (options) => ipcRenderer.invoke(`api:${api}`, options);
});

contextBridge.exposeInMainWorld('api', apiMethods);
