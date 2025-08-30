const player = document.getElementById('player');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const moveLeftButton = document.getElementById('move-left');
const moveRightButton = document.getElementById('move-right');
const fakeWorkScreen = document.getElementById('fake-work-screen');

let score = 0;
let lives = 3;
let playerPosition = 0;
let gameInterval = null;
let isGameOver = false;
let isPaused = false;

// --- 移动逻辑 ---
let moveSpeed = 8; // 每帧移动的像素
let isMovingLeft = false;
let isMovingRight = false;
let animationFrameId = null;

function updatePlayerPosition() {
    // 移除初始的 transform 属性，确保定位准确
    player.style.transform = 'translateX(0)';
    player.style.left = playerPosition + 'px';
}

function gameLoop() {
    if (isGameOver) {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    if (!isPaused) {
        if (isMovingLeft) {
            playerPosition -= moveSpeed;
        }
        if (isMovingRight) {
            playerPosition += moveSpeed;
        }

        // 边界检测
        const gameAreaRect = gameArea.getBoundingClientRect();
        if (playerPosition < 0) {
            playerPosition = 0;
        }
        // 计算右边界时需要考虑玩家自身的宽度
        if (playerPosition > gameAreaRect.width - player.offsetWidth) {
            playerPosition = gameAreaRect.width - player.offsetWidth;
        }

        updatePlayerPosition();
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

// --- 移动事件监听 ---

// 键盘事件
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        togglePause();
    }

    if (isPaused) return; // 暂停时禁用移动键

    if (event.key === 'ArrowLeft') {
        isMovingLeft = true;
    } else if (event.key === 'ArrowRight') {
        isMovingRight = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') {
        isMovingLeft = false;
    } else if (event.key === 'ArrowRight') {
        isMovingRight = false;
    }
});

// 按钮的鼠标和触摸事件
function addMovementListeners(button, direction) {
    const startMoving = (e) => {
        if (isPaused) return;
        e.preventDefault(); // 防止文本选中等副作用
        if (direction === 'left') isMovingLeft = true;
        if (direction === 'right') isMovingRight = true;
    };
    const stopMoving = (e) => {
        e.preventDefault();
        if (direction === 'left') isMovingLeft = false;
        if (direction === 'right') isMovingRight = false;
    };

    button.addEventListener('mousedown', startMoving);
    button.addEventListener('touchstart', startMoving, { passive: false });

    button.addEventListener('mouseup', stopMoving);
    button.addEventListener('mouseleave', stopMoving); // 鼠标移出按钮也停止移动
    button.addEventListener('touchend', stopMoving);
}

addMovementListeners(moveLeftButton, 'left');
addMovementListeners(moveRightButton, 'right');

// --- 暂停逻辑 ---
function togglePause() {
    if (isGameOver) return; // 游戏结束时不允许暂停
    isPaused = !isPaused;
    fakeWorkScreen.classList.toggle('visible');

    // 暂停时清除移动状态，防止恢复后继续移动
    if (isPaused) {
        isMovingLeft = false;
        isMovingRight = false;
    }
}


function createItem() {
    if (isGameOver || isPaused) return;

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

        if (isPaused) {
            return; // 如果游戏暂停，则不执行任何操作
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
    isMovingLeft = false;
    isMovingRight = false;
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    gameOverScreen.style.display = 'none';
    
    // 正确地将玩家居中
    playerPosition = gameArea.offsetWidth / 2 - player.offsetWidth / 2;
    updatePlayerPosition();

    // 清理上一局留下的物品
    const existingItems = document.querySelectorAll('.item');
    existingItems.forEach(item => item.remove());

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(createItem, 1000); // 每秒生成一个新物品

    // 启动游戏循环以实现顺滑移动
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animationFrameId = requestAnimationFrame(gameLoop);
}

function endGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    // gameLoop 会在下一帧自动停止
    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = 'block';
}

restartButton.addEventListener('click', startGame);

// 初始启动游戏
startGame();