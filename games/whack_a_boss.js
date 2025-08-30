const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const gameArea = document.getElementById('game-area');
const startButton = document.getElementById('start-button');

let score = 0;
let timeLeft = 30;
let bossInterval = null;
let timerInterval = null;

function startGame() {
    // 重置游戏状态
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    startButton.style.display = 'none'; // 隐藏开始按钮
    gameArea.innerHTML = ''; // 清空游戏区域

    // 开始游戏计时
    timerInterval = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // 开始随机出现老板
    bossInterval = setInterval(spawnBoss, 800); // 每800毫秒出现一个
}

function endGame() {
    clearInterval(timerInterval);
    clearInterval(bossInterval);
    alert(`游戏结束！你的最终得分是: ${score}`);
    startButton.style.display = 'block'; // 显示开始按钮
    gameArea.innerHTML = ''; // 清空游戏区域
}

function spawnBoss() {
    const boss = document.createElement('div');
    boss.classList.add('boss');

    // 随机位置
    const gameAreaRect = gameArea.getBoundingClientRect();
    const x = Math.random() * (gameAreaRect.width - 80);
    const y = Math.random() * (gameAreaRect.height - 80);

    boss.style.left = x + 'px';
    boss.style.top = y + 'px';

    // 点击事件
    boss.addEventListener('mousedown', () => {
        score++;
        scoreDisplay.textContent = score;
        boss.classList.add('hit');
        // 快速移除，避免重复点击
        setTimeout(() => {
            if(boss.parentNode) {
                gameArea.removeChild(boss);
            }
        }, 100);
    });

    gameArea.appendChild(boss);

    // 1.5秒后如果没被点击，自动消失
    setTimeout(() => {
        if (boss.parentNode) {
            gameArea.removeChild(boss);
        }
    }, 1500);
}

startButton.addEventListener('click', startGame);