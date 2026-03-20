// 视频列表配置
const myVideos = [
    'videos/jayvideo1.MP4',
    'videos/jayvideo2.MP4',
    'videos/jayvideo3.MP4'
];

let videoIndex = 0;
let isVideoFlipping = false;

// --- 逻辑 A: 视频卡片独立循环切换 ---
function switchVideo(card) {
    if (isVideoFlipping) return;
    isVideoFlipping = true;

    const isCurrentlyFlipped = card.classList.toggle('is-flipped');
    videoIndex = (videoIndex + 1) % myVideos.length;
    const nextSrc = myVideos[videoIndex];

    const nextVideoElement = isCurrentlyFlipped ? 
        document.getElementById('video-b') : 
        document.getElementById('video-a');

    if (nextVideoElement) {
        nextVideoElement.src = nextSrc;
        nextVideoElement.load();
        nextVideoElement.play();
    }

    setTimeout(() => {
        isVideoFlipping = false;
    }, 800);
}

// --- 逻辑 B: 点击第一个卡片触发全场翻转 ---
function flipAllCards() {
    // 找到页面上所有的 bento-item
    const allCards = document.querySelectorAll('.bento-item');
    
    allCards.forEach(card => {
        // 如果是视频卡片，我们只翻转它，不触发视频源切换逻辑
        // 如果你想让视频也跟着转，就保留下面这一行
        card.classList.toggle('is-flipped');
    });
}

// --- 销量数字逻辑：2秒加3~5个 ---
let count = 414439; // 这里填你当前的起始数字
const salesEl = document.getElementById('sales-count');

if (salesEl) {
    // 初始显示一次
    salesEl.innerText = count.toLocaleString();

    setInterval(() => {
        // 核心逻辑：生成 3 到 5 之间的随机整数
        // Math.random() * 3 得到 0~2.99，加 3 得到 3~5.99，floor 掉小数就是 3, 4, 5
        const increment = Math.floor(Math.random() * 3) + 3;
        
        count += increment;
        
        // 更新显示并加个千分位逗号，显高级
        salesEl.innerText = count.toLocaleString();
        
        // 调试用（可选）：控制台看下加了多少
        // console.log('当前增加:', increment, '总计:', count);
        
    }, 2000); // 👈 严格 2000 毫秒（2秒）触发一次
}

// 初始化 Lucide 图标（确保图标渲染）
if (window.lucide) {
    window.lucide.createIcons();
}