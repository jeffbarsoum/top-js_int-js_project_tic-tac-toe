import { player } from "./player.js";
import { cloneObj } from "./cloneObj.js";

const createPlayers = (() => {
  const freePlayers = ["x", "o"];
  /**@type {(ReturnType<typeof player.createHumanPlayer> | ReturnType<typeof player.createMachinePlayer>)[]}  */
  const activePlayers = [];
  /**@type {ReturnType<typeof player.createHumanPlayer> | ReturnType<typeof player.createMachinePlayer>}  */
  let currentPlayer;

  const addActivePlayer = (name = null, pieceId = null, aiBoardRef = null) => {
    // const pieceId = player.getPieceId()
    // activePlayers.push(player.createMachinePlayer(aiBoardRef, pieceId, name))
    if (name && !pieceId) {
      throw `Error! No pieceId!`;
    }

    const pieceIndex = pieceId
      ? 0
      : freePlayers.findIndex((pc) => pc === pieceId);
    if (pieceIndex === -1) {
      throw `Error! Piece '${pieceId}' is already taken`;
    }

    pieceId = freePlayers[pieceIndex];

    const newPlayer = aiBoardRef
      ? player.createMachinePlayer(aiBoardRef, pieceId, name)
      : player.createHumanPlayer(name, pieceId);

    freePlayers.splice(pieceIndex, 1).pop();
    activePlayers.push(newPlayer);

    if (!currentPlayer) currentPlayer = activePlayers[0];
  };

  const nextPlayer = () => {
    activePlayers.unshift(activePlayers.pop());
    currentPlayer = activePlayers[0];
  };

  const getFreePlayers = () => {
    return freePlayers;
  };

  /**
   *
   * @param {false | boolean} byReference
   * @returns @type {(ReturnType<typeof player.createHumanPlayer> | ReturnType<typeof player.createMachinePlayer>)[]}
   */
  const getActivePlayers = (byReference = false) => {
    return byReference ? activePlayers : cloneObj(activePlayers);
  };

  /**
   *
   * @returns @type {ReturnType<typeof player.createHumanPlayer> | ReturnType<typeof player.createMachinePlayer>}
   */
  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  return {
    addActivePlayer,
    nextPlayer,
    getFreePlayers,
    getActivePlayers,
    getCurrentPlayer,
  };
})();

export { createPlayers };
