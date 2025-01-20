

function showSheetInterface() {
  document.getElementById("sheet-interface").style.display = "block";
}


function saveSheet() {
  const scene = document.getElementById("scene").value;
  const set = document.getElementById("set").value;
  const synopsis = document.getElementById("synopsis").value;
  alert(
    `Sheet Saved:\nScene: ${scene}\nset: ${set}\nSynopsis: ${synopsis}`,
  );
  //document.getElementById("sheet-interface").style.display = "none";

  window.electron.openFileDialog().then(filePaths => {
    console.log(filePaths); // Handle the selected file paths
  }).catch(err => {
    console.error('File dialog failed', err);
  });}



  

  function newProjo() {
    window.electron.showSaveDialog().then(filePath => {
      console.log(filePath);  // Handle the selected file path (single file, not an array)
    }).catch(err => {
      console.error('File dialog failed', err);
    });
  }
  

  