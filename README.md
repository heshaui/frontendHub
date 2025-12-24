# FrontendHub - 前端学习中心

一个现代化、响应式的前端学习平台，基于原始面试题内容重新设计和开发。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 特性

- 🎨 **现代化设计** - 简洁、美观的UI设计，提升学习体验
- 📱 **完全响应式** - 适配桌面、平板、手机等各种设备
- 🚀 **纯静态网站** - 无需后端，可直接部署或本地运行
- 📖 **系统化内容** - 9大模块，覆盖前端核心知识点
- 🎯 **高性能** - 优化加载速度，流畅的动画效果
- 💡 **易于使用** - 清晰的导航，自动生成目录
- 🔍 **SEO友好** - 良好的语义化HTML结构

## 📁 项目结构

```
FrontendHub/
├── index.html              # 首页
├── css/
│   ├── style.css          # 主样式文件
│   └── content.css        # 内容页样式
├── js/
│   ├── main.js            # 主脚本文件
│   └── content.js         # 内容页脚本
├── pages/
│   ├── template.html      # 内容页模板
│   ├── base.html          # 基础篇（待添加）
│   ├── improve.html       # 进阶篇（待添加）
│   └── ...                # 其他页面
└── assets/
    └── images/            # 图片资源
```

## 🚀 快速开始

### 方法一：使用本地服务器（推荐）

1. **使用 Node.js http-server**

```bash
# 安装 http-server
npm install -g http-server

# 在项目目录运行
cd FrontendHub
http-server -p 8000 -o
```

2. **使用 Python 内置服务器**

```bash
# Python 3
cd FrontendHub
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

3. **使用 VS Code Live Server**

- 安装 Live Server 扩展
- 右键点击 index.html
- 选择 "Open with Live Server"

然后在浏览器访问 `http://localhost:8000`

### 方法二：直接打开（功能受限）

直接双击 `index.html` 文件在浏览器打开。

⚠️ 注意：某些功能（如字体图标）可能需要服务器环境才能正常显示。

## 📚 如何添加内容

### 1. 使用模板创建新页面

复制 `pages/template.html` 并重命名：

```bash
cp pages/template.html pages/your-page.html
```

### 2. 编辑页面内容

在 `pages/your-page.html` 中：

1. 修改 `<title>` 标签
2. 更新面包屑导航中的 `<span>` 文本
3. 修改 `.article-header` 中的标题和元信息
4. 在 `.article-content` 中添加你的内容

### 3. 内容格式示例

```html
<div class="article-content">
    <h2>一级标题</h2>
    <p>段落文本...</p>
    
    <h3>二级标题</h3>
    <p>更多内容...</p>
    
    <!-- 代码示例 -->
    <pre><code class="language-javascript">
function example() {
    console.log('Hello!');
}
    </code></pre>
    
    <!-- 提示框 -->
    <div class="note info">
        <div class="note-title"><i class="fas fa-info-circle"></i> 提示</div>
        <p>这是一个提示信息</p>
    </div>
</div>
```

### 4. 更新首页链接

在 `index.html` 中找到对应的课程卡片，更新 `href` 属性：

```html
<a href="pages/your-page.html" class="course-card">
    <!-- ... -->
</a>
```

## 🎨 自定义样式

### 修改主题颜色

在 `css/style.css` 顶部的 `:root` 中修改 CSS 变量：

```css
:root {
    --primary-color: #3b82f6;      /* 主色调 */
    --secondary-color: #8b5cf6;    /* 次要色 */
    --success-color: #10b981;      /* 成功色 */
    --warning-color: #f59e0b;      /* 警告色 */
    --danger-color: #ef4444;       /* 危险色 */
    /* ... */
}
```

### 自定义字体

在 `css/style.css` 的 `body` 选择器中修改：

```css
body {
    font-family: '你的字体', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

## 🔧 功能说明

### 首页功能

- ✅ 响应式导航栏
- ✅ 英雄区动画效果
- ✅ 特色功能展示
- ✅ 课程模块卡片
- ✅ 资源导航
- ✅ FAQ 折叠展开
- ✅ 返回顶部按钮
- ✅ 平滑滚动

### 内容页功能

- ✅ 自动生成目录（TOC）
- ✅ 目录高亮跟随
- ✅ 阅读进度条
- ✅ 代码高亮和复制
- ✅ 图片点击放大
- ✅ 面包屑导航
- ✅ 上下篇导航
- ✅ 打印优化

## 📝 内容迁移指南

### 从原始HTML迁移内容

1. **打开原始HTML文件**（如 `downloaded_site/docs/base.html`）

2. **提取主要内容**

   找到主要内容区域（通常在 `<article>` 或 `<main>` 标签内）

3. **复制到新模板**

   将内容复制到 `FrontendHub/pages/template.html` 的 `.article-content` 区域

4. **清理和格式化**

   - 删除不需要的样式和脚本
   - 统一标题层级（h2、h3、h4）
   - 添加提示框样式
   - 优化代码块格式

5. **测试页面**

   在浏览器中打开，检查：
   - 目录是否正确生成
   - 图片是否正常显示
   - 链接是否有效
   - 样式是否正确

### 批量处理脚本（可选）

可以编写脚本自动提取和转换内容。创建 `migrate.js`：

```javascript
const fs = require('fs');
const cheerio = require('cheerio');

// 读取原始HTML
const html = fs.readFileSync('old-file.html', 'utf8');
const $ = cheerio.load(html);

// 提取内容
const content = $('.content-main').html();

// 读取模板
const template = fs.readFileSync('pages/template.html', 'utf8');
const $template = cheerio.load(template);

// 插入内容
$template('.article-content').html(content);

// 保存新文件
fs.writeFileSync('pages/new-file.html', $template.html());
```

## 🌐 部署

### GitHub Pages

1. 将项目上传到 GitHub 仓库
2. 进入仓库设置 > Pages
3. 选择 `main` 分支作为源
4. 保存，等待部署完成

### Netlify

1. 将项目上传到 Git 仓库
2. 在 Netlify 中新建站点
3. 连接你的仓库
4. 部署设置保持默认
5. 点击部署

### Vercel

1. 安装 Vercel CLI：`npm i -g vercel`
2. 在项目目录运行：`vercel`
3. 按提示完成部署

## 🛠️ 开发建议

### 推荐工具

- **代码编辑器**：VS Code
- **浏览器**：Chrome/Firefox（带开发者工具）
- **本地服务器**：Live Server 或 http-server
- **图片优化**：TinyPNG、ImageOptim
- **图标**：Font Awesome（已集成）

### 最佳实践

1. **保持文件组织清晰**：按功能分类文件
2. **使用语义化HTML**：便于SEO和可访问性
3. **优化图片**：压缩图片，使用合适的格式
4. **代码注释**：为复杂逻辑添加注释
5. **测试响应式**：在多种设备上测试
6. **性能优化**：延迟加载图片，压缩资源

## 📋 待办清单

- [ ] 添加搜索功能
- [ ] 实现深色模式
- [ ] 添加更多内容页面
- [ ] 集成代码高亮库（如 Prism.js）
- [ ] 添加评论系统（可选）
- [ ] 制作离线PWA版本
- [ ] 添加多语言支持

## 🤝 贡献

欢迎提交问题和改进建议！

## 📄 许可证

MIT License - 仅供个人学习使用

## 🙏 致谢

- 原始内容来源：[interview.poetries.top](https://interview.poetries.top/)
- 图标：[Font Awesome](https://fontawesome.com/)
- 设计灵感：现代前端设计趋势

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：

- GitHub Issues
- Email: your-email@example.com

---

**享受学习之旅！🚀**


