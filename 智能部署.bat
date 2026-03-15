@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo 🦞 Million Claw 网站智能部署脚本
echo ============================================
echo.

echo 1. 🔍 检查当前目录状态...
if not exist "index.html" (
    echo ❌ 错误: 当前目录没有找到 index.html
    echo    请确保在正确的网站目录中运行此脚本
    pause
    exit /b 1
)

echo ✅ 找到网站文件: index.html

echo.
echo 2. 📁 初始化Git仓库...
if not exist ".git" (
    echo   初始化新的Git仓库...
    git init
    git add .
    git commit -m "Initial commit: Million Claw website"
    echo ✅ Git仓库初始化完成
) else (
    echo   Git仓库已存在，更新文件...
    git add .
    git commit -m "Update website files" || echo ℹ️ 没有新更改
)

echo.
echo 3. 🔗 检查远程仓库...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo   ⚠️ 没有设置远程仓库
    set /p GITHUB_USER="   请输入GitHub用户名: "
    set REPO_NAME="million-claw-website"
    set REPO_URL="https://github.com/!GITHUB_USER!/!REPO_NAME!.git"
    
    echo.
    echo   📝 远程仓库信息:
    echo     用户名: !GITHUB_USER!
    echo     仓库名: !REPO_NAME!
    echo     URL: !REPO_URL!
    echo.
    echo   ⚠️ 重要: 请先创建GitHub仓库
    echo     1. 访问: https://github.com/new
    echo     2. 仓库名: !REPO_NAME!
    echo     3. 选择: Public
    echo     4. 不要初始化README、.gitignore或license
    echo     5. 点击 Create repository
    echo.
    pause
    
    git remote add origin "!REPO_URL!"
    echo ✅ 远程仓库设置完成
) else (
    git remote get-url origin
    echo ✅ 远程仓库已配置
)

echo.
echo 4. 🚀 推送代码到GitHub...
echo   分支: main
git push -u origin main --force

if errorlevel 1 (
    echo.
    echo ❌ 推送失败！
    echo.
    echo 💡 可能的原因:
    echo   1. GitHub仓库不存在 (需要先创建)
    echo   2. 网络连接问题
    echo   3. 权限不足
    echo.
    echo 🔗 创建仓库: https://github.com/new
    echo 📝 仓库名: million-claw-website
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ 代码推送成功！

echo.
echo 5. 🌐 配置GitHub Pages...
echo.
echo   ⚠️ 需要手动配置GitHub Pages:
echo     1. 访问: https://github.com/%GITHUB_USER%/million-claw-website/settings/pages
echo     2. Source: Deploy from a branch
echo     3. Branch: main → /(root)
echo     4. 点击 Save
echo.
echo   📍 网站地址: https://%GITHUB_USER%.github.io/million-claw-website/
echo.
echo   ⏱️ 部署需要1-2分钟生效
echo.

echo 6. 📋 创建部署指南...
(
echo # Million Claw 网站部署指南
echo.
echo ## 🌐 网站地址
echo https://%GITHUB_USER%.github.io/million-claw-website/
echo.
echo ## ⚙️ GitHub Pages 配置步骤
echo 1. 访问仓库设置: https://github.com/%GITHUB_USER%/million-claw-website/settings
echo 2. 左侧菜单点击 "Pages"
echo 3. 在 "Source" 部分:
echo    - 选择 "Deploy from a branch"
echo    - Branch: main
echo    - Folder: / (root)
echo 4. 点击 "Save"
echo.
echo ## 🔄 更新网站
echo 要更新网站内容:
echo 1. 修改文件
echo 2. 运行: git add .
echo 3. 运行: git commit -m "更新描述"
echo 4. 运行: git push
echo.
echo ## 📞 技术支持
echo 如有问题，请检查:
echo 1. GitHub Pages状态: https://githubstatus.com/
echo 2. 仓库是否为公开 (Public)
echo 3. 等待1-2分钟部署生效
) > "部署指南.md"

echo ✅ 创建部署指南: 部署指南.md

echo.
echo ============================================
echo 🎉 部署脚本执行完成！
echo.
echo 📋 下一步:
echo   1. 创建GitHub仓库 (如果还没创建)
echo   2. 配置GitHub Pages
echo   3. 访问网站确认
echo.
echo 📄 详细指南请查看: 部署指南.md
echo ============================================
pause