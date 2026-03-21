// 🔴 基础配置
const CONFIG = {
    username: 'w17679210701-blip',
    repo: 'Public',
    basePath: 'gallery',
    s: "OTkwNzAx" // 990701 的 Base64
};

// 用 var 或者直接挂载，防止 let 重复声明报错
var OMEN_STATE = {
    currentFolder: ""
};

// 1. 扫描文件夹并生成相册卡片
async function loadAlbums() {
    const grid = document.getElementById('album-grid');
    if (!grid) return;
    grid.innerHTML = "<p style='text-align:center;'>正在扫描云端相册...</p>";

    try {
        const url = `https://api.github.com/repos/${CONFIG.username}/${CONFIG.repo}/contents/${CONFIG.basePath}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('API 连接失败');

        const data = await res.json();
        const folders = data.filter(item => item.type === 'dir');

        // A. 生成正常的相册卡片
        let htmlContent = folders.map(f => `
            <div class="album-card" onclick="handleEntry('${f.name}')">
                <div class="album-name">${f.name}</div>
            </div>
        `).join('');

        // B. 🔴 修正：把返回按钮放进一个占位容器里，确保间距和宽度与上面完全对齐
        // 我们不给这个容器加 album-card 类，避免它出现背景色或多余边距
        htmlContent += `
            <div style="padding: 0; width: 100%; display: flex; justify-content: center; margin-top: 1px;">
                <a href="index.html" class="omen-back-btn">
                    <span>&larr;</span>
                </a>
            </div>
        `;

        grid.innerHTML = htmlContent;

    } catch (e) {
        grid.innerHTML = `<p style='text-align:center; color:red;'>加载失败: ${e.message}</p>`;
    }
}

// 2. 文件夹入口处理
function handleEntry(folderName) {
    const lockFolders = ['hidden', 'private', 'secret'];
    OMEN_STATE.currentFolder = folderName; 

    if (lockFolders.includes(folderName.toLowerCase())) {
        const modal = document.getElementById('password-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.getElementById('password-input').focus(); 
        }
    } else {
        loadPhotos(folderName);
    }
}

// 3. 密码验证
function submitPassword() {
    const input = document.getElementById('password-input');
    if (!input) return;
    
    if (window.btoa(input.value.trim()) === CONFIG.s) {
        closeModal();
        loadPhotos(OMEN_STATE.currentFolder);
    } else {
        alert("密码错误！");
        input.value = ""; 
    }
}

// 4. 关闭弹窗
function closeModal() {
    const modal = document.getElementById('password-modal');
    const input = document.getElementById('password-input');
    if (modal) modal.style.display = 'none';
    if (input) input.value = "";
}

// 5. 照片流展示
async function loadPhotos(folderName) {
    document.getElementById('category-view').style.display = 'none';
    document.getElementById('photo-viewer').style.display = 'block';
    
    const title = document.getElementById('current-album-title');
    const list = document.getElementById('photo-list');
    
    title.innerText = `正在开启：${folderName}`;
    list.innerHTML = "<p style='text-align:center;'>正在提取照片...</p>";

    try {
        const url = `https://api.github.com/repos/${CONFIG.username}/${CONFIG.repo}/contents/${CONFIG.basePath}/${folderName}`;
        const res = await fetch(url);
        const files = await res.json();
        const photos = files.filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f.name));

        if (photos.length === 0) {
            list.innerHTML = "<p style='text-align:center;'>该相册内暂无图片。</p>";
        } else {
            list.innerHTML = photos.map(p => `
                <div style="break-inside: avoid; margin-bottom: 15px;">
                    <img src="${p.download_url}" 
                         style="width: 100%; border-radius: 10px; display: block; box-shadow: 0 4px 10px rgba(0,0,0,0.5);"
                         loading="lazy">
                </div>
            `).join('');
        }
        title.innerText = folderName;
    } catch (e) {
        list.innerHTML = "<p style='text-align:center; color:red;'>读取失败</p>";
    }
}

// 6. 返回分类
function showCategories() {
    document.getElementById('category-view').style.display = 'block';
    document.getElementById('photo-viewer').style.display = 'none';
    document.title = "OMEN'S GALLERY";
}

// 初始化
window.onload = loadAlbums;

// 全局监听回车
document.addEventListener('keypress', function (e) {
    const modal = document.getElementById('password-modal');
    if (e.key === 'Enter' && modal && modal.style.display === 'flex') {
        submitPassword();
    }
});