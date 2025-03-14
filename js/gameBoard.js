const gameBoard =  (
    () => {
        const matrix = Array(3)
            .fill()
            .map((row) => row = Array(3).fill().map((cell) => cell = piece()));
        const piece = (player = null, piece = null) => {
            return { player, piece };
        }
        const isSquareEmpty = (row, column) => {
            return !(matrix[row][column].player);
        }
        const setPiece = (player, piece, row, column) => {
            if (!(isSquareEmpty(row, column))) {
                return false;
            }

            [matrix[row][column].player, matrix[row][column].piece] = [player, piece];
            return true;
        }
        const getPiece = (row, column) => {
            return matrix[row][column]
        }

        return { setPiece, getPiece };
    }
)();
    
