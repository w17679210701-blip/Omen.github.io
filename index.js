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

// 修改这里：DOMContentLoaded 比 load 快得多！
document.addEventListener('DOMContentLoaded', () => {
    const particleBox = document.getElementById('particle-box');
    const particleCount = 60;

    if (particleBox) {
        // 先清空一次，防止重复生成
        particleBox.innerHTML = '';

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
            // 关键：负延迟 (-15s) 让粒子一出来就是运动中的状态，不需要从 0 开始飞
            const delay = Math.random() * -15;

            p.style.animation = `particleRun ${duration}s linear infinite ${delay}s`;
            particleBox.appendChild(p);
        }
    }

    // 遮罩层消失的逻辑依然可以保留在 load 里，或者就在这里处理
    const loader = document.getElementById('loader-wrapper');
    const container = document.querySelector('.container');

    // 这里的 4000ms 是你预设的强制展示时间，你可以根据需要缩短
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            if (container) container.classList.add('show');
            setTimeout(() => { loader.style.display = 'none'; }, 1500);
        }
    }, 1500); // 稍微缩短一点，体感更快
});

if (window.lucide) {
    window.lucide.createIcons();
}

document.querySelector('.link-card .card-anchor').addEventListener('click', function (e) {
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

// 1. 实时时钟逻辑 (保持不变)
function updateBentoClock() {
    const clockEl = document.getElementById('bento-clock');
    if (!clockEl) return;
    const now = new Date();
    
    // 苹果风格通常更倾向于简洁
    // 如果想要带秒针：'HH:mm:ss'
    // 如果只想要分秒：'HH:mm'
    clockEl.textContent = now.toLocaleTimeString('zh-CN', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit' // 如果想更简洁可以把这一行删了
    });
}
setInterval(updateBentoClock, 1000);
updateBentoClock();

// 2. 自动定位并获取天气
async function updateWeatherByLocation() {
    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-desc');

    // 检查浏览器是否支持定位
    if (!navigator.geolocation) {
        descEl.textContent = "浏览器不支持定位";
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude; // 纬度
        const lon = position.coords.longitude; // 经度

        try {
            // 使用 wttr.in 接口，传入经纬度
            // format=j1 返回详细 JSON，lang=zh-cn 返回中文描述
            const response = await fetch(`https://wttr.in/${lat},${lon}?format=j1&lang=zh-cn`);
            const data = await response.json();
            
            const current = data.current_condition[0];
            const city = data.nearest_area[0].areaName[0].value; // 获取最近的城市名

            tempEl.textContent = `${current.temp_C}°C`;
            // 如果接口有中文描述就用中文，否则用英文
            descEl.textContent = `${city} | ${current.lang_zh ? current.lang_zh[0].value : current.weatherDesc[0].value}`;
        } catch (error) {
            tempEl.textContent = "N/A";
            descEl.textContent = "天气服务请求失败";
        }
    }, (error) => {
        // 定位失败处理
        console.error(error);
        descEl.textContent = "定位被拒绝或失败";
        // 失败后可以调用一个默认城市作为兜底
        updateWeatherDefault("NanChang"); 
    });
}

// 兜底函数：如果定位失败，显示默认城市
async function updateWeatherDefault(city) {
    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-desc');
    try {
        const response = await fetch(`https://wttr.in/${city}?format=j1&lang=zh-cn`);
        const data = await response.json();
        const current = data.current_condition[0];
        tempEl.textContent = `${current.temp_C}°C`;
        descEl.textContent = `${city} | ${current.lang_zh ? current.lang_zh[0].value : current.weatherDesc[0].value}`;
    } catch (e) {
        tempEl.textContent = "N/A";
        descEl.textContent = "获取失败";
    }
}

// 页面加载运行
updateWeatherByLocation();
// 每 30 分钟刷新一次
setInterval(updateWeatherByLocation, 1800000);

// 1. 引入不蒜子访问量统计脚本
const script = document.createElement('script');
script.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
script.async = true;
document.head.appendChild(script);

// 2. 获取用户 IP 地址
async function getUserIP() {
    const ipEl = document.getElementById('user-ip');
    try {
        // 使用 ipify 免费接口获取 IP
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipEl.textContent = data.ip;
    } catch (error) {
        ipEl.textContent = "127.0.0.1"; // 出错时的 fallback
        console.error("无法获取IP:", error);
    }
}

// 页面加载时执行
getUserIP();
