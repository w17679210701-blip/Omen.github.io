const CONFIG = {
            username: 'w17679210701-blip',
            repo: 'Public',
            basePath: 'gallery',
            // 🔴 密码设置区：在这里指定哪个文件夹需要密码
            passwords: {
                'hidden': '123456', // 文件夹名: 密码
                'private': '8888'
            }
        };

        // 1. 加载所有文件夹（相册）
        async function loadAlbums() {
            const grid = document.getElementById('album-grid');
            try {
                const res = await fetch(`https://api.github.com/repos/${CONFIG.username}/${CONFIG.repo}/contents/${CONFIG.basePath}`);
                const items = await response.json();
                
                // 过滤出文件夹
                const folders = items.filter(item => item.type === 'dir');

                grid.innerHTML = folders.map(f => `
                    <div class="album-card" onclick="checkAccess('${f.name}')">
                        <div class="album-name">${f.name}</div>
                    </div>
                `).join('');
            } catch (e) { console.error("加载失败", e); }
        }

        // 2. 权限校验
        function checkAccess(folderName) {
            const password = CONFIG.passwords[folderName];
            if (password) {
                const input = prompt("该相册已加密，请输入密码：");
                if (input !== password) {
                    alert("密码错误！");
                    return;
                }
            }
            loadPhotos(folderName);
        }

        // 3. 加载照片
        async function loadPhotos(folderName) {
            document.getElementById('category-view').style.display = 'none';
            document.getElementById('photo-viewer').style.display = 'block';
            document.getElementById('current-album-title').innerText = folderName;
            
            const list = document.getElementById('photo-list');
            list.innerHTML = "读取中...";

            try {
                const res = await fetch(`https://api.github.com/repos/${CONFIG.username}/${CONFIG.repo}/contents/${CONFIG.basePath}/${folderName}`);
                const files = await res.json();
                const photos = files.filter(f => /\.(jpe?g|png|gif|webp)$/i.test(f.name));

                list.innerHTML = photos.map(p => `<img src="${p.download_url}">`).join('');
            } catch (e) { list.innerHTML = "加载照片失败"; }
        }

        function showCategories() {
            document.getElementById('category-view').style.display = 'block';
            document.getElementById('photo-viewer').style.display = 'none';
        }

        loadAlbums();