// import { cloneObj } from './cloneObj.js'
import { createMatrix } from './matrix.js';

const createGameBoard =  (
    () => {
        let matrix = createMatrix();
        let winResult;


        const setPiece = (player, piece, type, row, col) => {
            if (!(isSquareEmpty(row, col))) {
                return false;
            }
            matrix.setCell(row, col, player, piece, type)

            return true;
        }

        const getPiece = (row, col, byReference = false) => {
            return matrix.getCell(row, col, byReference)
        }

        function resetGame() {
            console.log('resetting game...')
            winResult = null;
            return matrix.resetMatrix();
        }

        const isSquareEmpty = (row, col) => {
            if (row >= matrix.getMatrix(true).length) return false;
            if (col >= matrix.getMatrix(true)[0].length) return false;

            return !(getPiece(row, col, true).player);
        }

        /**
         * 
         * @param {boolean} byReference 
         * @returns {{player: string | null, piece: string | null, row: number, col: number}[] | false}
         */
        const getEmptySquares = (byReference = true) => { 
            const returnMatrix = [];
            matrix.getMatrix(true).forEach((row) => row.forEach((cell) => {
                if (isSquareEmpty(cell.row, cell.col)) returnMatrix.push(cell);
            })); 

            // if no empty squares found, return false
            return returnMatrix.length ? returnMatrix : false;
        }
        
        const isPiecesEqual = (pieceArray) => {
            return pieceArray.every((cell, _colNum, arr) => 
                !isSquareEmpty(cell.row, cell.col) && cell.piece === arr[0].piece
            );
        }

        const setWinResult = (player, win, array) => {
            const finalMatrix = matrix.resetMatrix();

            winResult = { player, win, array, finalMatrix };
            console.log('win result set, returning....', winResult)
            return winResult;
        }

        const getWinResult = () => { return winResult ? winResult : false }

        function isWin() {       
            // first, check for horizontal and vertical wins
            console.log('isWin running....')
            const matrices = { row: matrix.getMatrix(), col: matrix.transposeMatrix()}
            for (const [type, matrix] of Object.entries(matrices)) {
                const winVector = matrix.filter(vector => isPiecesEqual(vector)).pop();
                if (winVector && winVector.length) {
                    console.log(`winning ${type} found....: `, winVector);
                    setWinResult(winVector[0].player, `${type}${winVector[0].row}`, winVector);
                    return getWinResult();   
                }
            }
                
            // next, check diagonals
            for (const [diag, pieceArray] of Object.entries(matrix.getDiags())) {
                if(pieceArray.length && isPiecesEqual(pieceArray)) {
                    console.log(`${diag} match...: `, pieceArray);
                    setWinResult(pieceArray[0].player, diag, pieceArray);
                    return getWinResult();                   
                }
            }

            // finally, if there are no empty squares AND no wins, this must be a draw
            if (!getEmptySquares()) {
                console.log('no wins found, no empty squares, its a draw...')
                setWinResult('draw', 'draw', []);
                return getWinResult();
            }

            // if no wins found, return false, we'll use that result to launch another turn
            console.log('no wins found, next turn....')
            return false;
        }

        return { setPiece, getPiece, getEmptySquares, isWin, resetGame, matrix };
    }
)();


export { createGameBoard }
