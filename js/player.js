// eslint-disable-next-line no-unused-vars
import { createGameBoard } from "./gameBoard.js";
/** @typedef {import { createGameBoard } from "./gameBoard.js";} */

const player = (() => {
  /** @type {string} */
  let name;
  /** @type {'x' | 'o'} */
  let pieceId;
  /** @type {'machine' | 'human'} */
  let type;
  let score = 0;

  /**
   *
   * @param {number} row
   * @param {number} col
   * @param  {...{player: string | null, piece: 'x' | 'o' | null, type: 'machine' | 'human' | null}} args
   * @returns {{player: string | null, piece: 'x' | 'o' | null, type: 'machine' | 'human' | null}}
   */
  const generatePiece = (row, col, ...args) => {
    return { args, row, col };
  };

  const setType = (tp) => {
    type = tp;
  };

  const getType = () => {
    return type;
  };

  const setPieceId = (pId) => {
    pieceId = pId;
  };

  const getPieceId = () => {
    return pieceId;
  };

  const getScore = () => {
    return score;
  };

  const addScore = () => {
    return score++;
  };

  const setName = (nm) => {
    name = nm;
  };

  const getName = () => {
    return name;
  };

  const getPlayer = () => {
    return {
      name: getName(),
      pieceId: getPieceId(),
      type: getType(),
      score: getScore(),
    };
  };

  const createHumanPlayer = (name, pieceId) => {
    setName(name);
    setPieceId(pieceId);
    setType("human");

    return {
      getPlayer,
      addScore,
      getPieceId,
      getScore,
      getName,
      getType,
    };
  };

  /**
   * @param {createGameBoard} aiBoardRef
   * @param {String} pieceId
   * @param {String} name
   */
  const createMachinePlayer = (aiBoardRef, pieceId, name = null) => {
    console.log("creating MachinePlayer...");
    setName(name ?? "Botty" + " McBotFace");
    setPieceId(pieceId);
    setType("machine");
    let matrix = aiBoardRef.matrix;

    function setPiece() {
      console.log("MachinePlayer: setting piece...");
      const emptySquares = aiBoardRef.getEmptySquares();
      if (!emptySquares) return false;

      console.log("MachinePlayer: Empty squares...", emptySquares);

      // create an array of arrays of every possible win
      const decisionInputs = matrix
        .getMatrix()
        .concat(matrix.transposeMatrix())
        .concat(Object.values(matrix.getDiags()));
      const decisionMatrix = [];

      console.log("MachinePlayer: Decision Inputs...", decisionInputs);

      for (const vector of decisionInputs) {
        // skip vectors without empty cells
        console.log("MachinePlayer: Decision - checking vector...:", vector);
        if (!vector.some((cell) => emptySquares.includes(cell))) continue;
        console.log(
          "MachinePlayer: Decision - Vector with empty squares found...:",
          vector,
        );

        const isPossibleWin = vector
          // of those cells which are not empty...
          .filter((cell) => !matrix.isCellEmpty(cell.row, cell.col))
          // does every cell belong to the machine player?
          .every((cell) => cell.player === getName());
        // add the empty squares of possible wins to decision matrix
        if (isPossibleWin) {
          decisionMatrix.concat(
            vector.filter((cell) => emptySquares.includes(cell)),
          );
        }
      }

      console.log("MachinePlayer: DecisionMatrix...", decisionMatrix);

      const decisionArray = decisionMatrix.flat();
      const cellCounts = decisionArray.reduce((coordCounts, cell) => {
        const coord = `${cell.row}${cell.col}`;
        const coordCount = coordCounts[coord] ?? 0;
        coordCounts[coord] = coordCount + 1;

        return coordCounts;
      }, Object.create(null));

      let maxCellCoord;
      let maxCellCount = 0;
      for (const [coord, count] of Object.entries(cellCounts)) {
        if (count > maxCellCount) {
          maxCellCoord = coord;
        }
      }

      return aiBoardRef.setPiece(
        getName(),
        getPieceId(),
        "machine",
        parseInt(maxCellCoord[0]),
        parseInt(maxCellCoord[1]),
      );
    }

    return {
      setPiece,
      getPlayer,
      addScore,
      getPieceId,
      getScore,
      getName,
      getType,
    };
  };

  return {
    createHumanPlayer,
    createMachinePlayer,
  };
})();

export { player };
