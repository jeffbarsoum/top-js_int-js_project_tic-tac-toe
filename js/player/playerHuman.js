import { player } from "./player.js";

const createHumanPlayer = (name, pieceId) => {
  // we are doing class inheritance by importing the 'parent' and
  // calling / returning it's functions as we need
  const plr = player();
  plr.setName(name);
  plr.setPieceId(pieceId);
  plr.setType("human");

  return {
    getPlayer: plr.getPlayer,
    addScore: plr.addScore,
    getPieceId: plr.getPieceId,
    getScore: plr.getScore,
    getName: plr.getName,
    getType: plr.getType,
  };
};

export { createHumanPlayer };
