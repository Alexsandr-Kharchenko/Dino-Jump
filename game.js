const pacman = document.getElementById("pacman");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");

let isJumping = false;
let score = 0;
let pacmanPosition = 0; // власна змінна для позиції Pacman

// Початкове значення bottom
pacman.style.bottom = pacmanPosition + "px";

// Стрибок Pacman
function jump() {
  if (isJumping) return;
  isJumping = true;

  const maxHeight = 200; // висота стрибка
  const upSpeed = 15;
  const downSpeed = 12; // швидше падіння робить гру складнішою

  // Підйом
  const upInterval = setInterval(() => {
    if (pacmanPosition >= maxHeight) {
      clearInterval(upInterval);

      // Падіння
      const downInterval = setInterval(() => {
        pacmanPosition -= downSpeed;
        if (pacmanPosition <= 0) {
          pacmanPosition = 0;
          pacman.style.bottom = pacmanPosition + "px";
          clearInterval(downInterval);
          isJumping = false;
        } else {
          pacman.style.bottom = pacmanPosition + "px";
        }
      }, 20);
    } else {
      pacmanPosition += upSpeed;
      pacman.style.bottom = pacmanPosition + "px";
    }
  }, 20);
}

// Створення перешкод
function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  game.appendChild(obstacle);

  let obstaclePosition = game.offsetWidth;

  const timerId = setInterval(() => {
    // Швидкість перешкоди з ростом рахунку
    let speed = 5 + score * 0.3; // початкова швидкість більша
    if (speed > 12) speed = 12; // максимум швидкості

    obstaclePosition -= speed;
    obstacle.style.left = obstaclePosition + "px";

    // Зіткнення
    if (
      obstaclePosition > 60 &&
      obstaclePosition < 110 &&
      pacmanPosition < 50
    ) {
      alert(`Game Over! 🟡 Рахунок: ${score}`);
      clearInterval(timerId);
      obstacle.remove();
      score = 0;
      scoreEl.textContent = score;
      pacmanPosition = 0;
      pacman.style.bottom = pacmanPosition + "px";
      return;
    }

    // Якщо перешкода вийшла за екран
    if (obstaclePosition < -50) {
      clearInterval(timerId);
      obstacle.remove();
      score++;
      scoreEl.textContent = score;
    }
  }, 20);

  // Наступна перешкода через менший проміжок для складнішої гри
  const minTime = 1000;
  const maxTime = 2500;
  setTimeout(createObstacle, Math.random() * (maxTime - minTime) + minTime);
}

// Створюємо першу перешкоду
createObstacle();

// Стрибок по пробілу
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});
