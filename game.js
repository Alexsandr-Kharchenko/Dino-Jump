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

function jump() {
  if (isJumping) return;
  isJumping = true;

  const maxHeight = 200;
  const upSpeed = 15;
  const downSpeed = 12;

  const upInterval = setInterval(() => {
    pacmanPosition += upSpeed;
    if (pacmanPosition >= maxHeight) {
      clearInterval(upInterval);
      const downInterval = setInterval(() => {
        pacmanPosition -= downSpeed;
        if (pacmanPosition <= 0) {
          pacmanPosition = 0;
          clearInterval(downInterval);
          isJumping = false;
        }
        pacman.style.bottom = pacmanPosition + "px";
      }, 20);
    } else {
      pacman.style.bottom = pacmanPosition + "px";
    }
  }, 20);
}

// Масив активних перешкод
let activeObstacles = [];

function createObstacle() {
  if (activeObstacles.length >= 4) return; // максимум 4 одночасно

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  // Випадкова картинка
  const randomIndex = Math.floor(Math.random() * obstaclesList.length);
  obstacle.style.backgroundImage = `url(${obstaclesList[randomIndex]})`;
  obstacle.style.backgroundSize = "contain";
  obstacle.style.backgroundRepeat = "no-repeat";
  obstacle.style.backgroundPosition = "center";
  obstacle.style.position = "absolute";
  obstacle.style.bottom = "0px";
  obstacle.style.width = "50px";
  obstacle.style.height = "50px";

  game.appendChild(obstacle);
  activeObstacles.push(obstacle);

  let posX = game.offsetWidth;

  const moveObstacle = () => {
    const speed = Math.min(5 + score * 0.3, 14);
    posX -= speed;
    obstacle.style.transform = `translateX(${posX}px)`;

    // Зіткнення
    if (posX > 60 && posX < 110 && pacmanPosition < 50) {
      alert(`Game Over! 🟡 Рахунок: ${score}`);
      resetGame();
      return;
    }

    // Перешкода вийшла за екран
    if (posX < -50) {
      obstacle.remove();
      activeObstacles = activeObstacles.filter((o) => o !== obstacle);
      score++;
      scoreEl.textContent = score;
      return;
    }

    requestAnimationFrame(moveObstacle);
  };

  requestAnimationFrame(moveObstacle);

  // Наступна перешкода
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

// Перша перешкода
createObstacle();

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});
