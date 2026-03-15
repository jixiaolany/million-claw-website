@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ============================================
echo   🦞 MILLION CLAW 网站最终部署脚本
echo ============================================
echo.

echo 步骤1: 检查环境
echo.
where git >nul 2>&1
if errorlevel 1 (
    echo ❌ Git未安装
    echo 请先安装Git: https://git-scm.com/
    pause
    exit /b 1
)
echo ✅ Git已安装

echo.
echo 步骤2: 检查Git配置
echo.
git config --global user.name >nul 2>&1
if errorlevel 1 (
    echo ⚠️ Git用户信息未设置
    set /p GIT_NAME="请输入GitHub用户名: "
    git config --global user.name "!GIT_NAME!"
)
git config --global user.email >nul 2>&1
if errorlevel 1 (
    set /p GIT_EMAIL="请输入GitHub邮箱: "
    git config --global user.email "!GIT_EMAIL!"
)
echo ✅ Git配置完成

echo.
echo 步骤3: 准备代码
echo.
git add .
git commit -m "Deploy Million Claw website" >nul 2>&1
echo ✅ 代码准备完成

echo.
echo 步骤4: 创建GitHub仓库
echo.
echo ⚠️ 重要: 需要手动创建GitHub仓库
echo.
echo 请按以下步骤操作:
echo 1. 打开浏览器访问: https://github.com/new
echo 2. 输入仓库名: million-claw-website
echo 3. 选择: Public (公开)
echo 4. 不要初始化README、.gitignore或license
echo 5. 点击 Create repository
echo.
echo 创建完成后，按任意键继续...
pause

echo.
echo 步骤5: 设置远程仓库
echo.
set /p GITHUB_USER="请输入你的GitHub用户名: "
git remote remove origin 2>nul
git remote add origin https://github.com/!GITHUB_USER!/million-claw-website.git
echo ✅ 远程仓库设置完成

echo.
echo 步骤6: 推送代码
echo.
echo 正在推送代码到GitHub...
git push -u origin main --force

if errorlevel 1 (
    echo.
    echo ❌ 推送失败!
    echo.
    echo 可能的原因:
    echo 1. 仓库未创建
    echo 2. 网络问题
    echo 3. 用户名或密码错误
    echo.
    echo 请检查后重试
    pause
    exit /b 1
)

echo.
echo ✅ 代码推送成功!

echo.
echo 步骤7: 配置GitHub Pages
echo.
echo ⚠️ 需要配置GitHub Pages才能访问网站
echo.
echo 请按以下步骤操作:
echo 1. 访问: https://github.com/!GITHUB_USER!/million-claw-website/settings/pages
echo 2. 在"Source"部分选择: Deploy from a branch
echo 3. Branch: main
echo 4. Folder: / (root)
echo 5. 点击 Save
echo.
echo 配置完成后，网站将在1-2分钟内生效
echo.

echo 步骤8: 测试网站
echo.
echo 🌐 网站地址: https://!GITHUB_USER!.github.io/million-claw-website/
echo.
echo 请等待1-2分钟，然后访问上面的链接测试网站
echo.

echo ============================================
echo 🎉 部署流程完成!
echo.
echo 📋 总结:
echo 1. GitHub仓库已创建
echo 2. 代码已推送
echo 3. 需要手动配置GitHub Pages
echo 4. 网站地址如上所示
echo ============================================
echo.

echo 按任意键打开网站测试...
pause
start https://!GITHUB_USER!.github.io/million-claw-website/