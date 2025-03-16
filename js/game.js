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

        const playerTurn = () => {
            let turnResult;
            while (!turnResult) {
                const getEmptySquares = gameBoard.getEmptySquares();
                const msg = `Empty squares: ${getEmptySquares.map((piece) => `${piece.player} - (${piece.piece}): [${piece.row}, ${piece.col}]`)}`;
                prompt(msg)
                turnResult = gameBoard.setPiece(
                    currentPlayer.getName(),
                    currentPlayer.getPieceId(),
                    Number(prompt(`${currentPlayer.getName()}, please enter the row you want to place your piece:`)),
                    Number(prompt('Cool, now the column pls...:'))
                )
                if (turnResult) break;

                prompt('Hey, like, maybe select an empty square...');
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
            }
            prompt(`${win.player} wins!`)
        }

        return { play }
    }
)();

export { game }