const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const finishMessage = document.getElementById('finish-message');

let progress = 0;

// 每次点击增加的进度
const clickIncrement = 1; 
// 进度条自动减少的速度（模拟上班的压力）
const decayRate = 0.5; 

function updateProgress() {
    // 更新进度条宽度和文本
    progressBar.style.width = progress + '%';
    // 将 .progress-text 移动到 .progress-bar 内部，使其文本始终可见
    // 这里我们通过 CSS 已经处理了文本居中，JS 只需要更新内容
    progressText.textContent = Math.floor(progress) + '%';

    if (progress >= 100) {
        progress = 100;
        progressBar.style.width = '100%';
        progressText.textContent = '100%';
        finishMessage.style.display = 'block';
        // 停止自动减少
        clearInterval(decayInterval);
    }
}

// 监听整个页面的点击事件
document.addEventListener('click', () => {
    if (progress < 100) {
        progress += clickIncrement;
        updateProgress();
    }
});

// 进度条会自动缓慢减少，模拟时间的流逝
const decayInterval = setInterval(() => {
    if (progress > 0) {
        progress -= decayRate;
        if (progress < 0) progress = 0;
        updateProgress();
    }
}, 200); // 每 200 毫秒减少一次