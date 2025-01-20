const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const DIALOGS = {
  OPEN_FILE: "dialog:openFile",
  SHOW_SAVE_DIALOG: "dialog:showSaveDialog",
  CREATE_PROJECT: "create-project",
  OPEN_INPUT_DIALOG: "open-input-dialog",
};

const PROJECT_NAME_SUBMITTED = "project-name-submitted";

// Open file dialog
ipcMain.handle(DIALOGS.OPEN_FILE, async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections", "createDirectory"],
  });
  return result.filePaths;
});

// Save file dialog
ipcMain.handle(DIALOGS.SHOW_SAVE_DIALOG, async () => {
  const result = await dialog.showSaveDialog({
    properties: ["createDirectory", "showOverwriteConfirmation"],
    filters: [
      {
        name: "Custom Files",
        extensions: ["mps"],
      },
    ],
  });

  const filePath = result.filePath;
  if (filePath && !fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, ""); // Create empty file
      console.log(`File created: ${filePath}`);
    } catch (err) {
      console.error("Error creating the file:", err);
      return null;
    }
  }

  return filePath;
});

// Handle creation of the project (DB)
ipcMain.handle(DIALOGS.CREATE_PROJECT, async (event, projectName) => {
  return new Promise((resolve, reject) => {
    const dbName = path.join(app.getPath("userData"), `${projectName}.db`);
    const db = new sqlite3.Database(dbName);

    db.serialize(() => {
      db.run(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)",
      );
      db.run("INSERT INTO users (name) VALUES (?)", ["Alice"]);
      db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(rows);
        }
      });
    });

    db.close((err) => {
      if (err) console.error("Error closing DB:", err.message);
    });
  });
});

// Handle input dialog for project name
ipcMain.handle(DIALOGS.OPEN_INPUT_DIALOG, () => {
  return new Promise((resolve) => {
    const inputWin = new BrowserWindow({
      width: 300,
      height: 150,
      modal: true,
      parent: BrowserWindow.getFocusedWindow(),
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    inputWin.loadFile("s.html");

    ipcMain.once(PROJECT_NAME_SUBMITTED, (event, projectName) => {
      resolve(projectName);
      inputWin.close(); // addeddodd
    });
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (!mainWindow) createWindow();
});

let mainWindow, splashWindow;

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 700,
    height: 500,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  splashWindow.loadFile("./html/splash.html");
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile("html/gui.html");

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

//app.whenReady().then(createWindow);

app.whenReady().then(() => {
  createSplashWindow();

  ipcMain.on("open-main-window", () => {
    createWindow();
    splashWindow.close();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
