// ==================== 自动生成目录 ====================
function generateTOC() {
    const article = document.querySelector('.article-content');
    const toc = document.getElementById('toc');
    
    if (!article || !toc) return;
    
    const headings = article.querySelectorAll('h2, h3');
    if (headings.length === 0) {
        toc.innerHTML = '<p style="color: #9ca3af; font-size: 0.875rem;">暂无目录</p>';
        return;
    }
    
    let tocHTML = '<ul>';
    let currentLevel = 2;
    
    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent;
        const id = `heading-${index}`;
        heading.id = id;
        
        if (level > currentLevel) {
            tocHTML += '<ul>';
        } else if (level < currentLevel) {
            tocHTML += '</ul>';
        }
        
        tocHTML += `<li><a href="#${id}">${text}</a></li>`;
        currentLevel = level;
    });
    
    tocHTML += '</ul>';
    toc.innerHTML = tocHTML;
}

// ==================== 目录高亮跟随 ====================
function updateTOCHighlight() {
    const headings = document.querySelectorAll('.article-content h2, .article-content h3');
    const tocLinks = document.querySelectorAll('.toc a');
    
    if (headings.length === 0 || tocLinks.length === 0) return;
    
    let current = '';
    const scrollPosition = window.pageYOffset + 100;
    
    headings.forEach(heading => {
        const sectionTop = heading.offsetTop;
        if (scrollPosition >= sectionTop) {
            current = heading.id;
        }
    });
    
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ==================== 代码高亮（基础版本） ====================
function highlightCode() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // 添加行号
        const lines = block.textContent.split('\n');
        if (lines.length > 1) {
            const lineNumbersWrapper = document.createElement('div');
            lineNumbersWrapper.className = 'line-numbers';
            lineNumbersWrapper.style.cssText = `
                position: absolute;
                left: 0;
                top: 0;
                padding: 1.5rem 0.5rem;
                background: rgba(0, 0, 0, 0.2);
                color: rgba(255, 255, 255, 0.5);
                text-align: right;
                user-select: none;
                font-size: 0.875rem;
                line-height: 1.6;
            `;
            
            for (let i = 1; i <= lines.length; i++) {
                lineNumbersWrapper.innerHTML += `${i}<br>`;
            }
            
            const pre = block.parentElement;
            pre.style.position = 'relative';
            pre.style.paddingLeft = '3rem';
            pre.insertBefore(lineNumbersWrapper, block);
        }
        
        // 添加复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.style.cssText = `
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        copyButton.addEventListener('click', () => {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        });
        
        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(copyButton);
    });
}

// ==================== 图片点击放大 ====================
function setupImageZoom() {
    const images = document.querySelectorAll('.article-content img');
    
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;
            
            const zoomedImg = img.cloneNode();
            zoomedImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 8px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
                animation: zoomIn 0.3s ease;
            `;
            
            overlay.appendChild(zoomedImg);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';
            
            overlay.addEventListener('click', () => {
                overlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    document.body.style.overflow = '';
                }, 300);
            });
        });
    });
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// ==================== 阅读进度条 ====================
function setupReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 60px;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 999;
        transition: width 0.2s ease;
        width: 0;
    `;
    document.body.appendChild(progressBar);
    
    // 响应式调整进度条位置
    function updateProgressBarPosition() {
        progressBar.style.top = window.innerWidth <= 768 ? '56px' : '60px';
    }
    
    updateProgressBarPosition();
    window.addEventListener('resize', updateProgressBarPosition);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = Math.min((scrolled / documentHeight) * 100, 100);
        progressBar.style.width = `${progress}%`;
    });
}

// ==================== 锚点平滑滚动 ====================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // 根据屏幕大小调整偏移量
                const offset = window.innerWidth <= 768 ? 70 : 100;
                const offsetTop = target.offsetTop - offset;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // 在移动端关闭侧边栏
                if (window.innerWidth <= 768 && window.MobileSidebar) {
                    window.MobileSidebar.close();
                }
            }
        });
    });
}

// ==================== 打印优化 ====================
function setupPrintStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            .navbar, .breadcrumb, .sidebar, .back-to-top, 
            .article-nav, .footer, .sidebar-toggle, 
            .sidebar-overlay, .reading-progress {
                display: none !important;
            }
            .article {
                box-shadow: none !important;
                padding: 0 !important;
            }
            .article-content pre {
                page-break-inside: avoid;
            }
            body {
                overflow: visible !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ==================== 移动端侧边栏切换 ====================
function setupMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    // 创建侧边栏切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-list"></i>';
    toggleBtn.setAttribute('aria-label', '打开目录');
    document.body.appendChild(toggleBtn);
    
    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    // 在侧边栏标题中添加关闭按钮
    const sidebarTitle = sidebar.querySelector('h3');
    if (sidebarTitle) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'sidebar-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.setAttribute('aria-label', '关闭目录');
        sidebarTitle.appendChild(closeBtn);
        
        closeBtn.addEventListener('click', closeSidebar);
    }
    
    // 打开侧边栏
    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        toggleBtn.innerHTML = '<i class="fas fa-times"></i>';
        toggleBtn.setAttribute('aria-label', '关闭目录');
    }
    
    // 关闭侧边栏
    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        toggleBtn.innerHTML = '<i class="fas fa-list"></i>';
        toggleBtn.setAttribute('aria-label', '打开目录');
    }
    
    // 切换侧边栏
    toggleBtn.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });
    
    // 点击遮罩层关闭侧边栏
    overlay.addEventListener('click', closeSidebar);
    
    // 点击目录链接后关闭侧边栏（使用事件委托）
    const toc = sidebar.querySelector('.toc');
    if (toc) {
        toc.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && window.innerWidth <= 768) {
                setTimeout(closeSidebar, 100);
            }
        });
    }
    
    // 监听ESC键关闭侧边栏
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
    
    // 窗口大小变化时处理
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        }, 100);
    });
    
    // 暴露方法供外部调用
    window.MobileSidebar = {
        open: openSidebar,
        close: closeSidebar
    };
}

// ==================== 页面初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    // 生成目录
    generateTOC();
    
    // 设置移动端侧边栏
    setupMobileSidebar();
    
    // 代码高亮
    highlightCode();
    
    // 图片放大
    setupImageZoom();
    
    // 阅读进度条
    setupReadingProgress();
    
    // 平滑滚动
    setupSmoothScroll();
    
    // 打印优化
    setupPrintStyles();
    
    // 监听滚动事件
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateTOCHighlight();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // 初始化目录高亮
    updateTOCHighlight();
});

// ==================== 键盘快捷键 ====================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + P: 打印
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
    }
    
    // Esc: 关闭图片预览
    if (e.key === 'Escape') {
        const overlay = document.querySelector('div[style*="position: fixed"]');
        if (overlay) {
            overlay.click();
        }
    }
});

// ==================== 导出功能 ====================
window.ContentPage = {
    version: '1.0.0',
    generateTOC,
    updateTOCHighlight
};


