"use strict";

let ctx = null;
let imgSheet = null;

export function TSinesWave(aStarPos, aFrequency, aAmplitude){
    const pos = new TPoint(aStarPos.x, aStarPos.y);
    const freq = aFrequency/10;
    const amp = aAmplitude;
    let rad = 0;

    this.getWaveValue = function(){
        let value = pos.y - amp * Math.sin(rad);
        rad += freq;
        return value;
    }
}// End of class TSineWave


export function TPoint(aX, aY) {
    this.x = aX;
    this.y = aY;
}// End of class TPoint

export function TRectangle(aPos, aWidth, aHeight) {
    const rect = this;
    let pos = aPos;
    this.left = pos.x;
    this.top = pos.y;
    this.width = aWidth;
    this.height = aHeight;
    this.right = rect.left + rect.width;
    this.bottom = rect.top + rect.height;

    this.update = function(){
        rect.left = pos.x;
        rect.top = pos.y;
        rect.width = aWidth;
        rect.height = aHeight;
        rect.right = rect.left + rect.width;
        rect.bottom = rect.top + rect.height;
    }

    this.setPos = function (aPos) {
        pos = aPos;
        update();
    }

    this.setSize = function (aWidth, aHeight) {
        rect.width = aWidth;
        rect.height = aHeight;
        rect.right = rect.left + rect.width;
        rect.bottom = rect.top + rect.height;
    }

    this.checkHitRectangle = function (aRect) {
        rect.update();
        aRect.update();
        return !(rect.bottom < aRect.top || rect.right < aRect.left || rect.top > aRect.bottom || rect.left > aRect.right);
    }

    this.checkHitPosition = function(aPos){
        rect.update();
        return ((aPos.x > rect.left) && (aPos.x < rect.right)) && ((aPos.y > rect.top) && (aPos.y < rect.bottom));
    }
} // End of class TRectangle

export function TSprite(aSpriteInfo, aPos) {
    const spi = aSpriteInfo;
    const pos = aPos;
    const spriteCount = aSpriteInfo.count;
    let spriteIndex = 0;
    let animationIndex = 0;
    let animationSpeed = 0.2;
    let alpha = 1;
    let scale = 1;

    this.draw = function () {
        const sw = spi.width;
        const sh = spi.height;
        const sx = spi.x + (sw * spriteIndex);
        const sy = spi.y;
        const dx = pos.x;
        const dy = pos.y;
        const dw = sw * scale;
        const dh = sh * scale;
        const oldAlpha = ctx.globalAlpha;
        ctx.globalAlpha = alpha;
        ctx.drawImage(imgSheet, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.globalAlpha = oldAlpha;
    }

    this.animate = function () {
        animationIndex += animationSpeed;
        if (animationIndex >= spriteCount) {
            animationIndex = 0;
        }
        spriteIndex = Math.floor(animationIndex);
    }

    this.setIndex = function (aIndex) {
        if (aIndex < spriteCount) {
            spriteIndex = aIndex;
        }
    }

    this.setScale = function (aScale) {
        scale = aScale;
    }

    this.setAlpha = function (aAlpha) {
        alpha = aAlpha;
    }

    this.setAnimationSpeed = function(aSpeed){
        animationSpeed = aSpeed;
    }

    this.getRectangle = function(){
        return new TRectangle(pos, spi.width * scale, spi.height * scale);
    }

}// End of class TSprite

export function initLib(aCTX, aImageName, aGameReady) {
    ctx = aCTX;
    imgSheet = new Image();
    imgSheet.addEventListener("load", aGameReady, false);
    imgSheet.src = aImageName;
}