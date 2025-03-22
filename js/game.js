import { createGameBoard } from "./gameBoard.js";
import { createPlayers } from "./players.js";
import { cloneObj } from "./cloneObj.js";

const game = (() => {
  const gameBoard = createGameBoard;
  const players = createPlayers;
  const gameResults = {};
  // const wins = [];

  // let gameStartTime;
  // let playCount = 0;
  players.addActiveHumanPlayer("alice", "o");
  players.addActiveMachinePlayer("steve", "x", gameBoard);
  console.log(
    "game(): players.getActivePlayers() [after adding one human and one machine]...: ",
    players.getActivePlayers().map((plr) => plr.getPlayer()),
  );

  console.log("game(): players.getActivePlayers()", players.getActivePlayers());
  console.log(
    "game(): players.getActivePlayers().getType()",
    players.getActivePlayers().map((plr) => plr.getType()),
  );

  // const addPlayCount = () => { return playCount++ }

  const playerTurn = () => {
    let turnResult;
    const getEmptySquares = gameBoard.getEmptySquares();
    if (!getEmptySquares) {
      alert("no more empty squares...");
      return;
    }
    while (!turnResult) {
      const emptySquares = `Empty squares: ${getEmptySquares.map((piece) => `[${piece.row}, ${piece.col}]`)}`;
      const currentPlayer = players.getCurrentPlayer();
      // alert(msg)

      const currentType = currentPlayer.getType();
      console.log("playerTurn: currentPlayer", currentPlayer);
      console.log("playerTurn: currentType", currentType);
      if (currentType === "machine") {
        console.log("playerTurn: this is a machine player...:", currentPlayer);
        turnResult = currentPlayer.setPiece();
      } else {
        console.log("playerTurn: this is a human player...:", currentPlayer);
        turnResult = gameBoard.setPiece(
          currentPlayer.getName(),
          currentPlayer.getPieceId(),
          currentType,
          Number(
            prompt(
              `${emptySquares}\n\n${currentPlayer.getName()}, please enter the row you want to place your piece:`,
            ),
          ),
          Number(prompt(`${emptySquares}\n\nCool, now the column pls...:`)),
        );
      }

      console.log("playerTurn: turnResult...:", turnResult);
      if (turnResult) break;

      const cancelGame = confirm("Hey, like, maybe select an empty square...");
      console.log("playerTurn: cancelGame? :", cancelGame);
      if (!cancelGame) return false;
    }
    return true;
  };

  const getWinner = () => {
    let winningScore = 0;
    let winner;
    if (
      players
        .getActivePlayers()
        .every((player, i, arr) => player.getScore() === arr[0].getScore())
    )
      return "draw";
    console.log(
      "getWinner launched - getActivePlayers()",
      players.getActivePlayers(),
    );
    players.getActivePlayers().forEach((player) => {
      console.log("getWinner launced...player: ", player);
      if (player.getScore() > winningScore) {
        winningScore = player.getScore();
        winner = player;
      }
    });
    return winner;
  };

  const play = (
    wins = [],
    playCount = 0,
    gameStartTime = new Date().getTime(),
  ) => {
    let win;

    while (!win) {
      const turn = playerTurn();
      if (!turn) return;
      if (turn) players.nextPlayer();
      win = gameBoard.isWin();
      console.log("gameboard, check win....");
      console.log(win);
      //   if (!win) players.nextPlayer();
    }

    if (win.win !== "draw") players.getCurrentPlayer(true).addScore();
    // console.log('game.play = playCount before...: ', playCount)
    playCount++;
    // console.log('game.play = playCount after...: ', playCount)

    // add players with scores to gameBoard win result for saving
    wins.push(win);
    win = null;

    let playAgain = confirm(
      `${players.getCurrentPlayer().getName()} wins!\n\nDo you want to play again?`,
    );

    if (playAgain) {
      gameBoard.resetGame();
      play(wins, playCount, gameStartTime);
    } else {
      gameResults[gameStartTime] = {
        wins: cloneObj(wins),
        playCount,
        players: players.getActivePlayers().map((player) => player.getPlayer()),
        winner: getWinner(),
      };
      wins.length = 0;
      playCount = 0;
      console.log("game ended, print gameResults...:", gameResults);
      return gameResults;
    }

    // console.log('game ended, print matrix after external reset...:', gameBoard.matrix )
  };

  return { play };
})();

export { game };
