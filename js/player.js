// eslint-disable-next-line no-unused-vars
import { createGameBoard } from "./gameBoard.js";
/** @typedef {import { createGameBoard } from "./gameBoard.js";} */

const player = () => {
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
    console.log(
      "createMachinePlayer - after setting vars, what are they...: ",
      `name: ${name}, pieceId: ${pieceId}, type: ${getType()}`,
    );
    const board = aiBoardRef;
    let matrix = aiBoardRef.matrix;
    console.log("createMachinePlayer: board: ", board);
    console.log("createMachinePlayer: matrix: ", matrix);

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
        // console.log(
        //   "MachinePlayer: Decision - isPossibleWin - choices...:",
        //   choices,
        // );
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

      //   console.log("MachinePlayer: decisionMatrix...", decisionMatrix);
      console.log(
        "getLeastDistanceToWin: minDistancetoWin...",
        minDistancetoWin,
      );
      console.log("getLeastDistanceToWin: decisionArray...", decisionArray);
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

      console.log("getMostLikelyWinCell - cellCounts: ", cellCounts);

      const maxCellCount = Math.max(...Object.values(cellCounts));
      console.log("getMostLikelyWinCell - maxCellCount: ", maxCellCount);
      const maxCellCoord = Object.keys(cellCounts).find(
        (cellCount) => cellCounts[cellCount] === maxCellCount,
      );

      console.log(
        "getMostLikelyWinCell - cell: ",
        matrix.getCell(
          parseInt(maxCellCoord.charAt(0)),
          parseInt(maxCellCoord.charAt(1)),
        ),
      );
      return matrix.getCell(
        parseInt(maxCellCoord.charAt(0)),
        parseInt(maxCellCoord.charAt(1)),
      );
    };

    const setPiece = () => {
      console.log("MachinePlayer: setting piece...");
      console.log("MachinePlayer: what is 'this': ", this);
      console.log("MachinePlayer: board reference: ", board);
      const emptySquares = board.getEmptySquares();
      if (!emptySquares) return false;

      console.log("MachinePlayer: Empty squares...", emptySquares);

      // create an array of arrays of every possible win
      const decisionInputs = matrix
        .getMatrix()
        .concat(matrix.transposeMatrix())
        .concat(Object.values(matrix.getDiags()));
      const decisionMatrix = {};

      console.log("MachinePlayer: Decision Inputs...", decisionInputs);
      let bestDecision = getLeastDistanceToWin(getPieceId(), decisionInputs);
      console.log("MachinePlayer: bestDecision: ", bestDecision);
      let bestEnemyDecisions = {};
      console.log(
        "MachinePlayer: board.matrix.getPieces(): ",
        board.matrix.getPieces(),
      );
      for (const piece of board.matrix.getPieces()) {
        console.log("MachinePlayer: piece : ", piece);
        if (piece === getPieceId()) continue;
        const bestEnemyDecision = getLeastDistanceToWin(piece, decisionInputs);
        console.log("MachinePlayer: bestEnemyDecision: ", bestEnemyDecision);
        if (
          bestEnemyDecision.leastDistance < bestDecision.leastDistance ||
          bestEnemyDecision.leastDistance === 1
        ) {
          return board.setPiece(
            getName(),
            getPieceId(),
            getType(),
            bestEnemyDecision.cell.row,
            bestEnemyDecision.cell.col,
          );
        }
      }
      return board.setPiece(
        getName(),
        getPieceId(),
        getType(),
        bestDecision.cell.row,
        bestDecision.cell.col,
      );

      //   for (const vector of decisionInputs) {
      //     // skip vectors without empty cells
      //     // console.log("MachinePlayer: Decision - checking vector...:", vector);
      //     if (!vector.some((cell) => emptySquares.includes(cell))) continue;
      //     // console.log(
      //     //   "MachinePlayer: Decision - Vector with empty squares found...:",
      //     //   vector,
      //     // );

      //     const isPossibleWin = vector
      //       // of those cells which are not empty...
      //       .filter((cell) => !matrix.isCellEmpty(cell.row, cell.col))
      //       // does every cell belong to the machine player?
      //       .every((cell) => cell.player === getName());

      //     console.log(
      //       "isPossibleWin - select only filled cells...: ",
      //       vector.filter((cell) => !matrix.isCellEmpty(cell.row, cell.col)),
      //     );

      //     // console.log(
      //     //   "MachinePlayer: Decision - isPossibleWin...:",
      //     //   isPossibleWin,
      //     // );

      //     const isEmptyRow = vector.every((cell) =>
      //       matrix.isCellEmpty(cell.row, cell.col),
      //     );

      //     // console.log("MachinePlayer: Decision - isEmptyRow...:", isEmptyRow);

      //     if (!isPossibleWin && !isEmptyRow) continue;

      //     if (isPossibleWin) {
      //       const choices = vector.filter((cell) =>
      //         matrix.isCellEmpty(cell.row, cell.col),
      //       );
      //       console.log(
      //         "MachinePlayer: Decision - isPossibleWin - choices...:",
      //         choices,
      //       );
      //       const distanceToWin = choices.length;

      //       decisionMatrix[distanceToWin] = decisionMatrix[distanceToWin]
      //         ? decisionMatrix[distanceToWin].concat(choices)
      //         : choices;
      //     } else if (isEmptyRow) {
      //       console.log("MachinePlayer: Decision - isEmptyRow...:", vector);
      //       decisionMatrix[3] = decisionMatrix[3]
      //         ? decisionMatrix[3].concat(vector)
      //         : vector;
      //     } else {
      //       console.log(
      //         "this is a vector the machine cant win, do nothin..",
      //         vector,
      //       );
      //     }
      //   }

      //   //   console.log("MachinePlayer: DecisionMatrix...", decisionMatrix);

      //   const minDistancetoWin = Math.min(
      //     ...Object.keys(decisionMatrix)
      //       .map((distanceToWin) => parseInt(distanceToWin))
      //       .sort(),
      //   );

      //   //   console.log(
      //   //     "MachinePlayer: minDistancetoWin - Object.keys(decisionMatrix)...",
      //   //     Object.keys(decisionMatrix),
      //   //   );
      //   //   console.log(
      //   //     "MachinePlayer: minDistancetoWin - Object.keys(decisionMatrix).map...",
      //   //     Object.keys(decisionMatrix).map((distanceToWin) =>
      //   //       parseInt(distanceToWin),
      //   //     ),
      //   //   );
      //   //   console.log(
      //   //     "MachinePlayer: minDistancetoWin - Object.keys(decisionMatrix).map...",
      //   //     Math.min(
      //   //       ...Object.keys(decisionMatrix).map((distanceToWin) =>
      //   //         parseInt(distanceToWin),
      //   //       ),
      //   //     ),
      //   //   );
      //   //   console.log("MachinePlayer: minDistancetoWin...", minDistancetoWin);

      //   const decisionArray = decisionMatrix[minDistancetoWin];
      //   console.log("MachinePlayer: decisionMatrix...", decisionMatrix);
      //   //   console.log("MachinePlayer: decisionArray...", decisionArray);
      //   const cellCounts = decisionArray.reduce((coordCounts, cell) => {
      //     const coord = `${cell.row}${cell.col}`;
      //     const coordCount = coordCounts[coord] ?? 0;
      //     coordCounts[coord] = coordCount + 1;

      //     return coordCounts;
      //   }, Object.create(null));

      //   console.log("MachinePlayer: decisionArray...", decisionArray);
      //   //   console.log("MachinePlayer: cellCounts...", cellCounts);
      //   //   console.log(
      //   //     "MachinePlayer: Math.max(Object.values(cellCounts))...",
      //   //     Math.max(...Object.values(cellCounts)),
      //   //   );

      //   const maxCellCount = Math.max(...Object.values(cellCounts));
      //   const maxCellCoord = Object.keys(cellCounts).find(
      //     (cellCount) => cellCounts[cellCount] === maxCellCount,
      //   );

      //   console.log("MachinePlayer: maxCellCount...", maxCellCount);
      //   console.log("MachinePlayer: maxCellCoord...", maxCellCoord);

      //   for (const piece of board.ge)
      //     return board.setPiece(
      //       getName(),
      //       getPieceId(),
      //       "machine",
      //       parseInt(maxCellCoord.charAt(0)),
      //       parseInt(maxCellCoord.charAt(1)),
      //     );
    };

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
};

export { player };
