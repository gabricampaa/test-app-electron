const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");
const path = require("path");

// Funzione per caricare il database SQLite direttamente dal file .mps
async function openDbFromMps(mpsFilePath) {
  const mpsData = fs.readFileSync(mpsFilePath);
  const header = mpsData.slice(0, 5).toString();
  if (header !== "MPSDB") {
    throw new Error("Invalid MPS file format.");
  }

  const dbSize = mpsData.readUInt32BE(5);
  const dbData = mpsData.slice(9, 9 + dbSize);

  // Crea un database SQLite in memoria
  const db = await open({
    filename: ":memory:",
    driver: sqlite3.Database,
  });

  // Carica i dati dal buffer nel database in memoria
  await db.exec(`ATTACH DATABASE '' AS file_db`);
  await db.exec(`BEGIN`);
  db.exec(dbData.toString(), (err) => {
    if (err) throw err;
  });
  await db.exec(`COMMIT`);

  db.close();
  return db;
}

// Funzione per salvare il database SQLite modificato nel file .mps
async function saveDbToMps(db, mpsFilePath) {
  const dbBackupPath = path.join(__dirname, "temp_backup.db");

  // Esegui il backup del database su file temporaneo
  await db.exec(`VACUUM INTO '${dbBackupPath}'`);
  const dbData = fs.readFileSync(dbBackupPath);
  fs.unlinkSync(dbBackupPath);

  const header = Buffer.from("MPSDB");
  const sizeBuffer = Buffer.alloc(4);
  sizeBuffer.writeUInt32BE(dbData.length, 0);

  const mpsData = Buffer.concat([header, sizeBuffer, dbData]);
  fs.writeFileSync(mpsFilePath, mpsData);
  console.log(`Database salvato in ${mpsFilePath}`);
}

// Esempio di utilizzo

(async () => {
  const mpsFile = "database.mps";

  // Carica o crea il database
  let db;
  if (fs.existsSync(mpsFile)) {
    db = await openDbFromMps(mpsFile);
  } else {
    db = await open({ filename: ":memory:", driver: sqlite3.Database });
    await db.exec("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)");
    await db.run("INSERT INTO users (name) VALUES (?)", ["Alice"]);
    await saveDbToMps(db, mpsFile);
  }

  // Esegui operazioni di lettura/scrittura
  const users = await db.all("SELECT * FROM users");
  console.log(users);

  await db.run("INSERT INTO users (name) VALUES (?)", ["Bob"]);
  await saveDbToMps(db, mpsFile);

  const usersz = await db.all("SELECT * FROM users");
  console.log(usersz);

  await db.close();
})();

/////*  crea file mps e embedda dentro, dopo 25 byte, il database.un altra funzione lo estrae, lo modifica normalmente ecc, e un altra ancora lo reinserisce nel file mps DI MODO CHE SIA EMBEDDED.i 25 byte all'inizio possono essere quanti vuoi tu, e possono contenere la lenght del db, così lui estrae bene*/
