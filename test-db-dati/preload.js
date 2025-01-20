const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  addUser: (name, email) => ipcRenderer.send("add-user", { name, email }),
  getUsers: () => ipcRenderer.invoke("get-users"),
  insertScene: (sceneData) => ipcRenderer.invoke("insert-scene", sceneData),
  getScenes: () => ipcRenderer.invoke("get-scenes"),
  deleteScene: (id) => ipcRenderer.invoke("delete-scene", id),
});
