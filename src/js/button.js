export class Button {
    /*
    * Buttons probably wont need to be created soley in a JavaScript File.
    constructor(word, id, speechType) {
        this.word = word;
        this.speechType = speechType;
        this.id = id;
        this.path = "";
        this.img = new Image();
        this.img.src = this.path;
    }*/

    constructor (json, isSpecial = false) {
        if (isSpecial) {
            this.word = "9921"
            this.speechType = "special"
            this.id = 9999999999 //There are a lot of words, might wanna play it safe.
            this.path = "/assets/chips/placeholder.png"
            this.img = new Image();
            this.img.src = this.path;
        }
        this.word = json.word;
        this.speechType = json.speechType;
        this.id = json.id;
        this.path = json.path;
        this.img = new Image();
        this.img.src = this.path;
    }
    getElement() {
        let button = document.createElement("button");
        button.textContent = this.word;
        button.appendChild(this.img);
        button.id = this.id;
        return button;
    }
}