const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const resetBtn = document.getElementById('resetBtn');

const xSound = new Audio('x-sound.mp3');
const oSound = new Audio('o-sound.mp3');
const winSound = new Audio('win-sound.mp3');

let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function checkWinner() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
      statusText.textContent = `${currentPlayer} wins! 🎉`;
      gameActive = false;
      showWinLine(a, c);
      winSound.play();
      launchConfetti();
      return;
    }
  }
  if (!gameState.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
  }
}

function showWinLine(startIndex, endIndex) {
  const line = document.getElementById("win-line");
  const cellStart = cells[startIndex].getBoundingClientRect();
  const cellEnd = cells[endIndex].getBoundingClientRect();

  const x1 = cellStart.left + cellStart.width / 2 + window.scrollX;
  const y1 = cellStart.top + cellStart.height / 2 + window.scrollY;
  const x2 = cellEnd.left + cellEnd.width / 2 + window.scrollX;
  const y2 = cellEnd.top + cellEnd.height / 2 + window.scrollY;

  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  line.style.width = `${length}px`;
  line.style.transform = `rotate(${angle}deg)`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.display = 'block';
}

function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = Array.from({ length: 150 }).map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 6 + 4,
    d: Math.random() * 100 + 50,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    tilt: Math.random() * 10 - 10
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      ctx.beginPath();
      ctx.fillStyle = c.color;
      ctx.ellipse(c.x, c.y, c.r, c.r / 2, c.tilt, 0, 2 * Math.PI);
      ctx.fill();
    });
    update();
  }

  function update() {
    confetti.forEach(c => {
      c.y += 2;
      c.x += Math.sin(c.y / 15);
      if (c.y > canvas.height) {
        c.y = -10;
        c.x = Math.random() * canvas.width;
      }
    });
  }

  let interval = setInterval(draw, 20);
  setTimeout(() => {
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 5000);
}

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = cell.getAttribute('data-index');
    if (gameState[index] === "" && gameActive) {
      gameState[index] = currentPlayer;
      cell.textContent = currentPlayer;
      cell.classList.add(currentPlayer); // Add X or O class for color

      // Play move sound
      currentPlayer === 'X' ? xSound.play() : oSound.play();

      checkWinner();
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      if (gameActive) statusText.textContent = `${currentPlayer}'s turn`;
    }
  });
});

resetBtn.addEventListener('click', () => {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = 'X';
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove('X', 'O');
  });
  statusText.textContent = "Your Move!";
  document.getElementById('win-line').style.display = 'none';
});
