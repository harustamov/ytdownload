const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectDownloadLocation: () => ipcRenderer.invoke('select-download-location'),
    openDownloadsFolder: () => ipcRenderer.invoke('open-downloads-folder')
});
