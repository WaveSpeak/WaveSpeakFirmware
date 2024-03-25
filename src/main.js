const { invoke } = window.__TAURI__.tauri;

let buttonArray = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21"];

function generateButtonGrid() {
  const grid = document.getElementById("button-grid");
  for (let i = 0; i < 21; i++) {
    const button = document.createElement("button");
    button.textContent = buttonArray[i];
    grid.appendChild(button);
  }
}

generateButtonGrid();

window.addEventListener("DOMContentLoaded", () => {
  alert("hello!");
});