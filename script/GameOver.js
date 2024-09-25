"use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import { sprites, EGameStatus, gameStatus, gameProps } from "./game.js";
import { TNumber, TGameScore } from "./numbers.js";

//Tavle som kommer når man går i gameOver status. 
export function TGameOverBoard() {
    const spi = sprites.GameOver;
    const posGameOverBoar = new GLib2D.TPoint(cvs.width / 2 - spi.width/2, cvs.height / 2 - spi.height/2);
    const spriteGameOverBoard = new GLib2D.TSprite(spi, posGameOverBoar);


this.draw = function () {
    switch (gameStatus) {
        case EGameStatus.GameOver:
            spriteGameOverBoard.setIndex(1);
            spriteGameOverBoard.draw();
            break;
    }
}

this.update = function () {
    switch (gameStatus) {
        case EGameStatus.GameOver:
            break;

    }
}
}