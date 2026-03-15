@echo off
chcp 65001 >nul
echo.
echo 🚀 使用认证推送代码到GitHub
echo ================================
echo.

echo 步骤1: 输入GitHub信息
echo.
set /p GITHUB_USER="GitHub用户名: "
set /p GITHUB_TOKEN="GitHub Personal Access Token (需要repo权限): "

echo.
echo 步骤2: 设置远程仓库
echo.
git remote remove origin 2>nul
git remote add origin https://%GITHUB_USER%:%GITHUB_TOKEN%@github.com/%GITHUB_USER%/million-claw-website.git

echo.
echo 步骤3: 推送代码
echo.
git push -u origin main --force

if errorlevel 1 (
    echo.
    echo ❌ 推送失败！
    echo 请检查:
    echo 1. 用户名和Token是否正确
    echo 2. 仓库是否存在
    echo 3. Token是否有repo权限
) else (
    echo.
    echo ✅ 推送成功！
    echo.
    echo 🌐 网站地址: https://%GITHUB_USER%.github.io/million-claw-website/
)

echo.
pause