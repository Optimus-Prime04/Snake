const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

const scoreText = document.getElementById("score");

const box = 20;
const appleSize = 24;
const rows = canvas.width / box;
const appleImg = new Image();
appleImg.src = "assets/apple.png";

let snake;
let food;
let direction;
let score;
let gameOver = false;

let animationId;
let lastMoveTime = 0;
const moveInterval = 120;
const snakeSound = new Audio("assets/snake-hiss.mp3");
snakeSound.loop = true;
snakeSound.volume = 0.2;

function init() {

    snake = [
        { x: 10, y: 10 }
    ];

    direction = "RIGHT";

    score = 0;
    scoreText.textContent = score;

    gameOver = false;

    spawnFood();

    lastMoveTime = 0;

    snakeSound.currentTime = 0;
    snakeSound.play().catch(() => {});

    if (animationId)
        cancelAnimationFrame(animationId);

    animationId = requestAnimationFrame(gameLoop);
}

function spawnFood() {

    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * rows)
    };

    while (
        snake.some(part => part.x === food.x && part.y === food.y)
    ) {

        food = {
            x: Math.floor(Math.random() * rows),
            y: Math.floor(Math.random() * rows)
        };

    }

}

document.addEventListener("keydown", changeDirection);

function changeDirection(e) {

    snakeSound.play().catch(() => {});

    if (e.code === "ArrowUp" && direction !== "DOWN")
        direction = "UP";

    else if (e.code === "ArrowDown" && direction !== "UP")
        direction = "DOWN";

    else if (e.code === "ArrowLeft" && direction !== "RIGHT")
        direction = "LEFT";

    else if (e.code === "ArrowRight" && direction !== "LEFT")
        direction = "RIGHT";

    else if (e.code === "Space" && gameOver) {
        init();
    }
}

function gameLoop(timestamp) {

    if (gameOver) return;

    if (!lastMoveTime)
        lastMoveTime = timestamp;

    if (timestamp - lastMoveTime >= moveInterval) {

        update();

        lastMoveTime = timestamp;

    }

    if (!gameOver) {
        draw();
        animationId = requestAnimationFrame(gameLoop);
    }

}
function update() {

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "UP") headY--;
    if (direction === "DOWN") headY++;
    if (direction === "LEFT") headX--;
    if (direction === "RIGHT") headX++;
    if (
        headX < 0 ||
        headY < 0 ||
        headX >= rows ||
        headY >= rows
    ) {
        gameOverScreen();
        return;
    }

    for (let i = 0; i < snake.length; i++) {

        if (
            headX === snake[i].x &&
            headY === snake[i].y
        ) {

            gameOverScreen();
            return;

        }

    }

    const head = {
        x: headX,
        y: headY
    };

    if (
        headX === food.x &&
        headY === food.y
    ) {

        score++;
        scoreText.textContent = score;

        spawnFood();

    } else {

        snake.pop();

    }

    snake.unshift(head);

}

function draw() {
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        appleImg,
    food.x * box - (appleSize - box) / 2,
    food.y * box - (appleSize - box) / 2,
    appleSize,
    appleSize
);

    snake.forEach((segment, index) => {

        ctx.fillStyle = index === 0 ? "#e60606" : "#a80303";

        ctx.fillRect(
            segment.x * box,
            segment.y * box,
            box,
            box
        );

        ctx.strokeStyle = "#111";

        ctx.strokeRect(
            segment.x * box,
            segment.y * box,
            box,
            box
        );

    });

}

function gameOverScreen() {

    if (gameOver) return;

    gameOver = true;

    snakeSound.pause();
    snakeSound.currentTime = 0;

    
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
    ctx.fillStyle = "#ff3b30";
    ctx.font = "bold 42px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

    
    ctx.fillStyle = "#ffffff";
    ctx.font = "22px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 20);

   
    ctx.font = "18px Arial";
    ctx.fillStyle = "#ef0b0b";
    ctx.fillText("Press SPACE to Restart", canvas.width / 2, canvas.height / 2 + 60);

    cancelAnimationFrame(animationId);
}

appleImg.onload = () => {
    init();
};

appleImg.onerror = () => {
    console.warn("Could not load assets/apple.png");
    init();
};