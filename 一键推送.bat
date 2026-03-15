@echo off
chcp 65001 >nul
echo.
echo 🦞 Million Claw 网站一键推送脚本
echo =================================
echo.

echo 1. 🔍 检查当前状态...
git status --porcelain
if %errorlevel% neq 0 (
    echo ❌ Git未初始化或有问题
    pause
    exit /b 1
)

echo.
echo 2. 📊 显示最近提交...
git log --oneline -3

echo.
echo 3. 🔗 设置远程仓库...
echo   仓库URL: https://github.com/jixiaolany/million-claw-website.git
git remote remove origin 2>nul
git remote add origin https://github.com/jixiaolany/million-claw-website.git

echo.
echo 4. 🚀 推送代码到GitHub...
echo   ⚠️ 注意: 如果仓库不存在会失败
echo   💡 如果失败，请先创建仓库: https://github.com/new
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 推送成功！
    echo.
    echo 🌐 网站地址: https://jixiaolany.github.io/million-claw-website/
    echo 💡 需要开启GitHub Pages:
    echo   1. 进入仓库 → Settings → Pages
    echo   2. Source: Deploy from a branch
    echo   3. Branch: main → /(root)
    echo   4. 点击 Save
) else (
    echo.
    echo ❌ 推送失败！
    echo.
    echo 💡 可能的原因:
    echo   1. 仓库不存在 (需要先创建)
    echo   2. 网络连接问题
    echo   3. 权限不足
    echo.
    echo 🔗 创建仓库: https://github.com/new
    echo 📝 仓库名: million-claw-website
)

echo.
echo =================================
echo 🎉 脚本执行完成！
echo =================================
pause