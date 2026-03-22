/**
 * 🔴 1. 基础配置参数
 * 注意：SecretKey 是非常敏感的信息，请确保不要泄露给他人。
 */
const CONFIG = {
    SecretId: 'AKID63lERP6XjnhPrAD0XnqdARSFm35sQipi', 
    SecretKey: 'g7IFwNXS9algMnytYy70f5E7g5FAqIVS', 
    Bucket: 'hiomen-1312408524', 
    Region: 'ap-guangzhou', 
    s: "OTkwNzAx", 
    albumList: ['日常', '猫', '加密相册'], 
    lockFolders: ['加密相册', 'hidden', 'private'] 
};

/**
 * 🛠️ 2. 初始化
 */
const cos = new COS({ SecretId: CONFIG.SecretId, SecretKey: CONFIG.SecretKey });
var OMEN_STATE = { currentFolder: "", allPhotos: {} };

/**
 * 📂 3. 加载云端数据
 */
async function loadAlbums() {
    const grid = document.getElementById('album-grid');
    grid.innerHTML = `<p class="col-span-full text-center text-white/50 animate-pulse py-20 text-sm tracking-widest">正在扫描云端相册...</p>`;

    cos.getBucket({
        Bucket: CONFIG.Bucket,
        Region: CONFIG.Region,
        Prefix: '', 
    }, function(err, data) {
        if (err) {
            grid.innerHTML = `<p class="col-span-full text-center text-red-500 py-20 text-sm">加载失败：请检查密钥和跨域设置</p>`;
            return;
        }

        const files = data.Contents || [];
        files.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));

        // 初始化容器
        const albumMap = {};
        CONFIG.albumList.forEach(name => albumMap[name] = []);

        files.forEach(item => {
            if (item.Size > 0) {
                const parts = item.Key.split('/');
                const folderName = parts.length > 1 ? parts[0] : '默认相册';
                const url = `https://${CONFIG.Bucket}.cos.${CONFIG.Region}.myqcloud.com/${item.Key}`;
                if (!albumMap[folderName]) albumMap[folderName] = [];
                albumMap[folderName].push(url);
            }
        });

        OMEN_STATE.allPhotos = albumMap;
        renderAlbumCards(Object.keys(albumMap));
    });
}

/**
 * 🎨 4. 渲染相册卡片 (修复为：一行两个)
 */
function renderAlbumCards(folders) {
    const grid = document.getElementById('album-grid');
    
    // 强制修改 grid 的类名确保一行两个
    grid.className = "grid grid-cols-2 gap-4 w-[95%] max-w-[800px] mx-auto pb-10";

    const sortedFolders = folders.sort((a, b) => {
        let indexA = CONFIG.albumList.indexOf(a);
        let indexB = CONFIG.albumList.indexOf(b);
        return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

    let html = sortedFolders.map(name => `
        <div onclick="handleEntry('${name}')" 
             class="group relative cursor-pointer bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-center transition-all duration-300 hover:bg-white/10 active:scale-95 shadow-lg">
            <div class="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all">📁</div>
            <div class="text-sm font-bold text-white uppercase tracking-tighter truncate">${name}</div>
            <div class="text-[10px] text-white/30 mt-1">${OMEN_STATE.allPhotos[name].length} PHOTOS</div>
        </div>
    `).join('');

    // 🔴 5. 返回按钮修复：修正了 ID 和显示问题
    html += `
        <div class="col-span-full flex justify-center pt-8">
            <a href="index.html" class="omen-glow-border w-full h-[50px] flex items-center justify-center rounded-full active:scale-95 transition-transform">
                <span class="text-[#ffcc00] text-3xl font-black mb-1">←</span>
            </a>
        </div>
    `;
    grid.innerHTML = html;
}

/**
 * 📸 6. 展示照片 (两列瀑布流)
 */
function showPhotos(folderName) {
    const catView = document.getElementById('category-view');
    const photoView = document.getElementById('photo-viewer');

    catView.classList.replace('block', 'hidden');
    photoView.classList.replace('hidden', 'block');
    
    document.getElementById('current-album-title').innerText = folderName;
    const list = document.getElementById('photo-list');
    const photos = OMEN_STATE.allPhotos[folderName] || [];

    list.className = "columns-2 gap-3 px-2";

    if (photos.length === 0) {
        list.innerHTML = `<div class="col-span-2 py-40 text-center text-white/20 italic">空空如也</div>`;
    } else {
        list.innerHTML = photos.map(url => `
            <div class="break-inside-avoid mb-3">
                <img src="${url}" 
                     class="w-full rounded-xl border border-white/10 shadow-lg"
                     loading="lazy">
            </div>
        `).join('');
    }
}

/**
 * 🔐 7. 密码与交互逻辑
 */
function handleEntry(name) {
    OMEN_STATE.currentFolder = name;
    const isLocked = CONFIG.lockFolders.some(f => f.toLowerCase() === name.toLowerCase());
    if (isLocked) {
        const modal = document.getElementById('password-modal');
        modal.classList.replace('hidden', 'flex');
        document.getElementById('password-input').focus();
    } else {
        showPhotos(name);
    }
}

function showCategories() {
    document.getElementById('photo-viewer').classList.replace('block', 'hidden');
    document.getElementById('category-view').classList.replace('hidden', 'block');
    window.scrollTo(0, 0);
}

function closeModal() {
    document.getElementById('password-modal').classList.replace('flex', 'hidden');
    document.getElementById('password-input').value = "";
}

function submitPassword() {
    const val = document.getElementById('password-input').value.trim();
    if (window.btoa(val) === CONFIG.s) {
        closeModal();
        showPhotos(OMEN_STATE.currentFolder);
    } else {
        alert("密码错误！");
        document.getElementById('password-input').value = "";
    }
}

// 初始化启动
window.onload = loadAlbums;
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !document.getElementById('password-modal').classList.contains('hidden')) submitPassword();
});