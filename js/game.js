import { createGameBoard } from './gameBoard.js'
import { createPlayers } from './player.js'
import { cloneObj } from './cloneObj.js';

const game = (
    () => {
        const gameBoard = createGameBoard;
        const players = createPlayers;
        const gameResults = {};
        // const wins = [];

        // let gameStartTime;
        // let playCount = 0;
        players.createPlayer('steve', 'x');
        players.createPlayer('alice', 'o');
        console.log(players.getActivePlayers().forEach(player => console.log(player)))

        // const addPlayCount = () => { return playCount++ }


        const playerTurn = () => {
            let turnResult;
            const getEmptySquares = gameBoard.getEmptySquares();
            if (!getEmptySquares) {
                alert('no more empty squares...');
                return 
            }
            while (!turnResult) {
                const emptySquares = `Empty squares: ${getEmptySquares.map((piece) => `[${piece.row}, ${piece.col}]`)}`;
                const currentPlayer = players.getCurrentPlayer(true);
                // alert(msg)

                turnResult = gameBoard.setPiece(
                    currentPlayer.name,
                    currentPlayer.pieceId,
                    Number(prompt(`${emptySquares}\n\n${currentPlayer.name}, please enter the row you want to place your piece:`)),
                    Number(prompt(`${emptySquares}\n\nCool, now the column pls...:`))
                )
                
                if (turnResult) break;
                
                alert('Hey, like, maybe select an empty square...');
            }   
        }

        const getWinner = () => {
            let winningScore = 0;
            let winner;
            if (players.getActivePlayers().every((player, i, arr) => player.score === arr[0].score)) return 'draw';
            console.log('getWinner launched - getActivePlayers()', players.getActivePlayers())
            players.getActivePlayers().forEach(player => {
                console.log('getWinner launced...player: ', player)
                if(player.score > winningScore) {
                    winningScore = player.score
                    winner = player;
                }
            })
            return winner;       
        }

        const play = (wins = [], playCount = 0, gameStartTime = new Date().getTime()) => {
            let win;

            while(!(win)) {
                playerTurn();
                win = gameBoard.isWin();
                console.log('gameboard, check win....')
                console.log(win)
                if (!win) players.nextPlayer();
            }


            if(win.win !== 'draw') players.getCurrentPlayer(true).addScore();
            // console.log('game.play = playCount before...: ', playCount)
            playCount++;
            // console.log('game.play = playCount after...: ', playCount)
            
            // add players with scores to gameBoard win result for saving
            wins.push(win);
            win = null;

            let playAgain = confirm(`${players.getCurrentPlayer().name} wins!\n\nDo you want to play again?`)

            if (playAgain) {
                gameBoard.resetGame();
                play(wins, playCount, gameStartTime);
            } else {

                gameResults[gameStartTime] = { 
                    wins: cloneObj(wins),
                    playCount, 
                    players: players.getActivePlayers(), 
                    winner: getWinner()
                }
                wins.length = 0;
                playCount = 0;
                console.log('game ended, print gameResults...:', gameResults)
                return gameResults
            }


            // console.log('game ended, print matrix after external reset...:', gameBoard.matrix )
        }

        return { play }
    }
)();

export { game }