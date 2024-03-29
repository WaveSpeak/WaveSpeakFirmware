const { invoke } = window.__TAURI__.tauri;
import { Button } from "./js/button.js";

let verTxt = document.getElementById("software-version");
let buildType = document.getElementById("build-type");
let innerResolution = document.getElementById("inner-resolution");
let screenResolution = document.getElementById("screen-resolution");
let grid = document.getElementById("button-grid");
let visor = document.getElementById("visor-container");

let page = 1;

let buttonArray = [];
let actionArray = [];
let sayQueue = [];

function nextPage() {
  if ((page * 14) >= buttonArray.length) {
    return;
  }
  page++;
  generateButtonGrid();
}

function prevPage() {
  if (page == 1) {
    return;
  }
  page--;
  generateButtonGrid();
}

function pushQueue (button) {
  let buttonElement = button.cloneNode(true);
  sayQueue.push(buttonElement.textContent);
  buttonElement.addEventListener("click", () => {
    speak(buttonElement.textContent);
  })
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
  innerResolution.textContent = `Screen Resolution: ${window.innerWidth}x${window.innerHeight}`
  screenResolution.textContent = `Screen Resolution: ${screen.width}x${screen.height}`
}

async function speak(msg) {
  var utterance = new SpeechSynthesisUtterance(msg);
  window.speechSynthesis.speak(utterance);
  console.log(msg);
  await invoke("say", { text: msg });
}

function speakSayQueue() {
  speak(sayQueue.join(" "));
}

function decorateSpecialButton(button) {
  let buttonElement = button.getElement();
  switch (button.word) {
    case "nextPage":  
      buttonElement.addEventListener("click", () => {
        nextPage();
      })
      break;
    case "previousPage":
      buttonElement.addEventListener("click", () => {
        prevPage();
      })
      break;
    case "speak":
      buttonElement.addEventListener("click", () => {
        speakSayQueue();
      })
      break;
    case "clearQueue":
      buttonElement.addEventListener("click", () => {
        clearQueue();
      })
      break;
    default:
      console.error(`Button ${button.word} is not a special button that has functionality.
      Is it spelled correctly? Is it in decorateSpecialButton()?
      This chip/button has been added but has no functionality.`);
      buttonElement.children[0].src = "/assets/chips/missing.png";
      buttonElement.classList.add("missing");
      return buttonElement
  }
  buttonElement.classList.add("special");
  return buttonElement;
}

function generateButtonGrid() {
  console.log(actionArray);
  grid.innerHTML = "";
  let startIndex = (page - 1) * 14;
  let endIndex = page * 14;
  console.log(`start: ${startIndex}, end: ${endIndex}`);
  for (let i = startIndex; i < endIndex; i++) { 
    if (i < buttonArray.length) {
      let buttonElement = buttonArray[i].getElement();
      buttonElement.addEventListener("click", () => {
        pushQueue(buttonElement);
      })
      grid.appendChild(buttonElement);
    } else {
      let placeHolder = document.createElement("button");
      grid.appendChild(placeHolder);
    }
  }
  for (let i = 0; i < actionArray.length; i++) {
    grid.appendChild(decorateSpecialButton(actionArray[i]));
  }
}

fetch("assets/chipManifest.json").then (res => res.json()).then (json => {
  for (let i = 0; i < json.length; i++) {
    if (json[i].isSpecial) {
      actionArray.push(new Button(json[i]));
      continue;
    }
    buttonArray.push(new Button(json[i]));
  }
  pushQueue(buttonArray[0].getElement());
  pushQueue(buttonArray[1].getElement());
  pushQueue(buttonArray[2].getElement());
  generateButtonGrid();
})

window.addEventListener("DOMContentLoaded", () => {
  debugInfo();
});
