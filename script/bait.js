"use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import { sprites, gameStatus, EGameStatus, gameBoardSize} from "./game.js"
import { TBoardCell } from "./board.js";

export function TBait() {
    const randomCol = Math.floor(Math.random() * gameBoardSize.col);
    const randomRow = Math.floor(Math.random() * gameBoardSize.row);
    const boardCell =  new TBoardCell(randomCol,randomRow);
    
    const spi = sprites.Bait;
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const spriteBait = new GLib2D.TSprite(spi,pos);

//Når denne blir kalt på: tegner epple på en ny randome plass.
    this.update = function(){
        let randomCol = Math.floor(Math.random()*gameBoardSize.col);
        let randomRow = Math.floor(Math.random()*gameBoardSize.row);
        boardCell.row = randomRow;
        boardCell.col = randomCol;
        pos.x = boardCell.col * spi.width;
        pos.y = boardCell.row * spi.height;
        spriteBait.pos = pos;
        spriteBait.draw();
    }

    this.draw = function () {
        switch(gameStatus){
            case EGameStatus.Running:
            case EGameStatus.Pause:
            case EGameStatus.GameOver:
                spriteBait.draw();
                break;
        }
    }
    
    this.posBait = function(){
        return(boardCell)
    }
}