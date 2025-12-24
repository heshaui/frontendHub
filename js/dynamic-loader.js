/**
 * 动态内容加载器
 * 实现按需加载、缓存、历史记录同步等功能
 */

class DynamicContentLoader {
    constructor(baseName) {
        this.baseName = baseName;
        this.baseDir = `${baseName}`;
        this.meta = null;
        this.cache = new Map(); // 内容缓存
        this.currentSection = null;
        this.container = null;
        this.loadingIndicator = null;
        this.toc = null;
    }

    /**
     * 初始化
     */
    async init() {
        console.log('[DynamicLoader] 初始化...');
        
        // 获取DOM元素
        this.container = document.getElementById('dynamic-content-container');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.toc = document.querySelector('.toc-list');
        
        if (!this.container) {
            console.error('[DynamicLoader] 未找到容器元素');
            return;
        }
        
        try {
            // 加载元数据
            await this.loadMetadata();
            
            // 设置事件监听
            this.setupEventListeners();
            
            // 处理初始URL（hash或默认）
            this.handleInitialLoad();
            
            console.log('[DynamicLoader] 初始化完成');
        } catch (error) {
            console.error('[DynamicLoader] 初始化失败:', error);
            this.showError('加载失败，请刷新页面重试');
        }
    }

    /**
     * 加载元数据
     */
    async loadMetadata() {
        const metaUrl = `${this.baseDir}/meta.json`;
        console.log('[DynamicLoader] 加载元数据:', metaUrl);
        
        const response = await fetch(metaUrl);
        if (!response.ok) {
            throw new Error(`加载元数据失败: ${response.status}`);
        }
        
        this.meta = await response.json();
        console.log(`[DynamicLoader] 元数据加载完成，共 ${this.meta.sections.length} 个章节`);
        
        // 更新目录链接
        this.updateTocLinks();
    }

