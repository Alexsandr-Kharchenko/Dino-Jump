const pacman = document.getElementById("pacman");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");

let isJumping = false;
let score = 0;
let pacmanPosition = 0;
pacman.style.bottom = pacmanPosition + "px";

const obstaclesList = [
  "assets/ghost.png",
  "assets/ghost1.png",
  "assets/ghost2.png",
  "assets/rock.png",
];

// Кешування зображень
obstaclesList.forEach((src) => (new Image().src = src));

// Функція для отримання адаптивної максимальної висоти стрибка
function getMaxJump() {
  const width = window.innerWidth;
  if (width <= 375) return game.offsetHeight * 0.55;
  if (width <= 678) return game.offsetHeight * 0.6;
  return game.offsetHeight * 0.65;
}

// Адаптивний розмір Pacman
function updatePacmanSize() {
  const width = window.innerWidth;
  let pacWidth;
  if (width <= 375) pacWidth = game.offsetWidth * 0.08;
  else if (width <= 678) pacWidth = game.offsetWidth * 0.07;
  else pacWidth = game.offsetWidth * 0.06;

  pacman.style.width = `${pacWidth}px`;
  pacman.style.height = `${pacWidth}px`;
}

function getObstacleSize() {
  const width = window.innerWidth;
  if (width <= 375) return game.offsetWidth * 0.08;
  if (width <= 678) return game.offsetWidth * 0.07;
  return game.offsetWidth * 0.06;
}

// Стартове оновлення розмірів
updatePacmanSize();
window.addEventListener("resize", () => {
  updatePacmanSize();
});

function jump() {
  if (isJumping) return;
  isJumping = true;

  const maxHeight = getMaxJump();
  const upSpeed = maxHeight / 20;
  const downSpeed = maxHeight / 18;

  let goingUp = true;

  const move = () => {
    if (goingUp) {
      pacmanPosition += upSpeed;
      if (pacmanPosition >= maxHeight) goingUp = false;
    } else {
      pacmanPosition -= downSpeed;
      if (pacmanPosition <= 0) {
        pacmanPosition = 0;
        isJumping = false;
        pacman.style.bottom = `${pacmanPosition}px`;
        return;
      }
    }
    pacman.style.bottom = `${pacmanPosition}px`;
    requestAnimationFrame(move);
  };

  requestAnimationFrame(move);
}

// Масив активних перешкод
let activeObstacles = [];

function createObstacle() {
  if (activeObstacles.length >= 4) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const randomIndex = Math.floor(Math.random() * obstaclesList.length);
  obstacle.style.backgroundImage = `url(${obstaclesList[randomIndex]})`;
  obstacle.style.backgroundSize = "contain";
  obstacle.style.backgroundRepeat = "no-repeat";
  obstacle.style.backgroundPosition = "center";

  const obsSize = getObstacleSize();
  obstacle.style.width = `${obsSize}px`;
  obstacle.style.height = `${obsSize}px`;
  obstacle.style.position = "absolute";
  obstacle.style.bottom = "0px";

  game.appendChild(obstacle);
  activeObstacles.push(obstacle);

  let posX = game.offsetWidth;

  const moveObstacle = () => {
    const width = window.innerWidth;
    let speed = Math.min(5 + score * 0.3, 14);
    if (width <= 375) speed *= 0.7;
    else if (width <= 678) speed *= 0.85;

    posX -= speed;
    obstacle.style.transform = `translateX(${posX}px)`;

    // Зіткнення
    const pacWidth = pacman.offsetWidth;
    const pacHeight = pacman.offsetHeight;
    const obsWidth = obstacle.offsetWidth;
    const obsHeight = obstacle.offsetHeight;

    if (
      posX < pacman.offsetLeft + pacWidth &&
      posX + obsWidth > pacman.offsetLeft &&
      pacmanPosition < obsHeight
    ) {
      alert(`Game Over! 🟡 Рахунок: ${score}`);
      resetGame();
      return;
    }

    if (posX < -obsWidth) {
      obstacle.remove();
      activeObstacles = activeObstacles.filter((o) => o !== obstacle);
      score++;
      scoreEl.textContent = score;
      return;
    }

    requestAnimationFrame(moveObstacle);
  };

  requestAnimationFrame(moveObstacle);

  const minTime = 800;
  const maxTime = 2200;
  setTimeout(createObstacle, Math.random() * (maxTime - minTime) + minTime);
}

function resetGame() {
  activeObstacles.forEach((o) => o.remove());
  activeObstacles = [];
  score = 0;
  scoreEl.textContent = score;
  pacmanPosition = 0;
  pacman.style.bottom = pacmanPosition + "px";
}

// Старт першої перешкоди
createObstacle();

// Клавіатура
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

// Тач для мобільних
document.addEventListener("touchstart", () => {
  jump();
});
