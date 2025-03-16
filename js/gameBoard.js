const createGameBoard =  (
    (size = 3) => {
        const piece = (row, col, player = null, piece = null) => {
            return { player, piece, row, col };
        }

        const matrix = initMatrix();
        let winResult;


        const setPiece = (player, piece, row, col) => {
            if (!(isSquareEmpty(row, col))) {
                return false;
            }

            matrix[row][col] = { player, piece, row, col };
            return true;
        }

        const getPiece = (row, col) => {
            console.log(matrix)
            return matrix.at(row).at(col) 
        }

        function initMatrix() {
            const result = [];
            
            for (let row = 0; row < size; row++) {
                result.push([])
                for (let col = 0; col < size; col++) {
                    result[row].push(piece(row, col));
                }
            }

            return result;
        }

        function getFinalMatrix() {
            if (!winResult && getEmptySquares()) return false;

            const finalMatrix = matrix.map((row) => row.map((cell) => cell))
            resetGame()

            return finalMatrix;
        }

        function resetGame() {
            winResult = null;
            matrix.forEach((row) => row.forEach((cell) => cell = piece(cell.row, cell.col)))
        }

        const transposeMatrix = () => {
            const winCol = initMatrix();
            for (let row = 0; row < matrix.length; row++) {
                for(let col = 0; col < matrix[0].length; col++) {
                    winCol[row][col] = matrix[col][row]
                }
            }
            return winCol;
        }

        const isSquareEmpty = (row, col) => {
            return !(getPiece(row, col).player);
        }

        const getEmptySquares = () => { 
            const returnMatrix = [];
            matrix.forEach((row) => row.forEach((cell) => {
                if (isSquareEmpty(cell.row, cell.col)) returnMatrix.push(cell);
            })); 
            // if (returnMatrix.length) return returnMatrix;

            // if no empty squares found, return false
            return returnMatrix.length ? returnMatrix : false;
        }
        
        const isPiecesEqual = (pieceArray) => {
            console.log(pieceArray)
            return pieceArray.every(cell => !isSquareEmpty(cell.row, cell.col) && cell.piece === pieceArray[0].piece);
        }

        const setWinResult = (player, win, array) => {
            console.log('setting win result...: ', winResult)
            if (winResult) return false;
            console.log('setting win result, not set yet, continuing....')

            const finalMatrix = getFinalMatrix();
            if (!finalMatrix) return false;
            console.log('setting win result, final matrix exists, continuning...')

            winResult = { player, win, array, finalMatrix };
            console.log('win result set, returning....', winResult)
            return winResult;
        }

        const getWinResult = () => { return winResult ? winResult : false }

        function isWin() {
            // first, check for horizontal wins
            console.log('isWin running....')
            const winRow = matrix.filter((row) => isPiecesEqual(row)).pop();
            if (winRow && winRow.length) {
                console.log('winning row found....: ', winRow);
                setWinResult(winRow[0].player, `row${winRow[0].row}`, winRow);
                return getWinResult();
            }

            // next, check diagonals
            const winLeftDiag = [];
            const winRightDiag = [];
            matrix.forEach((row, rowNum) => {
                // console.log(`iswin: get matrix ids '${rowNum}, ${rowNum}' and '${rowNum}, ${-(rowNum + 1)}'`)
                winLeftDiag.push(getPiece(rowNum, rowNum));
                winRightDiag.push(getPiece(rowNum, -(rowNum + 1)));

            })

            if (winLeftDiag.length) {
                console.log('leftDiag match...: ', winLeftDiag);
                setWinResult(winLeftDiag[0].player, 'leftDiag', winLeftDiag);
                return getWinResult();
            }
            if (winRightDiag.length) {
                console.log('leftDiag match...: ', winRightDiag);
                setWinResult(winRightDiag[0].player, 'rightDiag', winRightDiag);
                return getWinResult();
            }
            
            //next, check columns, by transposing matrix and checking how we did for rows
            const tMatrix = transposeMatrix();
            tMatrix.forEach((col, colNum) => {
                if (isPiecesEqual(col)) return setWinResult(col[0].player, `row${colNum}`, col);          
            })
            const winCol = tMatrix.filter((col) => isPiecesEqual(col)).pop();
            if (winCol.length) {
                console.log('winning col found....: ', winCol);
                setWinResult(winCol[0].player, `col${winCol[0].col}`, winCol);
                return getWinResult();
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

        return { setPiece, getPiece, getEmptySquares, isWin };
    }
)();


export { createGameBoard }
