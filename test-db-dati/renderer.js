/*

document.getElementById("saveBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  window.api.addUser(name, email);
  loadUsers();
});

async function loadUsers() {
  const users = await window.api.getUsers();
  const userList = document.getElementById("userList");
  userList.innerHTML = "";

  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = `${user.name} - ${user.email}`;
    userList.appendChild(li);
  });
}

// Carica gli utenti al caricamento della pagina
window.onload = loadUsers;
 */

document.getElementById("addSceneBtn").addEventListener("click", async () => {
  const newScene = {
    Scene: "2",
    INT_EXT: "EXT",
    SYNOPSIS: "Scena all'aperto",
    SET: "Parco",
    scriptPage: "3",
    ScriptDay: "Mercoledì",
    DAY_Night: "Giorno",
    lenght_page: 1,
    lenght_fraction: 0,
    cast_members: "Mario, Luigi",
    notes: "Attenzione alla luce solare",
  };

  // ✅ Usa window.api invece di db
  const response = await window.api.insertScene(newScene);
  alert(response);
});

// Carica e mostra tutte le scene
document.getElementById("loadScenesBtn").addEventListener("click", async () => {
  const scenes = await window.api.getScenes(); // ✅ Usa window.api
  const list = document.getElementById("sceneList");
  list.innerHTML = "";

  scenes.forEach((scene) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Scena ${scene.Scene}: ${scene.SYNOPSIS}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = async () => {
      await window.api.deleteScene(scene.id); // ✅ Usa window.api
      alert(`Scena ${scene.Scene} eliminata!`);
      listItem.remove();
    };

    listItem.appendChild(deleteBtn);
    list.appendChild(listItem);
  });
});
const newScene = {
  Scene: "2",
  INT_EXT: "EXT",
  SYNOPSIS: "Scena all'aperto",
  SET: "Parco",
  scriptPage: "3",
  ScriptDay: "Mercoledì",
  DAY_Night: "Giorno",
  lenght_page: 1,
  lenght_fraction: 0,
  cast_members: "Mario, Luigi",
  background_actors: "", // ✅ AGGIUNTO
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
  notes: "Attenzione alla luce solare",
};

document
  .getElementById("deleteSceneBtn")
  .addEventListener("click", async () => {
    const sceneId = prompt("Inserisci l'ID della scena da eliminare:");
    if (sceneId) {
      try {
        await window.api.deleteScene(sceneId); // Invia richiesta IPC per eliminare la scena
        console.log(`Scena ${sceneId} eliminata con successo`);
      } catch (error) {
        console.error("Errore nell'eliminazione della scena:", error);
      }
    }
  });
