const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "SCENEz.db");
const db = new Database(dbPath);

// ✅ Funzione per creare la tabella se non esiste
function initializeDatabase() {
  const tableExists = db
    .prepare(
      `
    SELECT name FROM sqlite_master WHERE type='table' AND name='SheetDefault';
  `,
    )
    .get();

  if (!tableExists) {
    console.log("🔨 Creazione della tabella SheetDefault...");
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS SheetDefault (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Scene TEXT,
        INT_EXT TEXT,
        SYNOPSIS TEXT,
        SETT TEXT,
        scriptPage TEXT,
        ScriptDay TEXT,
        DAY_Night TEXT,
        lenght_page INTEGER,
        lenght_fraction INTEGER,
        cast_members TEXT,
        background_actors TEXT,
        stunts TEXT,
        vehicles TEXT,
        props TEXT,
        camera TEXT,
        sfx TEXT,
        wardrobe TEXT,
        muh TEXT,
        animals TEXT,
        sound TEXT,
        art_department TEXT,
        set_dressing TEXT,
        greenery TEXT,
        special_equipment TEXT,
        security TEXT,
        additional_labor TEXT,
        vfx TEXT,
        mechanical_fx TEXT,
        miscellaneous TEXT,
        notes TEXT
      )
    `,
    ).run();
    console.log("✅ Tabella SheetDefault creata con successo!");
  } else {
    console.log("✅ La tabella SheetDefault esiste già.");
  }
}

// 🔄 Inizializza il database al caricamento
initializeDatabase();

// 🔎 Funzione per inserire una scena
const insertSceneStmt = db.prepare(`
  INSERT INTO SheetDefault (
    Scene, INT_EXT, SYNOPSIS, SETT, scriptPage, ScriptDay, DAY_Night,
    lenght_page, lenght_fraction, cast_members, background_actors, stunts,
    vehicles, props, camera, sfx, wardrobe, muh, animals, sound,
    art_department, set_dressing, greenery, special_equipment, security,
    additional_labor, vfx, mechanical_fx, miscellaneous, notes
  ) VALUES (
    @Scene, @INT_EXT, @SYNOPSIS, @SETT, @scriptPage, @ScriptDay, @DAY_Night,
    @lenght_page, @lenght_fraction, @cast_members, @background_actors, @stunts,
    @vehicles, @props, @camera, @sfx, @wardrobe, @muh, @animals, @sound,
    @art_department, @set_dressing, @greenery, @special_equipment, @security,
    @additional_labor, @vfx, @mechanical_fx, @miscellaneous, @notes
  )
`);

function insertScene(sceneData) {
  const defaultScene = {
    Scene: "",
    INT_EXT: "",
    SYNOPSIS: "",
    SETT: "",
    scriptPage: "",
    ScriptDay: "",
    DAY_Night: "",
    lenght_page: 0,
    lenght_fraction: 0,
    cast_members: "",
    background_actors: "",
    stunts: "",
    vehicles: "",
    props: "",
    camera: "",
    sfx: "",
    wardrobe: "",
    muh: "",
    animals: "",
    sound: "",
    art_department: "",
    set_dressing: "",
    greenery: "",
    special_equipment: "",
    security: "",
    additional_labor: "",
    vfx: "",
    mechanical_fx: "",
    miscellaneous: "",
    notes: "",
  };

  const data = { ...defaultScene, ...sceneData };
  insertSceneStmt.run(data);
}

function getAllScenes() {
  const stmt = db.prepare(`
    SELECT * FROM SheetDefault;
  `);
  return stmt.all(); // Restituisce tutte le righe
}

// Funzione per eliminare una scena
function deleteScene(id) {
  const stmt = db.prepare(`
    DELETE FROM SheetDefault WHERE id = ?;
  `);
  stmt.run(id); // Esegui la query con l'id della scena
}

module.exports = {
  insertScene,
  getAllScenes,
  deleteScene,
};
