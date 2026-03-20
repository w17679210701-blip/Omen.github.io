// 视频列表配置
const myVideos = [
    'videos/jayvideo1.MP4',
    'videos/jayvideo2.MP4',
    'videos/jayvideo3.MP4'
];

let videoIndex = 0;
let isVideoFlipping = false;

function switchVideo(card) {
    if (isVideoFlipping) return;
    isVideoFlipping = true;
    const isCurrentlyFlipped = card.classList.toggle('is-flipped');
    videoIndex = (videoIndex + 1) % myVideos.length;
    const nextSrc = myVideos[videoIndex];
    const nextVideoElement = isCurrentlyFlipped ? document.getElementById('video-b') : document.getElementById('video-a');
    if (nextVideoElement) {
        nextVideoElement.src = nextSrc;
        nextVideoElement.load();
        nextVideoElement.play();
    }
    setTimeout(() => { isVideoFlipping = false; }, 800);
}

function flipAllCards() {
    const allCards = document.querySelectorAll('.bento-item');
    allCards.forEach(card => { card.classList.toggle('is-flipped'); });
}

const START_COUNT = 415113;
const START_TIME = new Date('2026-03-20T10:00:00').getTime();
const RATE_PER_SECOND = 2;
const salesEl = document.getElementById('sales-count');

function syncSales() {
    const now = new Date().getTime();
    const secondsPassed = Math.floor((now - START_TIME) / 1000);
    let currentTotal = START_COUNT;
    if (secondsPassed > 0) { currentTotal += secondsPassed * RATE_PER_SECOND; }
    const jitter = Math.floor(Math.random() * 3) + 3;
    if (salesEl) salesEl.innerText = (currentTotal + jitter).toLocaleString();
}

if (salesEl) {
    setInterval(syncSales, 2000);
    syncSales();
}

window.addEventListener('load', () => {
    const particleBox = document.getElementById('particle-box');
    const particleCount = 60;
    if (particleBox) {
        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'custom-particle';
            const size = Math.random() * 3 + 1;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = '50%';
            p.style.top = '50%';
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 300 + 200;
            const tx = Math.cos(angle) * dist + 'px';
            const ty = Math.sin(angle) * dist + 'px';
            p.style.setProperty('--tx', tx);
            p.style.setProperty('--ty', ty);
            const duration = Math.random() * 8 + 4;
            const delay = Math.random() * -15;
            p.style.animation = `particleRun ${duration}s linear infinite ${delay}s`;
            particleBox.appendChild(p);
        }
    }
    const loader = document.getElementById('loader-wrapper');
    const container = document.querySelector('.container');
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            if (container) container.classList.add('show');
            setTimeout(() => { loader.style.display = 'none'; }, 1500);
        }
    }, 4000); 
});

if (window.lucide) {
    window.lucide.createIcons();
}

document.querySelector('.link-card .card-anchor').addEventListener('click', function(e) {
    e.preventDefault();
    const targetUrl = this.href;
    const card = this.closest('.link-card');
    const x = e.clientX;
    const y = e.clientY;

    let overlay = document.querySelector('.portal-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'portal-overlay';
        document.body.appendChild(overlay);
    }

    overlay.style.setProperty('--x', x + 'px');
    overlay.style.setProperty('--y', y + 'px');
    
    // 1. 卡片坍缩（蓄力）
    card.classList.add('card-implode');

    // 2. 稍微缩短等待时间，让蒙版更早出发
    setTimeout(() => {
        document.body.classList.add('portal-active');
        
        // 3. 【核心优化】在蒙版扩散到一半（约 400ms）时，就开始让浏览器拉取新页面
        // 这时候用户视觉上还在看“扩散动画”，其实后台已经在 load 了
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 400); 

    }, 250);

    // 注意：这里不需要再写移除 overlay 的代码
    // 让它一直全黑挡着，直到跳转成功。
});