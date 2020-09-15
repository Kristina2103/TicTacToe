let board;
const humanPlayer = "o";
const computerPlayer = "x";
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const fields = document.querySelectorAll(".field");

startGame();

function startGame() {
  //close modal
  document.querySelector("#end").style.display = "none";

  board = Array.from(Array(9).keys());

  board.map((element) => {
    fields[element].innerHTML = ""; // reset board - initial state
    fields[element].style.removeProperty("background-color"); // clear bg - initial state
    fields[element].addEventListener("click", onFieldClick, false); // field event listener
  });
}

function onFieldClick(e) {
  setFieldValue(e.target.id, humanPlayer);
}

function setFieldValue(id, player) {
  fields[id].innerHTML = player;
  board[id] = player; // assign player sign to apropriate board field
  // ***
  let gameWon = isWinCombination(board, player);
  if (gameWon) gameOver(gameWon);
}

function isWinCombination(board, player) {
  //find all selected fields by player
  const playHistory = board.reduce(
    (a, el, i) => (el === player ? a.concat(i) : a),
    []
  );

  // compare playHistory with winCombinations
  let gameOver = null;
  for (let [winCombRowIndex, winCombRow] of winCombinations.entries()) {
    if (
      winCombRow.every(
        (winCombRowChild) => playHistory.indexOf(winCombRowChild) > -1
      )
    ) {
      gameOver = { winCombRowIndex, player };
      break;
    }
  }
  return gameOver;
}

function gameOver(gameWon) {
  //Mark the winning combination
  for (let index of winCombinations[gameWon.winCombRowIndex]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? "#7eef7e" : "red";
  }
  //disable fields
  fields.forEach((field) =>
    field.removeEventListener("click", onFieldClick, false)
  );
}
