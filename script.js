// 测试JavaScript是否正常加载
console.log('script.js 已加载');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 已加载完成');
    // 页面加载时，尝试从 localStorage 加载之前设置的日期
    loadResignationDate();
    // 加载一条初始段子
    getNewJoke();
    // 加载一条初始语录并设置定时更新
    updateMotto();
    setInterval(updateMotto, 8000); // 8秒换一句
});

// --- 离职倒计时功能 ---
function setResignationDate() {
    const dateInput = document.getElementById('resignation-date');
    const dateValue = dateInput.value;
    if (dateValue) {
        localStorage.setItem('resignationDate', dateValue);
        updateCountdown(dateValue);
    }
}

function loadResignationDate() {
    const savedDate = localStorage.getItem('resignationDate');
    if (savedDate) {
        document.getElementById('resignation-date').value = savedDate;
        updateCountdown(savedDate);
        // 每秒更新一次倒计时，确保精确
        setInterval(function() {
            updateCountdown(savedDate);
        }, 1000);
    }
}

function updateCountdown(date) {
    const countdownTimer = document.getElementById('countdown-timer');
    const daysText = document.querySelector('.days-text');
    const targetDate = new Date(date);
    const now = new Date();
    
    // 将时间设置为当天的开始，避免时分秒影响
    targetDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const diffTime = targetDate - now;
    
    if (diffTime < 0) {
        countdownTimer.textContent = "恭喜解放！";
        daysText.style.display = 'none'; // 解放了就不需要"天"了
        return;
    }
    
    daysText.style.display = 'inline'; // 确保"天"是可见的
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    countdownTimer.textContent = diffDays; // 只更新数字，避免重复
}

// --- 每日段子功能 ---
const jokes = [
    "老板说：我请你来是解决问题的，不是让你制造问题。我说：我就是那个被解决的问题。",
    "只要我没离职，我老板就永远不能过上他想要的生活。",
    "工作时，我唯唯诺诺；摸鱼时，我重拳出击。",
    "老板画的饼，我一般都打包回家喂狗，狗都摇摇头不吃。",
    "每天叫醒我的不是梦想，是'再不起来就要迟到了'的恐惧。",
    "只要我干活的速度足够慢，寂寞就追不上我。",
    "别跟我谈理想，我的理想是不上班。",
    "上班的心情比上坟还沉重。",
    "今天的 KPI：Keep Peace Inside，保持内心和平。",
    "加班是工位的延长线，但不是人生的主旋律。",
    "摸鱼不是不努力，是给大脑做深度散步。",
    "会议纪要三步走：有人说、我记录、都算数。",
    "工作有难度，生活要有温度。",
    "老板的愿景无边无际，我的下班有始有终。",
    "效率是把事做完，加班是把时间坐满。",
    "今天的 OKR：O——OK 下班；K——开心回家；R——认真生活。",
    "进度卡住了？先把水杯灌满，人也会慢慢满格。",
    "被安排很满没关系，我把心情安排得空一点。",
    "我不是提前下班，我是准点热爱生活。",
    "别和时间赛跑，公交还有下一班。",
    "做不完的明天做，做得完的现在收工。",
    "工作就像浏览器标签页——开太多会卡。",
    "今天的最优解：少开会，多产出，准时走。",
    "与其加班凑满，不如产出说话。",
    "别卷时间，卷质量。",
    "不会拒绝加班？先学会接受下班。",
    "我不是摸鱼，我是给灵感投喂。",
    "同事都还在？那我先去打样一下下班的样子。",
    "不是工作需要我，是人民币需要我。",
    "生活里80%的痛苦来源于打工，但100%的快乐来源于不打工。",
    "累吗？累就对了，舒服是留给有钱人的。",
    "打工不仅能致富，还能交友，更能让你认识到自己的不足。",
    "今日搬砖不狠，明日地位不稳。",
    "只要思想不滑坡，办法总比困难多。",
    "你先富，我后富，咱俩组成二百五。",
    "上班是检测身体状况的唯一标准。"
];

function getNewJoke() {
    const jokeText = document.getElementById('joke-text');
    if (jokeText) {
        const randomIndex = Math.floor(Math.random() * jokes.length);
        jokeText.textContent = jokes[randomIndex];
    }
}

