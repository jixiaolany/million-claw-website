@echo off
echo 🚀 开始Git推送部署...
echo.

echo 📋 检查Git安装...
where git >nul 2>nul
if errorlevel 1 (
    echo ❌ Git未安装，使用网页上传方案
    goto web_upload
)

echo ✅ Git已安装
echo.

echo 🔧 配置Git用户信息...
git config --global user.name "jixiaolany"
git config --global user.email "646077175@qq.com"

echo 📦 克隆GitHub仓库...
cd /d "C:\Users\关\.openclaw\workspace\deploy-website\GitHubPages部署"
if exist your-app-website-githubpages (
    echo ⚠️ 仓库文件夹已存在，进入...
    cd your-app-website-githubpages
    git pull origin main
) else (
    echo 🔗 克隆仓库...
    git clone https://github.com/jixiaolany/your-app-website-githubpages.git
    cd your-app-website-githubpages
)

echo 📤 复制网站文件...
copy "..\index.html" "index.html"

echo 🔄 提交更改...
git add index.html
git commit -m "Deploy website to GitHub Pages"

echo 🚀 推送到GitHub...
git push origin main

if errorlevel 1 (
    echo ❌ Git推送失败，使用网页上传
    goto web_upload
)

echo 🎉 Git推送成功！
echo 🌐 请手动开启GitHub Pages:
echo   1. 访问: https://github.com/jixiaolany/your-app-website-githubpages/settings/pages
echo   2. Source选择: Deploy from a branch
echo   3. 分支选择: main
echo   4. 文件夹选择: /(root)
echo   5. 点击: Save
echo.
echo 💡 等待1-2分钟，访问:
echo   https://jixiaolany.github.io/your-app-website-githubpages/
goto end

:web_upload
echo.
echo 💡 网页上传方案:
echo   1. 登录GitHub: https://github.com
echo   2. 进入仓库: https://github.com/jixiaolany/your-app-website-githubpages
echo   3. 点击"Add file" → "Upload files"
echo   4. 上传 index.html 文件
echo   5. 提交更改
echo   6. 开启GitHub Pages
echo.

:end
echo ========================================
echo 📞 如果遇到问题:
echo   1. 截图错误信息发给我
echo   2. 我立即指导解决
echo ========================================
pause