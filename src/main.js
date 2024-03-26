const { invoke } = window.__TAURI__.tauri;
import { Button } from "./js/button.js";

let verTxt = document.getElementById("software-version");
let buildType = document.getElementById("build-type");
let grid = document.getElementById("button-grid");

let page = 1;

let buttonArray = [];

async function debugInfo() {
  buildType.textContent = "Build: " + await invoke("build_type");
  verTxt.textContent = "Software Version: " + await invoke("software_version");
}

function speak(msg) {
  var msgUtt = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  msgUtt.voice = voices[12]; 
  msgUtt.volume = 1; // From 0 to 1
  msgUtt.rate = 2; // From 0.1 to 10
  msgUtt.pitch = 5; // From 0 to 2
  msgUtt.text = msg;
  window.speechSynthesis.speak(msgUtt);
}

function generateButtonGrid() {
  grid.innerHTML = "";
  for (let i = 0 + 21*(page-1); i < 21*page; i++) {
    const button = document.createElement("button");
    button.addEventListener("click", () => {
      speak(buttonArray[i].word);
    })
    button.textContent = buttonArray[i].word;
    button.appendChild(buttonArray[i].getElement());
    button.id = i;
    grid.appendChild(button);
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