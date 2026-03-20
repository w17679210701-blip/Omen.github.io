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

// --- 逻辑 C: 销量数字更新 ---
let count = 823255;
const salesEl = document.getElementById('sales-count');
if (salesEl) {
    setInterval(() => {
        count += Math.floor(Math.random() * 5);
        salesEl.innerText = count.toLocaleString();
    }, 2500);
}

// 初始化 Lucide 图标（确保图标渲染）
if (window.lucide) {
    window.lucide.createIcons();
}