import { cloneObj } from "./cloneObj.js";

const createMatrix = (size = 3) => {
  let matrix = initMatrix();

  /**
   * @returns {ReturnType<typeof cell>[][]}
   */
  function initMatrix() {
    const matrix = [];

    for (let row = 0; row < size; row++) {
      matrix.push([]);
      for (let col = 0; col < size; col++) {
        const [player, piece] = [null, null];
        matrix[row].push(cell(row, col, player, piece));
      }
    }
    return matrix;
  }

  /**
   * @returns {typeof matrix>}
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
   * @param {'x' | 'o' | null} piece
   * @param {'machine' | 'human' | null} type
   */
  function cell(row, col, player = null, piece = null, type = null) {
    return { player, piece, type, row, col };
  }

  function setCell(row, col, player = null, piece = null, type = null) {
    matrix[row][col] = cell(row, col, player, piece, type);
  }

  /**
   *
   * @param {number} row
   * @param {number} col
   * @param {true | boolean} byReference
   * @returns {ReturnType<typeof cell>}
   */
  function getCell(row, col, byReference = true) {
    if (byReference) return matrix.at(row).at(col);
    return cloneObj(matrix.at(row).at(col));
  }

  /**
   *
   * @returns {typeof matrix>}
   */
  function resetMatrix() {
    const finalMatrix = cloneObj(matrix);
    matrix.length = 0;
    matrix = initMatrix();
    return finalMatrix;
  }

  /**
   *
   * @returns {typeof matrix>}
   */
  function transposeMatrix() {
    const winCol = initMatrix();
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[0].length; col++) {
        winCol[row][col] = matrix[col][row];
      }
    }
    return winCol;
  }

  /**
   *
   * @param {boolean} byReference
   * @returns {{
   *      leftDiag: ReturnType<typeof cell>[],
   *      rightDiag: ReturnType<typeof cell>[],
   * }}
   */
  function getDiags(byReference = true) {
    const diags = { leftDiag: [], rightDiag: [] };
    getMatrix(byReference).forEach((row, rowNum) => {
      diags.leftDiag.push(getCell(rowNum, rowNum, byReference));
      diags.rightDiag.push(getCell(rowNum, -(rowNum + 1), byReference));
    });

    return diags;
  }

  /**
   *
   * @returns {['x' | 'o']}
   */
  function getPieces() {
    const pieces = [];
    for (const row of matrix) {
      for (const cell of row) {
        console.log("getPieces() - pieces:", pieces);
        console.log("getPieces() - cell:", cell);
        console.log(
          "getPieces() - piece not found",
          pieces.find((piece) => piece === cell.piece) === -1,
        );
        if (pieces.find((piece) => piece === cell.piece) > -1) continue;
        pieces.push(cell.piece);
      }
    }
    return pieces;
  }

  function isCellEmpty(row, col) {
    // console.log("matrix.isCellEmpty runnin...");
    // console.log("matrix.isCellEmpty - getCell(row, col): ", getCell(row, col));
    return !getCell(row, col).player;
  }

  return {
    getMatrix,
    resetMatrix,
    transposeMatrix,
    getDiags,
    getCell,
    setCell,
    isCellEmpty,
    getPieces,
  };
};

export { createMatrix };
