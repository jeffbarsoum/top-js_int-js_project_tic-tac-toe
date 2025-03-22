import { createGameBoard } from "./gameBoard.js";
import { createPlayers } from "./players.js";
import { cloneObj } from "./cloneObj.js";

const game = (() => {
  const gameBoard = createGameBoard;
  const players = createPlayers;
  const gameResults = {};

  players.addActiveHumanPlayer("alice", "o");
  players.addActiveMachinePlayer("steve", "x", gameBoard);

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

      const currentType = currentPlayer.getType();
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

      if (turnResult) break;

      const cancelGame = confirm("Hey, like, maybe select an empty square...");
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

    players.getActivePlayers().forEach((player) => {
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
      console.log("gameboard, check win....: ", win);
    }

    if (win.win !== "draw") players.getCurrentPlayer(true).addScore();
    playCount++;

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
