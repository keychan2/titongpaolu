const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

let score = 0;
let lives = 3;
let playerPosition = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
let gameInterval = null;
let isGameOver = false;

function updatePlayerPosition() {
    player.style.left = playerPosition + 'px';
}

function movePlayer(event) {
    if (isGameOver) return;
    const gameAreaRect = gameArea.getBoundingClientRect();
    if (event.key === 'ArrowLeft') {
        playerPosition -= 20;
    } else if (event.key === 'ArrowRight') {
        playerPosition += 20;
    }

    // 边界检测
    if (playerPosition < 0) {
        playerPosition = 0;
    }
    if (playerPosition > gameAreaRect.width - player.offsetWidth) {
        playerPosition = gameAreaRect.width - player.offsetWidth;
    }
    updatePlayerPosition();
}

function createItem() {
    if (isGameOver) return;

    const item = document.createElement('div');
    item.classList.add('item');
    const isBomb = Math.random() < 0.25; // 25% 的概率是炸弹
    item.classList.add(isBomb ? 'bomb' : 'coin');

    const gameAreaRect = gameArea.getBoundingClientRect();
    item.style.left = Math.random() * (gameAreaRect.width - 30) + 'px';
    item.style.top = '-30px';

    gameArea.appendChild(item);

    let itemPosition = -30;
    const fallSpeed = Math.random() * 3 + 2; // 随机下落速度

    const fallInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(fallInterval);
            if(item.parentNode) gameArea.removeChild(item);
            return;
        }
        itemPosition += fallSpeed;
        item.style.top = itemPosition + 'px';

        // 碰撞检测
        const playerRect = player.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        if (
            itemRect.bottom > playerRect.top &&
            itemRect.top < playerRect.bottom &&
            itemRect.right > playerRect.left &&
            itemRect.left < playerRect.right
        ) {
            if (isBomb) {
                lives--;
                livesDisplay.textContent = lives;
                if (lives <= 0) {
                    endGame();
                }
            } else {
                score += 10;
                scoreDisplay.textContent = score;
            }
            if(item.parentNode) gameArea.removeChild(item);
            clearInterval(fallInterval);
        }

        // 掉出屏幕
        if (itemPosition > gameAreaRect.height) {
            if(item.parentNode) gameArea.removeChild(item);
            clearInterval(fallInterval);
        }
    }, 20);
}

function startGame() {
    score = 0;
    lives = 3;
    isGameOver = false;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    gameOverScreen.style.display = 'none';
    playerPosition = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
    updatePlayerPosition();

    // 清理上一局留下的物品
    const existingItems = document.querySelectorAll('.item');
    existingItems.forEach(item => item.remove());

    gameInterval = setInterval(createItem, 1000); // 每秒生成一个新物品
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = 'block';
}

document.addEventListener('keydown', movePlayer);
restartButton.addEventListener('click', startGame);

// 初始启动游戏
startGame();