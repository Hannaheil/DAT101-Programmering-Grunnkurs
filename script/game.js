"use strict";
//Gruppe: 1213, Kandidat: 413
import * as GLib2D from "./Graphic_Lib_2D.js";
import { TBoardCell, TBoardCellInfo} from "./board.js"
import { TSnakeHead, TSnakeBody, TSnakeTail } from "./snake.js"
import { TBait } from "./bait.js";
import { TGameOverBoard } from "./GameOver.js";
import { TStartButton, TBtnRetry, TBtnHome, TBtnResume } from "./buttons.js";
import { TNumber, TGameScore} from "./numbers.js";

//--------------------------------------------------------------------------------------------------------------------
//------ Variables, Constants and Objects
//--------------------------------------------------------------------------------------------------------------------
//Coordinates on the sprite-sheet
const SnakeSheetData = {
    Head:       { x:   0, y:   0, width:  38, height:  38, count:  4 },
    Body:       { x:   0, y:  38, width:  38, height:  38, count:  6 },
    Tail:       { x:   0, y:  76, width:  38, height:  38, count:  4 },
    Bait:       { x:   0, y: 114, width:  38, height:  38, count:  1 },
    Play:       { x:   0, y: 155, width: 202, height: 202, count: 10 },
    Retry:      { x: 614, y: 995, width: 169, height: 167, count:  1 },
    Resume:     { x:   0, y: 357, width: 202, height: 202, count:  2 },
    Home:       { x:  64, y: 994, width: 170, height: 167, count:  1 },
    Number:     { x:   0, y: 560, width:  81, height:  86, count: 10 },
    GameOver:   { x:   0, y: 647, width: 856, height: 580, count:  1 }
};
export const sprites = SnakeSheetData;
export let cvs = null;
export let ctx = null;
const mousePos = new GLib2D.TPoint(0, 0);

export const EDirection = { Up: 0, Right: 1, Left: 2, Down: 3 };
export const EGameStatus = { New: 0, Running: 1, Pause: 2, GameOver: 3 };

export let gameStatus = EGameStatus.GameOver;

let speed = 400;

let hndUpdateGame = null;
let newAppleTime = null;
let eatAppleTime = null;
let time = null;

export let insertNewBody = {state: false};
let hndAnimation = null;

const GameProps = {
    gameBoard: null,
    snake: [],
    bait: null,
    BoardGameOver: null,
    btnStart: null,
    btnRetry: null,
    btnHome: null,
    btnResume: null,
    gameScore: null,
}

export const gameProps = GameProps;
export const gameBoardSize = new TBoardCell(25, 20);



//--------------------------------------------------------------------------------------------------------------------
//------ Function and Events
//--------------------------------------------------------------------------------------------------------------------

//Tegner diverse gameProps i gitte gameStatuser
function drawGame() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    switch(gameStatus){
        case EGameStatus.New:
            gameProps.btnStart.draw();
            break;
        case EGameStatus.Running:
            gameProps.bait.draw();
            for (let i = 0; i < gameProps.snake.length; i++) {
                gameProps.snake[i].draw();
                gameProps.gameScore.draw();
            }
        case EGameStatus.GameOver:
            
            gameProps.BoardGameOver.draw();  
            gameProps.btnRetry.draw();
            gameProps.btnHome.draw(); 
            gameProps.gameScore.draw();
            break;
        case EGameStatus.Pause:
            gameProps.btnResume.draw();
            break;

    } 
    requestAnimationFrame(drawGame);
}



//Oppdateres gameProps kontinuerlig for å sjekke diverse handlinger i spillet. 
function updateGame() {
    if(gameStatus === EGameStatus.Running){
        let insertBody = null;
        for (let i = 0; i < gameProps.snake.length; i++) {    
            let snakeElement = gameProps.snake[i];
            if(snakeElement === gameProps.snake[0]){
                 //sjekker om slangen kolliderer med veggen
                if (gameProps.snake[0].checkCollision()) {
                    gameStatus = EGameStatus.GameOver;
                    break;
                }

                snakeElement.collitionSprite();
            //Lager ny kropsdel om insertNewBody er true
            }else if (i === (gameProps.snake.length - 2)){
                if (insertNewBody.state) {
                    insertBody = snakeElement.createBody();
                }
            }
            snakeElement.update();
        }
//sletter halen, pusher opp ny kroddsdel, setter på ny hale igjen. 
        if (insertBody !== null) {
            const tail = gameProps.snake.pop();
            gameProps.snake.push(insertBody);
            gameProps.snake.push(tail);
            insertBody = null;
        }  
    }
}

//Blir kalt på når slangen kolliderer med seg selv. 
export function killSnake(){
    gameStatus = EGameStatus.GameOver;
}


//Skal starte når alt er loadet (når gameReady er ferdig)
export function newGame() {
    if( hndUpdateGame != null){
        clearInterval(hndUpdateGame);
    }
//Setter startfarten til å være 400
    speed = 400;
//Lager rader og kollonner (sjakkbrett) på spillebrettet 
    gameProps.gameBoard = [];
    for (let i = 0; i < gameBoardSize.row; i++) {
        const row = [];
        for (let j = 0; j < gameBoardSize.col; j++) {
            row.push(new TBoardCellInfo());
        }
        gameProps.gameBoard.push(row);
    }
//Setter hode, kropp og hale opp i en samlende tabell. 
    gameProps.snake = [];
    let newSnakeElement = new TSnakeHead(new TBoardCell(2, 10));
    gameProps.snake.push(newSnakeElement);

    newSnakeElement = new TSnakeBody(new TBoardCell(1, 10));
    gameProps.snake.push(newSnakeElement);

    newSnakeElement = new TSnakeTail(new TBoardCell(0, 10));
    gameProps.snake.push(newSnakeElement);

    gameProps.gameScore.resetScore();

    gameProps.bait.update();
    gameStatus = EGameStatus.New;
    hndUpdateGame = setInterval(updateGame, 400);

}

