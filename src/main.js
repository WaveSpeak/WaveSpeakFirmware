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
  let buttonElement = button.cloneNode(true);
  //TODO: Make button call speak(msg : String) on click where button.word is the msg to be spoken
  visor.appendChild(buttonElement);
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
  console.log(msg);
  await invoke("say", { text: msg });
}

function generateButtonGrid() {
  grid.innerHTML = "";
  for (let i = 0 + 14*(page-1); i < 14*page; i++) {
    let buttonElement = buttonArray[i].getElement();
    buttonElement.addEventListener("click", () => {
      pushQueue(buttonElement);
    })
    grid.appendChild(buttonElement);
  }

}

fetch("assets/chipManifest.json").then (res => res.json()).then (json => {
  for (let i = 0; i < json.length; i++) {
    buttonArray.push(new Button(json[i], false));
  }
  generateButtonGrid();
})

window.addEventListener("DOMContentLoaded", () => {
  debugInfo();
});