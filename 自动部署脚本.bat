@echo off
echo ========================================
echo   你的软件服务 - GitHub Pages自动部署
echo ========================================
echo.
echo 🚀 开始GitHub Pages自动部署流程...
echo.

echo 📋 需要的信息:
echo   1. GitHub用户名: jixiaolany
echo   2. 仓库名称: your-app-website (可自定义)
echo   3. GitHub Personal Access Token (需要创建)
echo.

echo 🔑 如何获取GitHub Token:
echo   1. 访问: https://github.com/settings/tokens
echo   2. 点击"Generate new token"
echo   3. 权限选择: repo (全部)
echo   4. 生成并复制Token
echo.

set /p GITHUB_TOKEN="请输入GitHub Token: "
set /p REPO_NAME="请输入仓库名称 (默认: your-app-website): "

if "%REPO_NAME%"=="" set REPO_NAME=your-app-website

echo.
echo 📦 准备部署文件...
copy "完整的index.html" "index.html" >nul

echo 🔗 创建GitHub仓库...
curl -X POST -H "Authorization: token %GITHUB_TOKEN%" ^
  -H "Accept: application/vnd.github.v3+json" ^
  https://api.github.com/user/repos ^
  -d "{\"name\":\"%REPO_NAME%\",\"description\":\"你的软件服务网站\",\"private\":false}" > create_repo.json 2>nul

if errorlevel 1 (
    echo ❌ 仓库创建失败，可能已存在
    echo 💡 尝试直接上传文件...
)

echo 📤 上传网站文件...
REM 这里需要Git命令行工具
echo 💡 如果已安装Git，请执行以下命令:
echo.
echo git clone https://github.com/jixiaolany/%REPO_NAME%.git
echo cd %REPO_NAME%
echo copy ..\index.html .
echo git add index.html
echo git commit -m "Deploy website"
echo git push origin main
echo.

echo 🌐 开启GitHub Pages:
echo   1. 访问: https://github.com/jixiaolany/%REPO_NAME%/settings/pages
echo   2. 在"Source"选择: Deploy from a branch
echo   3. 分支选择: main
echo   4. 文件夹选择: /(root)
echo   5. 点击: Save
echo.

echo 🎉 部署完成后访问:
echo   https://jixiaolany.github.io/%REPO_NAME%/
echo.

echo 💡 备用方案: 手动部署
echo   1. 登录GitHub
echo   2. 创建仓库: %REPO_NAME%
echo   3. 上传 index.html 文件
echo   4. 开启GitHub Pages
echo   5. 等待几分钟，获得网址
echo.

echo ========================================
echo 📞 如果遇到问题:
echo   1. 截图错误信息发给我
echo   2. 我立即指导解决
echo   3. 确保部署成功
echo ========================================
echo.
pause