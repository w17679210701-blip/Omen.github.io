 // 初始化图标
        lucide.createIcons();

        // 页面入场逻辑
        window.addEventListener('load', () => {
            const loader = document.getElementById('loader');
            const main = document.getElementById('main-content');
            
            setTimeout(() => {
                loader.classList.add('fade-out');
                main.classList.remove('opacity-0', 'translate-y-4');
                main.classList.add('opacity-100', 'translate-y-0');
            }, 1000);
        });