//Funksjon får å øke farten 
function increaseSpeed(aSpeed){
    //setter parameteret til å være speed
    speed -= aSpeed;
        //if-setningen gjør at maxfart aldri kan bli mer enn 100. 
        if (speed < 100) {
            speed = 100;
        }
        //Renser "default" farten slik at "farten" som blir redusert er den momentane farten (aSpeed) i spillet og ikke startfarten/default fart (400)
        if (hndUpdateGame) {
            clearInterval(hndUpdateGame);
        }
        hndUpdateGame = setInterval(updateGame, speed);
}

//Funksjon for å sette poengscore. Poeng settes ut i fra tiden det tar fra en ny bait er tegnet til den blir spist. 
export function showScore(){ 
        eatAppleTime = Date.now();
        time = eatAppleTime - newAppleTime;
        let points = 0;

        function TimeScore(){
            if(time <= 3000){ //om tiden er mindre eller lik 3 sek, skal gi poeng 
                points = 10
            }else if(time <= 5000 && time >= 7000){
                points = 8
            }else if(time <= 7000 && time >= 9000){
                points = 6
            }else if(time <= 9000 && time >= 1200){
                points = 4
            }else{
                points = 2
            }
            return points;
        }
        TimeScore();
        //sender score til gameScore
        gameProps.gameScore.setScore(points);
        newAppleTime = Date.now();
        //Setter at hver gang slangen spiser skal speeden øke med 50
        increaseSpeed(50);
    }

//Funksjon for animasjon av startknapp
function animate(){
    gameProps.btnStart.animate();
}

//Gjør spillet klart til å spilles
function gameReady() {
    gameProps.btnStart = new TStartButton();
    gameProps.btnRetry = new TBtnRetry();
    gameProps.btnHome = new TBtnHome();
    gameProps.btnResume = new TBtnResume();
    gameProps.bait = new TBait();
    gameProps.BoardGameOver = new TGameOverBoard();
    gameProps.gameScore = new TGameScore();

    //Setter "10" pga Play btn har "count" 10 (har 10 "animasjonsbilder" som skal "kjøres" over)
    hndAnimation = setInterval(animate, 10);
    newGame();
    requestAnimationFrame(drawGame);
}

function updateMousePos(aEvent) {
    mousePos.x = aEvent.clientX - cvs.offsetLeft;
    mousePos.y = aEvent.clientY - cvs.offsetTop;
}

//Endrer musikonet ettersom musa blir beveget over knapper eller ikke
function cvsMouseMove(aEvent) {
    updateMousePos(aEvent);
    cvs.style.cursor = "default";
    switch (gameStatus) {
        case EGameStatus.New:
            if (gameProps.btnStart.isMouseOver(mousePos)) {
                cvs.style.cursor = "pointer";
            }
            break;
        case EGameStatus.Pause:
            if (gameProps.btnResume.isMouseOver(mousePos)) {
                cvs.style.cursor = "pointer";
            }
            break;
        case EGameStatus.GameOver:
            if (gameProps.btnRetry.isMouseOver(mousePos)) {
                cvs.style.cursor = "pointer";
            } else if (gameProps.btnHome.isMouseOver(mousePos)) {
                cvs.style.cursor = "pointer";
            }
            break;
    }
}

function cvsClick() {
    // Mouse button has clicked on Canvas
    cvs.style.cursor = "default";
    //updateMousePos(aEvent);
    if(gameProps.btnStart.isMouseOver(mousePos)){
        cvs.style.cursor = "pointer";
        newAppleTime = Date.now();
        gameStatus = EGameStatus.Running;
    }
    if(gameProps.btnRetry.isMouseOver(mousePos)){
        newGame();
        cvs.style.cursor = "pointer";
        gameStatus = EGameStatus.Running;
         //Denne er feil
    }
    if(gameProps.btnHome.isMouseOver(mousePos)){
        cvs.style.cursor = "pointer";
        gameStatus = EGameStatus.New;
        newGame();
    }
    if(gameProps.btnResume.isMouseOver(mousePos)){
        cvs.style.cursor = "pointer";
        gameStatus = EGameStatus.Running;
    }
}

//Setter rettning slangen skal få ved de forskjllige piltastene. 
function cvsKeydown(aEvent) {
    const snakeHead = gameProps.snake[0];
    switch (aEvent.key) {
        case "ArrowLeft":
            snakeHead.setDirection(EDirection.Left);
            break;
        case "ArrowRight":
            snakeHead.setDirection(EDirection.Right);
            break;
        case "ArrowUp":
            snakeHead.setDirection(EDirection.Up);
            break;
        case "ArrowDown":
            snakeHead.setDirection(EDirection.Down);
            break;
        case " ":
            if (gameStatus === EGameStatus.Pause) {
                gameStatus = EGameStatus.Running;
            } else if (gameStatus === EGameStatus.Running) {
                gameStatus = EGameStatus.Pause;
            }
            break;
    }
}

//Tegner/Lager nytt spill 
export function initGame(aCanvas) {
    cvs = aCanvas;
    cvs.width = gameBoardSize.col * sprites.Head.width;
    cvs.height = gameBoardSize.row * sprites.Head.height;
    ctx = cvs.getContext("2d");
    cvs.addEventListener("mousemove", cvsMouseMove, false);
    cvs.addEventListener("click", cvsClick, false);
    document.addEventListener("keydown", cvsKeydown);
    GLib2D.initLib(ctx, "./media/SpriteSheet_Snake.png", gameReady);
}
