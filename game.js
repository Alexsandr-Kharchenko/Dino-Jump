const dino = document.getElementById("dino");
const game = document.getElementById("game");
const scoreEl = document.getElementById("score");

let isJumping = false;
let score = 0;

function jump() {
  if (isJumping) return;
  isJumping = true;
  let position = 0;

  const upInterval = setInterval(() => {
    if (position >= 100) {
      clearInterval(upInterval);

      const downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        }
        position -= 5;
        dino.style.bottom = position + "px";
      }, 20);
    }
    position += 5;
    dino.style.bottom = position + "px";
  }, 20);
}

function createObstacle() {
  const obstacle = document.createElement("img");
  obstacle.src = "assets/cactus.png";
  obstacle.classList.add("obstacle");
  game.appendChild(obstacle);

  let obstaclePosition = 600;
  obstacle.style.right = obstaclePosition + "px";

  const timerId = setInterval(() => {
    if (obstaclePosition < -25) {
      clearInterval(timerId);
      obstacle.remove();
      score++;
      scoreEl.textContent = score;
    }

    // перевірка колізії
    if (
      obstaclePosition > 50 &&
      obstaclePosition < 100 &&
      parseInt(dino.style.bottom) < 50
    ) {
      alert(`Game Over! 🦖 Рахунок: ${score}`);
      clearInterval(timerId);
      obstacle.remove();
      score = 0;
      scoreEl.textContent = score;
      return;
    }

    obstaclePosition -= 5;
    obstacle.style.right = obstaclePosition + "px";
  }, 20);

  setTimeout(createObstacle, Math.random() * 3000 + 1500);
}

createObstacle();
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});
