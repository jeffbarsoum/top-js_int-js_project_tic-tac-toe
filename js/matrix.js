import { cloneObj } from './cloneObj.js';

const createMatrix = (size = 3) => {
    let matrix = initMatrix();


    function initMatrix() {
        const _matrix = [];
        
        for (let row = 0; row < size; row++) {
            _matrix.push([])
            for (let col = 0; col < size; col++) {
                const [player, piece] = [null, null]
                _matrix[row].push(cell(row, col, player, piece));
            }
        }
        return _matrix;
    }

    function getMatrix(byReference = false) {
        if (byReference) return matrix;
        return cloneObj(matrix);
    }

    function cell(row, col, player = null, piece = null) {
        return { row, col, player, piece }
    }

    function setCell(row, col, player = null, piece = null) {
        matrix[row][col] = cell(row, col, player, piece);
    }

    function getCell(row, col, byReference = false) {
        if (byReference) return matrix.at(row).at(col)
        return cloneObj(matrix.at(row).at(col));
    }

    function resetMatrix() {
        const finalMatrix = cloneObj(matrix);
        matrix.length = 0;
        matrix = initMatrix();
        return finalMatrix;
    }

    function transposeMatrix() {
        const winCol = initMatrix();
        for (let row = 0; row < matrix.length; row++) {
            for(let col = 0; col < matrix[0].length; col++) {
                winCol[row][col] = matrix[col][row]
            }
        }
        return winCol;
    }

    function getDiags(byReference = false) {
        const diags = {leftDiag: [], rightDiag: []}
        getMatrix(byReference).forEach((row, rowNum)  => {
            diags.leftDiag.push(getCell(rowNum, rowNum, byReference));
            diags.rightDiag.push(getCell(rowNum, -(rowNum + 1), byReference));
        });

        return diags;
    }

    return { 
        getMatrix,
        resetMatrix,
        transposeMatrix,
        getDiags,
        getCell,
        setCell
    }
}


export { createMatrix }