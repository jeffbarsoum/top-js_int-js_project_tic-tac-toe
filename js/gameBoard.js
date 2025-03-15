const gameBoard =  (
    (size = 3) => {
        const matrix = initMatrix();

        const piece = (row, col, player = null, piece = null) => {
            return { player, piece, row, col };
        }

        const setPiece = (player, piece, row, col) => {
            if (!(isSquareEmpty(row, col))) {
                return false;
            }

            matrix[row][col] = { player, piece, row, col };
            return true;
        }

        const getPiece = (row, col) => {
            return matrix[row][col]
        }

        const initMatrix = () => {
            const result = [];
            for (let row = 0; row < size; row++) {
                result.push([])
                for (let col = 0; col < size; col++) {
                    result[row].push(piece(row, col));
                }
            }

            return result;
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
        
        const isPiecesEqual = (pieceArray) => {
            return pieceArray.every(cell => cell.piece === pieceArray[0].piece);
        }

        const winResult = (player, win, array) => {
            return { player, win, array };
        }

        const isWin = () => {
            // matrix.forEach(row => row.every(cell => cell === row[0]))
            // if we don't find row matches, we'll fill these as we go
            const winLeftDiag = [];
            const winRightDiag = [];

            // first, check for horizontal wins
            matrix.forEach((row, rowNum) => {
                if (isPiecesEqual(row)) return winResult(row[0].player, `row${rowNum}`, row);
                // if we don't find a win in a row, push another
                // cell into the left and right diagonal arrays, for
                // checking later
                winLeftDiag.push(getPiece(rowNum, rowNum));
                winRightDiag.push(getPiece(rowNum, -rowNum));
            });
            
            // next, check diagonals 
            if (isPiecesEqual(winRightDiag)) return winResult(winRightDiag[0].player, 'rightDiag', winRightDiag);
            if (isPiecesEqual(winLeftDiag)) return winResult(winLeftDiag[0].player, 'leftDiag', winLeftDiag);
            
            //finally, check columns, by transposing matrix and checking how we did for rows
            const tMatrix = transposeMatrix();
            tMatrix.forEach((col, colNum) => {
                if (isPiecesEqual(col)) return winResult(col[0].player, `row${colNum}`, col);          
            })

            // if no wins found, return false
            return false;
        }

        return { setPiece, getPiece, isWin };
    }
)();
