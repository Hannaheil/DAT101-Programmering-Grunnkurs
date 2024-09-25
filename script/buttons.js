import * as GLib2D from "./Graphic_Lib_2D.js";
import {sprites, ctx, EGameStatus ,gameStatus, cvs} from "./game.js";

//Lager en klasse for hver knapp
export function TStartButton(aaIndex, aSpeed, ){
    const spi = sprites.Play;
    const posStartButton = new GLib2D.TPoint(cvs.width / 2 - spi.width/2, cvs.height / 2 - spi.height/2);
    const spriteStartButton = new GLib2D.TSprite(spi, posStartButton);
    const rect = spriteStartButton.getRectangle();

    this.draw = function(){
        switch(gameStatus){
            case EGameStatus.New:
                ctx.shadowColor = "black";
                spriteStartButton.draw();
                //spriteStartButton.animate();
                ctx.shadowColor = "transparent";
                break;        
        }
    }
    //Lager en animasjons funskjon for å animere Start knappen. Denne er hentet fra TSprite i Graphic_Lib_2D
    this.animate = function() {
        switch(gameStatus){
            case EGameStatus.New:
                ctx.shadowColor = "black";
                spriteStartButton.animate();
                //spriteStartButton.animate();
                ctx.shadowColor = "transparent";
                break;        
        }
       
    }

    this.isMouseOver = function(aMousePos){
        let isMouseHit = false;
        switch(gameStatus){
            case EGameStatus.New:
                isMouseHit =  rect.checkHitPosition(aMousePos);
                break;
        }
        return isMouseHit;
    }
}

export function TBtnRetry(){
    const spi = sprites.Retry;
    const posRetry = new GLib2D.TPoint(660, 438);
    const spriteRetry = new GLib2D.TSprite(spi, posRetry);
    const rect = spriteRetry.getRectangle();

    this.draw = function(){
        switch(gameStatus){
            case EGameStatus.GameOver:
                spriteRetry.draw();
                break;        
        }
    }

    this.isMouseOver = function(aMousePos){
        let isMouseHit = false;
        switch(gameStatus){
            case EGameStatus.GameOver:
                isMouseHit =  rect.checkHitPosition(aMousePos);
                break;
        }
        return isMouseHit;
    }
}
export function TBtnHome(){
    const spi = sprites.Home;
    const posHome = new GLib2D.TPoint(112, 438);
    const spriteHome = new GLib2D.TSprite(spi, posHome);
    const rect = spriteHome.getRectangle();

    this.draw = function(){
        switch(gameStatus){
            case EGameStatus.GameOver:
                ctx.shadowColor = "black";
                spriteHome.draw();
                ctx.shadowColor = "transparent";
                break;        
        }
    }

    this.isMouseOver = function(aMousePos){
        let isMouseHit = false;
        switch(gameStatus){
            case EGameStatus.GameOver:
                isMouseHit =  rect.checkHitPosition(aMousePos);
                break;
        }
        return isMouseHit;
    }
}

export function TBtnResume(){
    const spi = sprites.Resume;
    const posResume = new GLib2D.TPoint(cvs.width / 2 - spi.width/2, cvs.height / 2 - spi.height/2);
    const spriteResume = new GLib2D.TSprite(spi, posResume);
    const rect = spriteResume.getRectangle();

    this.draw = function(){
        switch(gameStatus){
            case EGameStatus.Pause:   
                ctx.shadowColor = "black";
                spriteResume.draw();
                ctx.shadowColor = "transparent";
                break;      
        }
    }

    this.isMouseOver = function(aMousePos){
        let isMouseHit = false;
        switch(gameStatus){
            case EGameStatus.Pause:
                isMouseHit =  rect.checkHitPosition(aMousePos);
                break;
        }
        return isMouseHit;
    }
}