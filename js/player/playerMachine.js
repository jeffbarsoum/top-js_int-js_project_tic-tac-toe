import { player } from "./player.js";
// eslint-disable-next-line no-unused-vars
import { createGameBoard } from "../gameBoard.js";
/** @typedef {import { createGameBoard } from "./gameBoard.js";} */

/**
 * @param {createGameBoard} aiBoardRef
 * @param {String} pieceId
 * @param {String} name
 */
const createMachinePlayer = (aiBoardRef, pieceId, name = null) => {
  // we are doing class inheritance by importing the 'parent' and
  // calling / returning it's functions as we need
  const plr = player();
  plr.setName(name ?? "Botty" + " McBotFace");
  plr.setPieceId(pieceId);
  plr.setType("machine");

  const board = aiBoardRef;
  let matrix = aiBoardRef.matrix;

  /**
   *
   * @param {'x' | 'o'} pieceId
   * @param {ReturnType<typeof matrix.getMatrix} decisionInputs
   */
  const getLeastDistanceToWin = (pieceId, decisionInputs) => {
    const emptySquares = board.getEmptySquares();
    if (!emptySquares) return false;

    const decisionMatrix = {};

    for (const vector of decisionInputs) {
      if (!vector.some((cell) => emptySquares.includes(cell))) continue;

      const isPossibleWin = vector
        // of those cells which are not empty...
        .filter((cell) => !matrix.isCellEmpty(cell.row, cell.col))
        // does every cell belong to the pieceId?
        .every((cell) => cell.piece === pieceId);

      if (!isPossibleWin) continue;

      const choices = vector.filter((cell) =>
        matrix.isCellEmpty(cell.row, cell.col),
      );

      const distanceToWin = choices.length;

      decisionMatrix[distanceToWin] = decisionMatrix[distanceToWin]
        ? decisionMatrix[distanceToWin].concat(choices)
        : choices;
    }

    const minDistancetoWin = Math.min(
      ...Object.keys(decisionMatrix)
        .map((distanceToWin) => parseInt(distanceToWin))
        .sort(),
    );

    const decisionArray = decisionMatrix[minDistancetoWin];

    return {
      leastDistance: minDistancetoWin,
      cell: getMostLikelyWinCell(decisionArray),
    };
  };

  /**
   *
   * @param {ReturnType<typeof matrix.getCell>[]} decisionArray
   */
  const getMostLikelyWinCell = (decisionArray) => {
    const cellCounts = decisionArray.reduce((coordCounts, cell) => {
      const coord = `${cell.row}${cell.col}`;
      const coordCount = coordCounts[coord] ?? 0;
      coordCounts[coord] = coordCount + 1;

      return coordCounts;
    }, Object.create(null));

    const maxCellCount = Math.max(...Object.values(cellCounts));
    const maxCellCoord = Object.keys(cellCounts).find(
      (cellCount) => cellCounts[cellCount] === maxCellCount,
    );

    return matrix.getCell(
      parseInt(maxCellCoord.charAt(0)),
      parseInt(maxCellCoord.charAt(1)),
    );
  };

  const setPiece = () => {
    const emptySquares = board.getEmptySquares();
    if (!emptySquares) return false;

    // create an array of arrays of every possible win
    const decisionInputs = matrix
      .getMatrix()
      .concat(matrix.transposeMatrix())
      .concat(Object.values(matrix.getDiags()));

    const bestDecision = getLeastDistanceToWin(
      plr.getPieceId(),
      decisionInputs,
    );

    for (const piece of board.matrix.getPieces()) {
      if (piece === plr.getPieceId()) continue;
      const bestEnemyDecision = getLeastDistanceToWin(piece, decisionInputs);
      if (
        bestEnemyDecision.leastDistance < bestDecision.leastDistance ||
        bestEnemyDecision.leastDistance === 1
      ) {
        return board.setPiece(
          plr.getName(),
          plr.getPieceId(),
          plr.getType(),
          bestEnemyDecision.cell.row,
          bestEnemyDecision.cell.col,
        );
      }
    }
    return board.setPiece(
      plr.getName(),
      plr.getPieceId(),
      plr.getType(),
      bestDecision.cell.row,
      bestDecision.cell.col,
    );
  };

  return {
    setPiece,
    getPlayer: plr.getPlayer,
    addScore: plr.addScore,
    getPieceId: plr.getPieceId,
    getScore: plr.getScore,
    getName: plr.getName,
    getType: plr.getType,
  };
};

export { createMachinePlayer };
