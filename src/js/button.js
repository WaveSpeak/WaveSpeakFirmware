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

    constructor (json) {
        if (json.isSpecial) {
            this.isSpecial = true;
            this.word = json.word
            this.speechType = "special"
            this.id = 9999999999 //There are a lot of words, might wanna play it safe.
            this.path = json.path;
            this.img = new Image();
            this.img.src = this.path;
            return this
        }
        this.isSpecial = false;
        this.word = json.word;
        this.speechType = json.speechType;
        this.id = json.id;
        this.path = json.path;
        this.img = new Image();
        this.img.src = this.path;
    }
    getElement(){
        let button = document.createElement("button");
        button.id = this.id;
        button.textContent = this.word;
        button.appendChild(this.img);
        return button;
    }
}