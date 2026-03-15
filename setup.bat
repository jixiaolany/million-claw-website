@echo off
echo ========================================
echo    Million Claw 网站部署助手
echo ========================================
echo.

echo 步骤1: 检查Git配置
echo.
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git未安装
    echo 请先安装Git: https://git-scm.com/
    pause
    exit /b 1
)
echo ✅ Git已安装

echo.
echo 步骤2: 设置Git用户信息
echo.
set /p GIT_USER="请输入GitHub用户名: "
set /p GIT_EMAIL="请输入GitHub邮箱: "

git config --global user.name "%GIT_USER%"
git config --global user.email "%GIT_EMAIL%"
echo ✅ Git配置完成

echo.
echo 步骤3: 创建GitHub仓库
echo.
echo ⚠️ 请手动创建GitHub仓库:
echo 1. 访问: https://github.com/new
echo 2. 仓库名: million-claw-website
echo 3. 选择: Public
echo 4. 不要初始化README、.gitignore或license
echo 5. 点击 Create repository
echo.
pause

echo.
echo 步骤4: 设置远程仓库
echo.
git remote remove origin 2>nul
git remote add origin https://github.com/%GIT_USER%/million-claw-website.git
echo ✅ 远程仓库设置完成

echo.
echo 步骤5: 推送代码
echo.
git add .
git commit -m "Initial commit: Million Claw website"
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ 推送失败！
    echo 请检查:
    echo 1. 仓库是否已创建
    echo 2. 网络连接
    echo 3. GitHub用户名和密码
    pause
    exit /b 1
)

echo.
echo ✅ 代码推送成功！

echo.
echo 步骤6: 配置GitHub Pages
echo.
echo ⚠️ 请手动配置GitHub Pages:
echo 1. 访问: https://github.com/%GIT_USER%/million-claw-website/settings/pages
echo 2. Source: Deploy from a branch
echo 3. Branch: main -> /(root)
echo 4. 点击 Save
echo.
echo 🌐 网站地址: https://%GIT_USER%.github.io/million-claw-website/
echo.

echo ========================================
echo 🎉 部署助手执行完成！
echo.
echo 请按照上面的步骤完成GitHub Pages配置
echo 网站将在1-2分钟后生效
echo ========================================
pause