// --- 老板模式功能 ---
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        toggleBossMode();
    }
});

function toggleBossMode() {
    const mainContent = document.getElementById('main-content');
    const bossModeContent = document.getElementById('boss-mode-content');
    
    const isBossMode = mainContent.style.display === 'none';
    if (!isBossMode) {
        // 切换到伪装模式
        mainContent.style.display = 'none';
        bossModeContent.style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.body.style.padding = '0';
        
        // 生成随机代码内容
        generateFakeCode();
        
        // 设置文件树随机选中效果
        setRandomActiveFile();
        
        // 添加打字效果
        startTypingEffect();
    } else {
        // 切换回正常模式
        mainContent.style.display = 'block';
        bossModeContent.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.body.style.padding = '20px';
        
        // 清除打字效果的定时器
        if (window.typingTimer) {
            clearInterval(window.typingTimer);
        }
    }
}

// 生成伪代码内容
function generateFakeCode() {
    const codeEditor = document.getElementById('code-editor');
    if (!codeEditor) return;
    
    let fakeCode = '';
    
    fakeCode += '// 导入必要的依赖\n';
    fakeCode += 'import React, { useState, useEffect } from \'react\';\n';
    fakeCode += 'import { fetchData } from \'../api/dataService\';\n';
    fakeCode += 'import { formatResponse } from \'../utils/formatter\';\n';
    fakeCode += 'import Logger from \'../utils/logger\';\n\n';
    
    fakeCode += '// 配置常量\n';
    fakeCode += 'const API_ENDPOINT = process.env.API_URL || \'https://api.example.com/v1\';\n';
    fakeCode += 'const MAX_RETRY_COUNT = 3;\n';
    fakeCode += 'const TIMEOUT_MS = 5000;\n\n';
    
    fakeCode += '// 类型定义\n';
    fakeCode += 'interface DataResponse {\n';
    fakeCode += '  id: string;\n';
    fakeCode += '  name: string;\n';
    fakeCode += '  status: \'active\' | \'inactive\';\n';
    fakeCode += '  timestamp: number;\n';
    fakeCode += '  metadata?: Record<string, any>;\n';
    fakeCode += '}\n\n';
    
    fakeCode += 'export const DataProcessor: React.FC = () => {\n';
    fakeCode += '  const [data, setData] = useState<DataResponse[]>([]);\n';
    fakeCode += '  const [loading, setLoading] = useState<boolean>(false);\n';
    fakeCode += '  const [error, setError] = useState<Error | null>(null);\n\n';
    
    fakeCode += '  useEffect(() => {\n';
    fakeCode += '    const fetchDataFromApi = async () => {\n';
    fakeCode += '      setLoading(true);\n';
    fakeCode += '      try {\n';
    fakeCode += '        const response = await fetchData(API_ENDPOINT);\n';
    fakeCode += '        const formattedData = formatResponse(response);\n';
    fakeCode += '        setData(formattedData);\n';
    fakeCode += '        Logger.info(\'数据获取成功\', { count: formattedData.length });\n';
    fakeCode += '      } catch (err) {\n';
    fakeCode += '        setError(err as Error);\n';
    fakeCode += '        Logger.error(\'数据获取失败\', err);\n';
    fakeCode += '      } finally {\n';
    fakeCode += '        setLoading(false);\n';
    fakeCode += '      }\n';
    fakeCode += '    };\n\n';
    
    fakeCode += '    fetchDataFromApi();\n';
    fakeCode += '  }, []);\n\n';
    
    fakeCode += '  return (\n';
    fakeCode += '    <div className="data-processor">\n';
    fakeCode += '      <h2>数据处理器</h2>\n';
    fakeCode += '      <button onClick={() => fetchDataFromApi()} disabled={loading}>\n';
    fakeCode += '        {loading ? \'加载中...\' : \'刷新数据\'}\n';
    fakeCode += '      </button>\n';
    fakeCode += '    </div>\n';
    fakeCode += '  );\n';
    fakeCode += '};\n';
    
    codeEditor.innerHTML = fakeCode;
    highlightSyntax();
}

