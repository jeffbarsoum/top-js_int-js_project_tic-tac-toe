import { createGameBoard } from './gameBoard.js'
import { createPlayers } from './player.js'

const game = (
    () => {
        const gameBoard = createGameBoard;
        const players = createPlayers;
        const gameResults = {};
        const wins = [];

        let gameStartTime;
        let playCount = 0;
        players.createPlayer('steve', 'x');
        players.createPlayer('alice', 'o');
        console.log(players.getActivePlayers().forEach(player => console.log(player.getPieceId())))


        const playerTurn = () => {
            let turnResult;
            const getEmptySquares = gameBoard.getEmptySquares();
            if (!getEmptySquares) {
                alert('no more empty squares...');
                return 
            }
            while (!turnResult) {
                const emptySquares = `Empty squares: ${getEmptySquares.map((piece) => `[${piece.row}, ${piece.col}]`)}`;
                const currentPlayer = players.getCurrentPlayer();
                const name = currentPlayer.getName();
                const pieceId = currentPlayer.getPieceId();
                // alert(msg)

                turnResult = gameBoard.setPiece(
                    name,
                    pieceId,
                    Number(prompt(`${emptySquares}\n\n${name}, please enter the row you want to place your piece:`)),
                    Number(prompt(`${emptySquares}\n\nCool, now the column pls...:`))
                )


                if (turnResult) break;

                alert('Hey, like, maybe select an empty square...');
            }
            players.nextPlayer();
        }

        const play = () => {
            let win;
            while(!(win)) {
                playerTurn();
                win = gameBoard.isWin();
                console.log('gameboard, check win....')
                console.log(win)
            }

            players.getCurrentPlayer().addScore();
            
            // add players with scores to gameBoard win result for saving
            _wins.push({ ...win, players: players.getActivePlayers().map(player => player.getPlayer()) })
            win = null;
            // console.log('game ended, print matrix...:', gameBoard.matrix)
            gameBoard.resetGame();
            // console.log('game ended, print matrix after external reset...:', gameBoard.matrix )
        }

        return { play }
    }
)();

export { game }