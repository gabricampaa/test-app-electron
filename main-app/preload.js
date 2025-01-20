const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openFileDialog: () => ipcRenderer.invoke("dialog:openFile"),
  createProject: (projectName) =>
    ipcRenderer.invoke("create-project", projectName),
  openInputDialog: () => ipcRenderer.invoke("open-input-dialog"),
  showSaveDialog: () => ipcRenderer.invoke("dialog:showSaveDialog"),
});

contextBridge.exposeInMainWorld("electronAPI", {
  openMainWindow: () => ipcRenderer.send("open-main-window"),
});
