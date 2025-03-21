import { cloneObj } from './cloneObj.js';

const createMatrix = (size = 3) => {
    let matrix = initMatrix();

    /**
     * @returns {{player: string | null, piece: string | null, row: number, col: number}[][]}
     */
    function initMatrix() {
        const matrix = [];
        
        for (let row = 0; row < size; row++) {
            matrix.push([])
            for (let col = 0; col < size; col++) {
                const [player, piece] = [null, null]
                matrix[row].push(cell(row, col, player, piece));
            }
        }
        return matrix;
    }

    /**
     * @returns {{player: string | null, piece: string | null, row: number, col: number}[][]}
     */
    function getMatrix(byReference = true) {
        if (byReference) return matrix;
        return cloneObj(matrix);
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @param {string | null} player 
     * @param {string | null} piece 
     * @returns {{
     *  player: string | null, 
     *  piece: 'x' | 'o' | null, 
     *  type: 'machine' | 'human' | null, 
     *  row: number, col: number
     * }}
     */
    function cell(row, col, player = null, piece = null, type = null) {
        return { player, piece, type, row, col }
    }

    function setCell(row, col, player = null, piece = null, type = null) {
        matrix[row][col] = cell(row, col, player, piece, type);
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @param {boolean} byReference 
     * @returns {{
     *  player: string | null, 
     *  piece: 'x' | 'o' | null, 
     *  type: 'machine' | 'human' | null, 
     *  row: number, col: number
     * }}
     */
    function getCell(row, col, byReference = false) {
        if (byReference) return matrix.at(row).at(col)
        return cloneObj(matrix.at(row).at(col));
    }

    /**
     * 
     * @returns {{
     *  player: string | null, 
     *  piece: 'x' | 'o' | null, 
     *  type: 'machine' | 'human' | null, 
     *  row: number, col: number
     * }[][]}
     */
    function resetMatrix() {
        const finalMatrix = cloneObj(matrix);
        matrix.length = 0;
        matrix = initMatrix();
        return finalMatrix;
    }

    /**
     * 
     * @returns {{
     *  player: string | null, 
     *  piece: 'x' | 'o' | null, 
     *  type: 'machine' | 'human' | null, 
     *  row: number, col: number
     * }[][]}
     */
    function transposeMatrix() {
        const winCol = initMatrix();
        for (let row = 0; row < matrix.length; row++) {
            for(let col = 0; col < matrix[0].length; col++) {
                winCol[row][col] = matrix[col][row]
            }
        }
        return winCol;
    }

    /**
     * 
     * @param {boolean} byReference 
     * @returns {{
     *      leftDiag: {player: string | null, piece: 'x' | 'o' | null, type: 'machine' | 'human' | null, row: number, col: number}[],
     *      rightDiag: {player: string | null, piece: 'x' | 'o' | null, type: 'machine' | 'human' | null, row: number, col: number}[],
     * }}
     */
    function getDiags(byReference = true) {
        const diags = {leftDiag: [], rightDiag: []}
        getMatrix(byReference).forEach((row, rowNum)  => {
            diags.leftDiag.push(getCell(rowNum, rowNum, byReference));
            diags.rightDiag.push(getCell(rowNum, -(rowNum + 1), byReference));
        });

        return diags;
    }

    function isCellEmpty(row, col) {
        return !!getCell(row,col)
    }

    return { 
        getMatrix,
        resetMatrix,
        transposeMatrix,
        getDiags,
        getCell,
        setCell,
        isCellEmpty
    }
}


export { createMatrix }