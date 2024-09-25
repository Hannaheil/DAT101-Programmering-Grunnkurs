import * as GLib2D from "./Graphic_Lib_2D.js";
import { sprites, EGameStatus, gameStatus, gameProps } from "./game.js";
import { TNumber } from "./numbers.js";

export function TInfoText() {
    
    const numberScore = new TNumber(sprites.numberSmall, new GLib2D.TPoint(393, 272), 3, 0);
    const numberHighScore = new TNumber(sprites.numberSmall, new GLib2D.TPoint(393, 315), 3, 0);
    let highScore = 0;

    spriteInfoText.setScale(1.3);

    this.draw = function () {
        switch (gameStatus) {
            case EGameStatus.GetReady:
                spriteInfoText.setIndex(0);
                spriteInfoText.draw();
                break;
            case EGameStatus.GameOver:
                spriteInfoText.setIndex(1);
                spriteInfoText.draw();
                spriteBoard.draw();
                
                numberScore.draw();
                numberHighScore.draw();
                break;
        }
    }

    this.update = function () {
        switch (gameStatus) {
            case EGameStatus.GameOver:
                const score = gameProps.gameScore.getScore();
                numberScore.update(score);
                break;

        }
    }
}