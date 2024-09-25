import * as GLib2D from "./Graphic_Lib_2D.js";
import { sprites, gameStatus, EGameStatus } from "./game.js";

//Scale: størrelse på spriten, Alpha: gjennomsiktighet. 
export function TNumber(aSpriteInfo, aPosition, aScale, aAlpha) {
    const spi = aSpriteInfo;
    const pos = aPosition;
    let scale = aScale;
    let alpha = aAlpha;
    const spNumbers = [];

//Lager tall
    function createDigit(){
        const newPos = new GLib2D.TPoint(pos.x - ((spi.width + 2) * spNumbers.length * scale), pos.y);
        const newSprite = new GLib2D.TSprite(spi, newPos);
        newSprite.setScale(scale);
        newSprite.setAlpha(alpha)
        spNumbers.push(newSprite);
    }
    createDigit();

    this.draw = function () {
        for (let i = 0; i < spNumbers.length; i++) {
            spNumbers[i].setAlpha(alpha);
            spNumbers[i].draw();
            //denne funksjonen "skriver/printer" tallet som blir satt inn i digits ovenfor
        }
    }

    this.update = function(aValue){
        if(aValue < 0){
            return 0;
        }
        const digits = aValue.toString().length;
        while(digits > spNumbers.length){
            createDigit();
        }
        while(digits < spNumbers.length){
            spNumbers.pop();
        }
        let divider = 1;
        for(let i = 0; i < spNumbers.length; i++){
            spNumbers[i].setIndex(Math.floor(aValue/divider) % 10);
            divider *= 10;
        }
        return aValue;
    }

    //funksjon som gjør det mulig å sette gjennomsiktigheten for hele tallrekka 
    this.setAlpha = function(aAlpha){
        alpha = aAlpha;
        for(let i = 0; i < spNumbers.length; i++){
            spNumbers[i].setAlpha(alpha);
        }
    }
    //funksjon som gjør det mulig å sette skalen for hele tallrekka 
    this.setScale = function(aScale){
        scale = aScale;
        for(let i = 0; i < spNumbers.length; i++){
            spNumbers[i].setAlpha(scale);
        }
    }
}//End of class TNumber

//Klasse for å tegne live poengsum(number) og endelig poengsum (numberScore)
export function TGameScore() {
    const spi = sprites.Number;
    let score = 0;
    const number = new TNumber(spi, new GLib2D.TPoint(180, 20), 1, 0.3);
    const numberScore = new TNumber(spi, new GLib2D.TPoint(730, 300), 1, 1);
   

    this.draw = function () {//skriver create number. Hver gang tegner en frame; vise dette tallet
        switch (gameStatus) {
            case EGameStatus.Running:
                number.draw(); //live poengscore
                break;
            case EGameStatus.GameOver:
                numberScore.draw(); //Endelig Poenscore 
                break;
        }
    }
//Funksjono for å sette poenscore. Blir klat på i showScore i game.js
    this.setScore = function (aDelta) {
        score += aDelta;
        number.update(score);
        numberScore.update(score);
    }

//Funksjon for å nullstille score, settes til null i newGame()
    this.resetScore = function(){
        score = 0;
        number.update(score);
        numberScore.update(score);
    }
}//End of class TGameScore