function highlightSyntax() {
    const codeEditor = document.getElementById('code-editor');
    if (!codeEditor) return;
    
    let html = codeEditor.innerHTML;
    
    html = html.replace(/(\/\/.*)/g, '<span class="comment">$1</span>');
    html = html.replace(/(\/\*\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>');
    
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'try', 'catch', 'async', 'await', 'interface', 'typeof', 'from'];
    keywords.forEach(function(keyword) {
        const regex = new RegExp('\\b(' + keyword + ')\\b', 'g');
        html = html.replace(regex, '<span class="keyword">$1</span>');
    });
    
    html = html.replace(/('.*?')/g, '<span class="string">$1</span>');
    html = html.replace(/(".*?")/g, '<span class="string">$1</span>');
    html = html.replace(/(`.*?`)/g, '<span class="string">$1</span>');
    
    const types = ['string', 'number', 'boolean', 'object', 'array', 'Promise', 'void', 'any', 'React.FC'];
    types.forEach(function(type) {
        const regex = new RegExp('\\b(' + type + ')\\b', 'g');
        html = html.replace(regex, '<span class="type">$1</span>');
    });
    
    codeEditor.innerHTML = html;
}

function setRandomActiveFile() {
    const fileItems = document.querySelectorAll('.file-item');
    if (fileItems.length === 0) return;
    
    fileItems.forEach(function(item) {
        item.classList.remove('active');
    });
    
    const randomIndex = Math.floor(Math.random() * fileItems.length);
    fileItems[randomIndex].classList.add('active');
}

function startTypingEffect() {
    const cursor = document.getElementById('typing-cursor');
    if (!cursor) return;
    
    cursor.style.display = 'inline-block';
    
    let isDeleting = false;
    let charCount = 0;
    const maxChars = 15;
    
    window.typingTimer = setInterval(function() {
        if (!isDeleting) {
            if (charCount < maxChars) {
                charCount++;
            } else {
                isDeleting = true;
                setTimeout(function() {}, 1000);
            }
        } else {
            if (charCount > 0) {
                charCount--;
            } else {
                isDeleting = false;
            }
        }
    }, 150);
}

// --- 打开/关闭内嵌游戏 ---
function openGame(url) {
    const gameDisplaySection = document.getElementById('game-display-section');
    const gameIframe = document.getElementById('game-iframe');
    
    if (gameDisplaySection && gameIframe) {
        gameIframe.src = url;
        gameDisplaySection.style.display = 'flex';
    }
}

function closeGame() {
    const gameDisplaySection = document.getElementById('game-display-section');
    const gameIframe = document.getElementById('game-iframe');
    
    if (gameDisplaySection && gameIframe) {
        gameIframe.src = '';
        gameDisplaySection.style.display = 'none';
    }
}

// --- 设置面板开关 ---
function toggleSettings() {
    const settingsPanel = document.getElementById('settings-panel');
    if (settingsPanel) {
        settingsPanel.classList.toggle('visible');
    }
}

// --- 打工人语录 ---
const mottos = [
    "不是工作需要我，是人民币需要我。",
    "生活里80%的痛苦来源于打工，但100%的快乐来源于不打工。",
    "累吗？累就对了，舒服是留给有钱人的。",
    "打工不仅能致富，还能交友，更能让你认识到自己的不足。",
    "今日搬砖不狠，明日地位不稳。",
    "只要思想不滑坡，办法总比困难多。",
    "你先富，我后富，咱俩组成二百五。",
    "上班是检测身体状况的唯一标准。"
];

// --- 磁场转换功能 ---
const fortunes = [
    "今日磁场已优化：水逆退散，诸事皆宜！",
    "好运已充值：老板看不见你，Bug自动消失。",
    "厄运已清除：今日无Pua，开会不点名。",
    "磁场强化成功：需求不再改，一版过！",
    "正能量注入：摸鱼也能摸出新高度。",
    "今日运势上上签：宜摸鱼，忌加班。",
    "灵感磁场已激活：代码一次写对，无需调试。",
    "财运磁场增强：下午茶有人请，下班红包抢最大。"
];

function changeFortune() {
    const fortuneText = document.getElementById('fortune-text');
    const fortuneBtn = document.getElementById('fortune-btn');
    const fortuneDisplay = document.getElementById('fortune-display');

    if (!fortuneText || !fortuneBtn || !fortuneDisplay) return;

    // 禁用按钮防止重复点击
    fortuneBtn.disabled = true;
    fortuneBtn.textContent = '转换中...';

    // 显示加载动画和提示
    fortuneDisplay.innerHTML = '<span class="spinning">☯</span>';
    
    setTimeout(() => {
        // 随机选择一条好运签
        const randomIndex = Math.floor(Math.random() * fortunes.length);
        const newFortune = fortunes[randomIndex];
        
        // 更新文本
        fortuneDisplay.innerHTML = `<p id="fortune-text">${newFortune}</p>`;

        // 恢复按钮
        fortuneBtn.disabled = false;
        fortuneBtn.textContent = '再次转换';
    }, 2000); // 2秒后显示结果
}


function updateMotto() {
    const mottoText = document.getElementById('motto-text');
    if (mottoText) {
        const randomIndex = Math.floor(Math.random() * mottos.length);
        mottoText.style.opacity = 0;
        setTimeout(function() {
            mottoText.textContent = mottos[randomIndex];
            mottoText.style.opacity = 1;
        }, 500);
    }
}

// --- 生成海报 ---
function generatePoster() {
    const mainContent = document.getElementById('main-content');
    const gameDisplaySection = document.getElementById('game-display-section');
    const settingsToggle = document.getElementById('settings-toggle');

    if (!mainContent || !gameDisplaySection || !settingsToggle) {
        alert("页面核心元素未找到，无法生成海报");
        return;
    }

    const originalGameDisplay = gameDisplaySection.style.display;
    const originalSettingsVisibility = settingsToggle.style.visibility;
    const originalBodyBackground = document.body.style.background;
    const originalBodyAnimation = document.body.style.animation;
    
    settingsToggle.style.visibility = 'hidden';
    gameDisplaySection.style.display = 'none';
    mainContent.classList.add('poster-mode');
    
    document.body.style.background = '#1a1a1a';
    document.body.style.backgroundImage = 'none';
    document.body.style.animation = 'none';
    document.body.style.backgroundSize = 'auto';
    document.body.style.backgroundPosition = '0% 50%';

    const cleanup = function() {
        settingsToggle.style.visibility = originalSettingsVisibility;
        gameDisplaySection.style.display = originalGameDisplay;
        mainContent.classList.remove('poster-mode');
        document.body.style.background = originalBodyBackground;
        document.body.style.animation = originalBodyAnimation;
        document.body.style.backgroundImage = '';
        document.body.style.backgroundSize = '';
        document.body.style.backgroundPosition = '';
    };

    setTimeout(function() {
        if (typeof html2canvas !== 'undefined') {
            html2canvas(mainContent, {
                backgroundColor: '#1a1a1a',
                useCORS: true,
                allowTaint: false,
                scale: 1.5,
                logging: false,
                width: mainContent.offsetWidth,
                height: mainContent.offsetHeight,
                ignoreElements: function(element) {
                    return element.classList.contains('settings-panel') || 
                           element.id === 'settings-toggle';
                },
                onclone: function(clonedDoc) {
                    const clonedBody = clonedDoc.body;
                    clonedBody.style.background = '#1a1a1a';
                    clonedBody.style.backgroundImage = 'none';
                    clonedBody.style.animation = 'none';
                    
                    const style = clonedDoc.createElement('style');
                    style.textContent = '*, *::before, *::after { animation-duration: 0s !important; animation-delay: 0s !important; transition-duration: 0s !important; transition-delay: 0s !important; } body { background: #1a1a1a !important; background-image: none !important; animation: none !important; }';
                    clonedDoc.head.appendChild(style);
                    
                    const allElements = clonedDoc.querySelectorAll('*');
                    allElements.forEach(function(el) {
                        if (el.style.opacity && parseFloat(el.style.opacity) < 1) {
                            el.style.opacity = '1';
                        }
                    });
                }
            }).then(function(canvas) {
                cleanup();
                const link = document.createElement('a');
                link.download = '续命海报.png';
                link.href = canvas.toDataURL('image/png', 0.95);
                link.click();
            }).catch(function(err) {
                cleanup();
                console.error("生成海报失败:", err);
                alert("抱歉，生成海报失败。请确保使用最新版本的Chrome或Firefox浏览器。");
            });
        } else {
            cleanup();
            alert("html2canvas库未加载，无法生成海报");
        }
    }, 300);
}
