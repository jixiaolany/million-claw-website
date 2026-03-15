# Million Claw 网站部署指南

## 🌐 网站预览
这是一个基于OpenClaw框架的Million Claw产品展示网站。

## 📁 文件结构
- `index.html` - 主网站文件
- `icons/` - 网站图标文件夹
- 其他HTML文件 - 不同版本的网站文件

## 🚀 部署到GitHub Pages

### 步骤1: 创建GitHub仓库
1. 访问 https://github.com/new
2. 输入仓库名: `million-claw-website`
3. 选择: **Public** (公开)
4. **不要**初始化README、.gitignore或license
5. 点击 **Create repository**

### 步骤2: 推送代码到GitHub
在网站目录中运行以下命令:

```bash
# 设置远程仓库 (替换 YOUR_USERNAME 为你的GitHub用户名)
git remote add origin https://github.com/YOUR_USERNAME/million-claw-website.git

# 推送代码
git push -u origin main
```

### 步骤3: 启用GitHub Pages
1. 访问你的仓库: `https://github.com/YOUR_USERNAME/million-claw-website`
2. 点击 **Settings** (设置)
3. 左侧菜单点击 **Pages**
4. 在 **Source** 部分:
   - 选择 **Deploy from a branch**
   - Branch: **main**
   - Folder: **/** (root)
5. 点击 **Save**

### 步骤4: 访问网站
等待1-2分钟，然后访问:
```
https://YOUR_USERNAME.github.io/million-claw-website/
```

## 🔧 本地测试
要本地测试网站:
1. 双击 `index.html` 文件
2. 或使用Python启动本地服务器:
   ```bash
   python -m http.server 8000
   ```
   然后访问: http://localhost:8000

## 📞 常见问题

### Q: 网站显示404错误
A: 确保:
1. 仓库是公开的 (Public)
2. GitHub Pages已正确配置
3. 等待1-2分钟让部署生效

### Q: 图标不显示
A: 确保 `icons/` 文件夹已上传到GitHub

### Q: 如何更新网站
A: 
1. 修改文件
2. 运行: `git add .`
3. 运行: `git commit -m "更新描述"`
4. 运行: `git push`

## 🎯 网站特性
- ✅ 响应式设计 (支持手机和电脑)
- ✅ 邀请码验证系统
- ✅ Windows/macOS下载功能
- ✅ 30+种使用场景展示
- ✅ 完整的JavaScript交互
- ✅ 现代化UI设计

## 📊 技术栈
- HTML5
- CSS3 (Flexbox/Grid)
- JavaScript (ES6)
- Font Awesome 图标
- GitHub Pages 托管