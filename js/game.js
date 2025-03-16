import { createGameBoard } from './gameBoard.js'
import { createPlayer } from './player.js'

const game = (
    () => {
        const gameBoard = createGameBoard;
        const players = [
            createPlayer(
                'steve',
                'x'
            ),
            createPlayer(
                'alice',
                'o'
            )
        ]
        let currentPlayer = players[0];
        const gameResults = {}

        const playerTurn = () => {
            let turnResult;
            const getEmptySquares = gameBoard.getEmptySquares();
            if (!getEmptySquares) {
                alert('no more empty squares...');
                return 
            }
            while (!turnResult) {
                const msg = `Empty squares: ${getEmptySquares.map((piece) => `[${piece.row}, ${piece.col}]`)}`;
                // alert(msg)
                turnResult = gameBoard.setPiece(
                    currentPlayer,
                    currentPlayer.getPieceId(),
                    Number(prompt(`${msg}\n\n${currentPlayer.getName()}, please enter the row you want to place your piece:`)),
                    Number(prompt(`${msg}\n\nCool, now the column pls...:`))
                )

                if (turnResult) break;

                alert('Hey, like, maybe select an empty square...');
            }

            //switch players
            players.unshift(players.pop())   
            currentPlayer = players[0]      
        }

        const play = () => {
            let win;
            while(!(win)) {
                playerTurn();
                win = gameBoard.isWin();
                console.log('gameboard, check win....')
                console.log(win)
            }

            gameResults[new Date().getTime()] = win
            alert(`${win.player.getName()} wins!`)
        }

        return { play }
    }
)();

export { game }