const { ipcRenderer, contextBridge } = require("electron");

//qui crei func prototype

const WINDOW_API = {
  //SEND MESSAGE FROM RENDERE ETO MAIN

  greet: (message) => ipcRenderer.send("ciao", message), //ciao è il nome del canale che usiamo e message è il messaggio. questo non ritorna valuez
  getVersion: () => ipcRenderer.invoke("get/version"), //returns a promise, quindi leggi value returned con async ->aka, l'app funziona pure mentre aspetta
  isDev: () => ipcRenderer.sendSync("get/sync/dev"), //sends syncronous message -> blocca il main thread
};

contextBridge.exposeInMainWorld("api", WINDOW_API);
