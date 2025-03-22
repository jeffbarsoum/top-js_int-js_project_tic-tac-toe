import { player } from "./player.js";
import { cloneObj } from "./cloneObj.js";

const createPlayers = (() => {
  const createMachinePlayer = player().createMachinePlayer;
  const createHumanPlayer = player().createHumanPlayer;

  const freePlayers = ["x", "o"];
  /**@type {(ReturnType<player().createHumanPlayer> | ReturnType<player().createMachinePlayer>)[]}  */
  const activePlayers = [];
  /**@type {ReturnType<typeof createHumanPlayer> | ReturnType<typeof createMachinePlayer>}  */
  let currentPlayer;

  //   const addActivePlayer = (name = null, pieceId = null, aiBoardRef = null) => {
  //     // const pieceId = player.getPieceId()
  //     // activePlayers.push(player.createMachinePlayer(aiBoardRef, pieceId, name))
  //     if (name && !pieceId) {
  //       throw `Error! No pieceId!`;
  //     }

  //     const pieceIndex = pieceId
  //       ? 0
  //       : freePlayers.findIndex((pc) => pc === pieceId);
  //     if (pieceIndex === -1) {
  //       throw `Error! Piece '${pieceId}' is already taken`;
  //     }

  //     pieceId = freePlayers[pieceIndex];

  //     const newPlayer =
  //       aiBoardRef === null
  //         ? player.createHumanPlayer(name, pieceId)
  //         : player.createMachinePlayer(aiBoardRef, pieceId, name);

  //     freePlayers.splice(pieceIndex, 1).pop();
  //     activePlayers.push(newPlayer);

  //     if (!currentPlayer) currentPlayer = activePlayers[0];
  //   };

  /**
   *
   * @param {'x' | 'o'} pieceId
   * @returns {'x' | 'o'}
   */
  const selectFreePlayer = (pieceId) => {
    const pieceIndex = freePlayers.findIndex((pc) => pc === pieceId);

    if (pieceIndex === -1) {
      throw `Error! Piece '${pieceId}' is already taken`;
    }

    if (pieceId !== freePlayers[pieceIndex]) {
      throw `Error! check selectFreePlayer method, freePlayers / pieceId mismatch...`;
    }

    return freePlayers.splice(pieceIndex, 1).pop();
  };

  const setCurrentPlayer = () => {
    currentPlayer = activePlayers[0];
  };

  const addActiveHumanPlayer = (name, pieceId) => {
    if (selectFreePlayer(pieceId)) {
      activePlayers.push(createHumanPlayer(name, pieceId));
      setCurrentPlayer();
    }
  };

  const addActiveMachinePlayer = (name, pieceId, aiBoardRef) => {
    console.log("addActiveMachinePlayer - name");
    if (selectFreePlayer(pieceId)) {
      activePlayers.push(createMachinePlayer(aiBoardRef, pieceId, name));
      setCurrentPlayer();
    }
  };

  const nextPlayer = () => {
    console.log("nextPlayer launched...");
    console.log("nextPlayer: activePlayers before shift...: ", activePlayers);
    console.log("nextPlayer: currentPlayer before shift...: ", currentPlayer);
    activePlayers.unshift(activePlayers.pop());
    currentPlayer = activePlayers[0];
    console.log("nextPlayer: activePlayers after shift...: ", activePlayers);
    console.log("nextPlayer: currentPlayer after shift...: ", currentPlayer);
  };

  const getFreePlayers = () => {
    return freePlayers;
  };

  /**
   *
   * @param {false | boolean} byReference
   * @returns {typeof currentPlayer[]}
   */
  const getActivePlayers = (byReference = true) => {
    return byReference ? activePlayers : cloneObj(activePlayers);
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  return {
    addActiveHumanPlayer,
    addActiveMachinePlayer,
    nextPlayer,
    getFreePlayers,
    getActivePlayers,
    getCurrentPlayer,
  };
})();

export { createPlayers };
