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

const outcome = {
  success: {
    className: "winner",
    message: "Excelent job! You won!",
    boardWinnerFieldsColor: "#7eef7e",
  },
  fail: {
    className: "fail",
    message: "Are you sleepy?! Better luck next time!",
    boardWinnerFieldsColor: "#a30000eb",
  },
  unresolved: {
    className: "unresolved",
    message: "Unresolved! Better luck next time!",
    boardWinnerFieldsColor: "",
  },
};

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
//Fires only when user (humanPlayer) play
function onFieldClick(e) {
  //setHumanPlayer field
  setFieldValue(e.target.id, humanPlayer);

  //get rest fields
  const restElements = getRestElements(e.target.id);

  //Check if it is not last checked field on the board and pick one random field for computerPlayer
  if (restElements.length > 0) {
    //pick random field for computerPlayer
    let randomField =
      restElements[Math.floor(Math.random() * restElements.length)];

    //set computerPlayer field
    setFieldValue(randomField, computerPlayer);
  }
}

function setFieldValue(id, player) {
  fields[id].innerHTML = player;
  board[id] = player; // assign player sign to apropriate board field
  // ***
  //disable button
  fields[id].removeEventListener("click", onFieldClick, false);
  let gameWon = isWinCombination(board, player);
  if (gameWon) gameOver(gameWon);

  const restElements = getRestElements(id);
  if (restElements.length < 1 && !gameWon) {
    showGameResults(outcome.unresolved);
  }
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
  const winnerOutcome =
    gameWon.player == humanPlayer ? outcome.success : outcome.fail;

  //Mark the winning combination
  for (let index of winCombinations[gameWon.winCombRowIndex]) {
    document.getElementById(index).style.backgroundColor =
      winnerOutcome.boardWinnerFieldsColor;
  }
  showGameResults(winnerOutcome);
}
function getRestElements(id) {
  return board.filter((el) => el !== id && el % 1 === 0);
}

function showGameResults(outcome) {
  console.log(outcome);
  //disable fields
  fields.forEach((field) =>
    field.removeEventListener("click", onFieldClick, false)
  );
  document.querySelector("#end").removeAttribute("class");
  document.querySelector("#end").classList.add(outcome.className);
  document.querySelector("#end").style.display = "flex";
  document.querySelector("#end .result").innerHTML = outcome.message;
}