    /**
     * 更新目录链接
     */
    updateTocLinks() {
        if (!this.toc || !this.meta) return;
        
        const tocLinks = this.toc.querySelectorAll('a');
        
        this.meta.sections.forEach((section, index) => {
            if (tocLinks[index]) {
                const link = tocLinks[index];
                // 修改链接为hash导航
                link.href = `#${section.id}`;
                link.setAttribute('data-section-id', section.id);
                link.setAttribute('data-section-index', section.index);
                
                // 添加点击事件
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.loadSection(section.index);
                });
            }
        });
        
        console.log('[DynamicLoader] 目录链接已更新');
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        // 监听浏览器前进后退
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.sectionId) {
                const section = this.meta.sections.find(s => s.id === e.state.sectionId);
                if (section) {
                    this.loadSection(section.index, false); // false表示不添加历史记录
                }
            }
        });
        
        // 监听hash变化
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
    }

    /**
     * 处理初始加载
     */
    handleInitialLoad() {
        const hash = window.location.hash;
        
        if (hash) {
            // 有hash，加载对应章节
            const sectionId = hash.substring(1);
            const section = this.meta.sections.find(s => s.id === sectionId);
            if (section) {
                this.loadSection(section.index);
                return;
            }
        }
        
        // 默认加载第一个章节
        this.loadSection(0);
    }

    /**
     * 处理hash变化
     */
    handleHashChange() {
        const hash = window.location.hash;
        if (!hash) return;
        
        const sectionId = hash.substring(1);
        const section = this.meta.sections.find(s => s.id === sectionId);
        if (section && section.index !== this.currentSection) {
            this.loadSection(section.index, false);
        }
    }

    /**
     * 加载章节
     */
    async loadSection(index, pushState = true) {
        if (index < 0 || index >= this.meta.sections.length) {
            console.error('[DynamicLoader] 无效的章节索引:', index);
            return;
        }
        
        const section = this.meta.sections[index];
        console.log(`[DynamicLoader] 加载章节 ${index + 1}/${this.meta.sections.length}: ${section.title}`);
        
        // 显示加载动画
        this.showLoading();
        
        try {
            // 从缓存或网络加载内容
            const content = await this.fetchSection(section);
            
            // 渲染内容
            this.renderSection(content, section);
            
            // 更新状态
            this.currentSection = index;
            
            // 更新URL和历史记录
            if (pushState) {
                this.updateHistory(section);
            }
            
            // 更新目录高亮
            this.updateTocHighlight(index);
            
            // 滚动到顶部（平滑）
            this.scrollToTop();
            
            // 预加载相邻章节
            this.preloadAdjacentSections(index);
            
            // 保存阅读进度
            this.saveProgress(index);
            
            console.log('[DynamicLoader] 章节加载完成');
        } catch (error) {
            console.error('[DynamicLoader] 加载章节失败:', error);
            this.showError('加载失败，请重试');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 获取章节内容（带缓存）
     */
    async fetchSection(section) {
        // 检查缓存
        if (this.cache.has(section.id)) {
            console.log(`[DynamicLoader] 从缓存加载: ${section.title}`);
            return this.cache.get(section.id);
        }
        
        // 从网络加载
        const url = `${this.baseDir}/${section.file}`;
        console.log(`[DynamicLoader] 从网络加载: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const content = await response.text();
        
        // 存入缓存
        this.cache.set(section.id, content);
        
        return content;
    }

    /**
     * 渲染章节内容
     */
    renderSection(content, section) {
        // 淡出动画
        this.container.style.opacity = '0';
        
        setTimeout(() => {
            this.container.innerHTML = content;
            
            // 重新初始化页面功能
            this.reinitializeFeatures();
            
            // 淡入动画
            this.container.style.transition = 'opacity 0.3s';
            this.container.style.opacity = '1';
        }, 150);
    }

    /**
     * 重新初始化页面功能
     */
    reinitializeFeatures() {
        // 重新初始化代码高亮（如果有Prism.js）
        if (window.Prism) {
            Prism.highlightAllUnder(this.container);
        }
        
        // 重新初始化代码复制按钮
        const codeBlocks = this.container.querySelectorAll('pre code');
        codeBlocks.forEach(block => {
            if (!block.parentElement.querySelector('.copy-btn')) {
                this.addCopyButton(block.parentElement);
            }
        });
        
        // 重新初始化图片懒加载
        const images = this.container.querySelectorAll('img');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }

    /**
     * 添加复制按钮
     */
    addCopyButton(pre) {
        const button = document.createElement('button');
        button.className = 'copy-btn';
        button.innerHTML = '<i class="fas fa-copy"></i>';
        button.onclick = () => {
            const code = pre.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                button.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            });
        };
        pre.appendChild(button);
    }

    /**
     * 更新浏览器历史记录
     */
    updateHistory(section) {
        const url = `#${section.id}`;
        const state = { sectionId: section.id, sectionIndex: section.index };
        window.history.pushState(state, '', url);
    }

    /**
     * 更新目录高亮
     */
    updateTocHighlight(index) {
        if (!this.toc) return;
        
        const links = this.toc.querySelectorAll('a');
        links.forEach((link, i) => {
            if (i === index) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * 预加载相邻章节
     */
    preloadAdjacentSections(currentIndex) {
        // 预加载下一个和上一个章节
        const toPreload = [currentIndex - 1, currentIndex + 1];
        
        toPreload.forEach(index => {
            if (index >= 0 && index < this.meta.sections.length) {
                const section = this.meta.sections[index];
                if (!this.cache.has(section.id)) {
                    this.fetchSection(section).catch(err => {
                        console.warn('[DynamicLoader] 预加载失败:', section.title, err);
                    });
                }
            }
        });
    }

    /**
     * 保存阅读进度
     */
    saveProgress(index) {
        try {
            const key = `reading_progress_${this.baseName}`;
            localStorage.setItem(key, index);
        } catch (e) {
            console.warn('[DynamicLoader] 保存进度失败:', e);
        }
    }

    /**
     * 滚动到顶部
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * 显示加载动画
     */
    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'block';
        }
    }

    /**
     * 隐藏加载动画
     */
    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        this.container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #e53e3e;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>${message}</h3>
                <button onclick="location.reload()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 2rem;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                ">刷新页面</button>
            </div>
        `;
    }

    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
        console.log('[DynamicLoader] 缓存已清除');
    }

    /**
     * 获取统计信息
     */
    getStats() {
        return {
            baseName: this.baseName,
            totalSections: this.meta.sections.length,
            currentSection: this.currentSection,
            cacheSize: this.cache.size,
            cacheHitRate: this.cache.size / this.meta.sections.length
        };
    }
}

// 暴露到全局
window.DynamicContentLoader = DynamicContentLoader;


