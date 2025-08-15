let currentPlayer = 1;
let gameActive = false;
let board = Array(9).fill(null);
let player1Emoji = '';
let player2Emoji = '';
let player1History = [];
let player2History = [];
let bannedIndices = {1: [], 2: []};

const boardEl = document.getElementById('board');
const turnInfoEl = document.getElementById('turn-info');

function startGame() {
  player1Emoji = document.getElementById('player1-emoji').value;
  player2Emoji = document.getElementById('player2-emoji').value;

  if (player1Emoji === player2Emoji) {
    alert("Each player must choose a different emoji!");
    return;
  }

  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  initBoard();
  gameActive = true;
  updateTurnInfo();
}

function resetGame() {
  currentPlayer = 1;
  gameActive = true;
  board = Array(9).fill(null);
  player1History = [];
  player2History = [];
  bannedIndices = {1: [], 2: []};
  initBoard();
  updateTurnInfo();
}

function initBoard() {
  boardEl.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    boardEl.appendChild(cell);
  }
}

function handleCellClick(e) {
  if (!gameActive) return;
  const index = parseInt(e.target.dataset.index);
  const history = currentPlayer === 1 ? player1History : player2History;
  const banned = bannedIndices[currentPlayer];

  if (board[index] !== null || banned.includes(index)) return;

  const emoji = currentPlayer === 1 ? player1Emoji : player2Emoji;
  board[index] = { player: currentPlayer, emoji };
  history.push(index);
  renderBoard();

  // Vanishing logic
  if (history.length > 3) {
    const removedIndex = history.shift();
    board[removedIndex] = null;
    banned.push(removedIndex);
  }

  if (checkWin(currentPlayer)) {
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  updateTurnInfo();
}

function renderBoard() {
  Array.from(boardEl.children).forEach((cell, i) => {
    const value = board[i];
    cell.textContent = value ? value.emoji : '';
    cell.classList.remove('winning');
  });
}

function updateTurnInfo() {
  turnInfoEl.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWin(player) {
  const playerIndices = board
    .map((val, i) => val && val.player === player ? i : null)
    .filter(i => i !== null);

  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (const pattern of winPatterns) {
    if (pattern.every(i => playerIndices.includes(i))) {
      highlightWinningCells(pattern);
      turnInfoEl.textContent = `Player ${player} Wins! ${randomWinMessage()}`;
      return true;
    }
  }
  return false;
}

function highlightWinningCells(indices) {
  indices.forEach(i => {
    const cell = boardEl.children[i];
    cell.classList.add('winning');
  });
}

function randomWinMessage() {
  const messages = [
    "Awesome! 🎉",
    "Victory! 💪",
    "You nailed it! 🔥",
    "Well played! 🧠",
    "Boom! 💥"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}
