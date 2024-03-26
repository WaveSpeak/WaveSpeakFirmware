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
        this.word = json.word;
        this.speechType = json.speechType;
        this.id = json.id;
        this.path = json.path;
        this.img = new Image();
        this.img.src = this.path;
    }
    getElement() {
        return this.img;
    }
}