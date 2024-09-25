"use strict";
import * as GLib2D from "./Graphic_Lib_2D.js";
import { killSnake, insertNewBody, showScore, sprites, EDirection, gameProps, gameBoardSize, gameStatus, EGameStatus} from "./game.js";
import { ESpriteIndex, moveSnakeElement, } from "./snakeBodyDirection.js";
import { EBoardCellInfoType, TBoardCell } from "./board.js";

//Lager klasser for hver slange krops del

export function TSnakeHead(aBoardCell) {
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Head;  //SnakeSheet.Body or SnakeSheet.Tail
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const sp = new GLib2D.TSprite(spi, pos);
    let direction = gameBoard[boardCell.row][boardCell.col].direction;
    let newDirection = direction;

    this.draw = function () {
        sp.setIndex(direction);
        sp.draw();
    };
//Gir rettning til slangen ut fra piltastene
    this.setDirection = function (aDirection) {
        if (((direction === EDirection.Right) || (direction === EDirection.Left)) && ((aDirection === EDirection.Up) || (aDirection === EDirection.Down))) {
            newDirection = aDirection;
        } else if (((direction === EDirection.Up) || (direction === EDirection.Down)) && ((aDirection === EDirection.Right) || (aDirection === EDirection.Left))) {
            newDirection = aDirection;
        }
    };

    this.update = function () {
        gameBoard[boardCell.row][boardCell.col].InfoType = EBoardCellInfoType.IsSnake;
        direction = moveSnakeElement(newDirection, boardCell, spi);
        pos.x = boardCell.col * spi.width;
        pos.y = boardCell.row * spi.height;
    }

    //Sjekker om slagens hode kolliderer med veggene til spillebrettet. 
    this.checkCollision = function(){
        return ((boardCell.row < 0) || (boardCell.row >= gameBoardSize.row) || (boardCell.col < 0) || (boardCell.col >= gameBoardSize.col));

    }

    this.collitionSprite = function(){
        //Sjekker om posisjonen til bait og snake er samme, om den er det --> gi poeng
        if(boardCell.col === gameProps.bait.posBait().col && boardCell.row === gameProps.bait.posBait().row){
            gameProps.bait.update();
            showScore();
            
            insertNewBody.state = true;
            /*sjekker om kordinatet(row, col) til slangen har celleinfo (inneholder) slange. Dvs sjekker om den kolliderer med seg selv.
            Om det er sant --> kaller på killSnake so kjøres i game.js. Her setter gamestatuset til gameOver
            */
        }else if(gameBoard[boardCell.row][boardCell.col].InfoType === EBoardCellInfoType.IsSnake){
            killSnake();
            //gameStatus = EGameStatus.GameOver;
        }
    }
    //Sender posisjonen til slangens hode
    this.posSnake = function(){
        return(boardCell)
    }
    
}

export function TSnakeBody(aBoardCell, aDirection, aSpriteIndex){
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Body;  
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const sp = new GLib2D.TSprite(spi, pos);
    let direction = gameBoard[boardCell.row][boardCell.col].direction;
    let spriteIndex = ESpriteIndex.RL;
    if((aDirection !== undefined) && (aSpriteIndex !== undefined)){
        direction = aDirection;
        spriteIndex = aSpriteIndex;
    }

    this.draw = function(){
        sp.setIndex(spriteIndex);
        sp.draw();
    };
    
    this.update = function(){
        spriteIndex = moveSnakeElement(direction, boardCell, spi)//;
        direction = gameBoard[boardCell.row][boardCell.col].direction;
        pos.x = boardCell.col * spi.width;
        pos.y = boardCell.row * spi.height;
    };

    //Tegner ny kropsdel når denne blir "kalt" på
    this.createBody = function(){
        return new TSnakeBody(new TBoardCell(boardCell.col, boardCell.row), direction, spriteIndex);
    };
    this.posSnake = function(){
        return(boardCell)
    }
}

export function TSnakeTail(aBoardCell){
    const boardCell = aBoardCell;
    const gameBoard = gameProps.gameBoard;
    const spi = sprites.Tail;  
    const pos = new GLib2D.TPoint(boardCell.col * spi.width, boardCell.row * spi.height);
    const sp = new GLib2D.TSprite(spi, pos);
    let direction = gameBoard[boardCell.row][boardCell.col].direction;

    this.draw = function(){
        sp.setIndex(direction);
        sp.draw();
    };

    this.getCell = function(){
        return boardCell
    }
    this.update = function(){
        //Halen setter insertNewBody til false etter at ny krops del er blitt tegnet
        if (insertNewBody.state) {
            insertNewBody.state = false
            return
        }
        //halen "sletter" selg selv for å skape rom til at en ny kropsdel kan bli tegnet i updateGame
        gameBoard[boardCell.row][boardCell.col].InfoType = EBoardCellInfoType.IsEmpty;
        direction = moveSnakeElement(direction, boardCell, spi);
        pos.x = boardCell.col * spi.width;
        pos.y = boardCell.row * spi.height;
    }
    //Returnerer posisjon til halen
    this.posSnake = function(){
        return(boardCell)
    }
}
