const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadFile("index.html");
}
app.whenReady().then(createWindow);

//ipc handlers

//ciao è il nome del "channel" che stiamo usando
ipcMain.on("ciao", (event, args) => {
  console.log(args);
});

//listent for invoke event. siccome è asincrona, il resto del thread va avanti. se tu clicchi get vers, puoi incrementare at th same time
ipcMain.handle("get/version", async (event, args) => {
  await sleep(4000);
  return 1;
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

//listen for SYNCORNOUS response - aspetta 4 sec for demo pourpose
ipcMain.on("get/sync/dev", (event, args) => {
  setTimeout(() => {
    event.returnValue = 123;
  }, 4000);
});
