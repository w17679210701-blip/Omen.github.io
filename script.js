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

// --- 销量逻辑：全球时间同步版 ---
const START_COUNT = 415113; // 初始销量
const START_TIME = new Date('2026-03-20T10:00:00').getTime(); // 设置一个开售时间（必须是过去的时间）
const RATE_PER_SECOND = 2; // 平均每秒涨2个 (即2秒4个)

const salesEl = document.getElementById('sales-count');

function syncSales() {
    const now = new Date().getTime();
    const secondsPassed = Math.floor((now - START_TIME) / 1000);
    
    // 如果还没到开售时间，就显示初始值
    let currentTotal = START_COUNT;
    if (secondsPassed > 0) {
        currentTotal += secondsPassed * RATE_PER_SECOND;
    }

    // 为了让它看起来有跳动感，加一个 3~5 的随机微调
    const jitter = Math.floor(Math.random() * 3) + 3;
    salesEl.innerText = (currentTotal + jitter).toLocaleString();
}

if (salesEl) {
    // 2秒刷新一次
    setInterval(syncSales, 2000);
    syncSales(); // 初始化
}

window.addEventListener('load', () => {
    const loader = document.getElementById('loader-wrapper');
    const container = document.querySelector('.container');

    // 1.5秒后开始淡出，给用户留出看Logo的时间
    setTimeout(() => {
        loader.classList.add('fade-out'); // 遮罩淡出
        container.classList.add('show');  // 内容浮现
    }, 1500);
});

// 初始化 Lucide 图标（确保图标渲染）
if (window.lucide) {
    window.lucide.createIcons();
}