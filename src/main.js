const { invoke } = window.__TAURI__.tauri;
import { Button } from "./js/button.js";

let verTxt = document.getElementById("software-version");
let buildType = document.getElementById("build-type");
let grid = document.getElementById("button-grid");
let visor = document.getElementById("visor-container");

let page = 1;

let buttonArray = [];
let sayQueue = [];

function nextPage() {
  page++;
  generateButtonGrid();
}

function prevPage() {
  page--;
  generateButtonGrid();
}

function pushQueue (button) {
  let buttonElement = button.getElement();
  sayQueue.push(button.word);
  buttonElement.addEventListener("click", () => {
    speak(button.word);
  })
  buttonElement.id = undefined;
  buttonElement.appendChild(button.img);
  visor.appendChild(buttonElement);
  generateButtonGrid(); // JavaScript, I would like to keep my fucking image elements in the grid without regenerating it.
}

function clearQueue() {
  sayQueue = [];
  visor.innerHTML = "";
}

async function debugInfo() {
  buildType.textContent = "Build: " + await invoke("build_type");
  verTxt.textContent = "Software Version: " + await invoke("software_version");
}

async function speak(msg) {
  await invoke("say", { text: msg });
}

function generateButtonGrid() {
  grid.innerHTML = "";
  for (let i = 0 + 14*(page-1); i < 14*page; i++) {
    let buttonElement = buttonArray[i].getElement();
    buttonElement.addEventListener("click", () => {
      pushQueue(buttonArray[i]);
    })
    grid.appendChild(buttonElement);
  }

}

fetch("assets/chipManifest.json").then (res => res.json()).then (json => {
  for (let i = 0; i < json.length; i++) {
    buttonArray.push(new Button(json[i]));
  }
  generateButtonGrid();
})

window.addEventListener("DOMContentLoaded", () => {
  debugInfo();
});