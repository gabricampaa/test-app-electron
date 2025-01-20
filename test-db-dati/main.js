const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Database = require("better-sqlite3");
const db = require("./database");

const pathDB = "/Users/gabri/Desktop/PROGRAMMING/electron/test-db";
const dbPath = path.join(pathDB, "data.db"); //se questo lo chami olld.db carichi altri "dati"

// Inizializza il database
//const db = new Database(path.join(app.getPath("userData"), "data.db"));

//const db = new Database(dbPath);

// Crea la tabella se non esiste
/*
db.prepare(
  "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)",
).run();
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.loadFile("index.html");
  console.log(db);
}

ipcMain.on("add-user", (event, user) => {
  const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  stmt.run(user.name, user.email);
});

// Recupera gli utenti
ipcMain.handle("get-users", () => {
  const stmt = db.prepare("SELECT * FROM users");
  return stmt.all();
});

// 📥 Inserimento di una scena
ipcMain.handle("insert-scene", async (event, sceneData) => {
  db.insertScene(sceneData);
  return "Scena inserita!";
});

// 📖 Recupero di tutte le scene
ipcMain.handle("get-scenes", async () => {
  return db.getAllScenes();
});

ipcMain.handle("delete-scene", (event, id) => {
  try {
    db.deleteScene(id); // Chiamata alla funzione per eliminare la scena
    console.log(`✅ Scena con ID ${id} eliminata`);
  } catch (error) {
    console.error("❌ Errore nell'eliminazione della scena:", error);
    throw error;
  }
});

app.whenReady().then(createWindow);
