function changeSheet(direction) {
  const sheetElement = document.getElementById("sheetNumberInfo");
  const leftArrow = document.getElementById("leftArrow");
  const currentText = sheetElement.innerText;
  let currentSheet = parseInt(currentText.replace("Sheet ", "").trim());

  currentSheet += direction; // Modifica il numero di Sheet

  // Disabilita la freccia sinistra se il numero è 1
  if (currentSheet <= 1) {
    currentSheet = 1; // Assicurati che non vada sotto 1
    leftArrow.style.opacity = 0.5; // Riduci l'opacità per dare l'idea di disabilitato
    leftArrow.style.cursor = "not-allowed"; // Cambia il cursore per indicare disabilitato
  } else {
    leftArrow.style.opacity = 1; // Ripristina l'opacità normale
    leftArrow.style.cursor = "pointer"; // Ripristina il cursore
  }

  sheetElement.innerHTML = `Sheet ${currentSheet}
     <span class="arrow" id="leftArrow" onclick="changeSheet(-1)" style="cursor: pointer;">&#8592;</span>
     <span class="arrow" onclick="changeSheet(1)" style="cursor: pointer;">&#8594;</span>`;
}
