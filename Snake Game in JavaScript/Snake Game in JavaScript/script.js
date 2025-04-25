const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let isPaused = false; // New variable to track pause state
let foodX, foodY;
let specialFoodX, specialFoodY; // Special food position
let specialFoodTimer; // Timer for special food
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

const updateSpecialFoodPosition = () => {
    // Generate random position for special food
    specialFoodX = Math.floor(Math.random() * 30) + 1;
    specialFoodY = Math.floor(Math.random() * 30) + 1;

    // Remove the special food after 7 seconds if not eaten
    clearTimeout(specialFoodTimer);
    specialFoodTimer = setTimeout(() => {
        specialFoodX = specialFoodY = null; // Remove the special food
    }, 7000); // 7 seconds
};

const handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
};

const changeDirection = e => {
    // Changing velocity value based on key press
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

const togglePause = () => {
    isPaused = !isPaused; // Toggle the pause state
    if (isPaused) {
        clearInterval(setIntervalId); // Stop the game loop
    } else {
        setIntervalId = setInterval(initGame, 100); // Resume the game loop
    }
};

const restartGame = () => {
    // Reset all game variables
    gameOver = false;
    isPaused = false;
    snakeX = 5;
    snakeY = 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    scoreElement.innerText = `Score: ${score}`;
    updateFoodPosition();
    clearInterval(setIntervalId);
    setIntervalId = setInterval(initGame, 100); // Restart the game loop
};

const initGame = () => {
    if (gameOver) return handleGameOver();
    if (isPaused) return; // Stop updating the game if paused

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Add special food to the board if it exists
    if (specialFoodX && specialFoodY) {
        html += `<div class="special-food" style="grid-area: ${specialFoodY} / ${specialFoodX}"></div>`;
    }

    // Checking if the snake hit the regular food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
        score++; // Increment score by 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Checking if the snake hit the special food
    if (snakeX === specialFoodX && snakeY === specialFoodY) {
        specialFoodX = specialFoodY = null; // Remove the special food
        snakeBody.push([snakeY, snakeX]); // Add to snake body
        score += 5; // Increment score by 5
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
};

// Generate a new special food every 15 seconds
setInterval(updateSpecialFoodPosition, 15000);

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);

// Adding event listeners for pause and restart
document.addEventListener("keyup", (e) => {
    if (e.key === " " || e.code === "Space") togglePause(); // Pause/Resume the game with spacebar
    if (e.key === "r" || e.key === "R") restartGame(); // Restart the game
});
document.addEventListener("keyup", changeDirection);  