@echo off
chcp 65001 >nul
echo.
echo 🦞 Million Claw 网站推送脚本
echo ================================
echo.
echo 请先完成以下步骤：
echo.
echo 1. 🌐 打开浏览器访问：https://github.com/new
echo 2. 📝 填写仓库信息：
echo     Repository name: million-claw-website
echo     Description: Million Claw - 完全复刻EasyClaw的AI助手部署平台
echo     Public: ✅ 选择公开
echo     Initialize: ☐ 不要勾选任何选项
echo 3. 🚀 点击：Create repository
echo.
echo 4. 🔗 创建完成后，复制仓库URL：
echo     格式：https://github.com/jixiaolany/million-claw-website.git
echo.
echo 5. 📋 按任意键继续推送...
pause >nul

echo.
echo 🚀 开始推送代码到GitHub...
echo.

REM 设置Git用户信息
git config user.email "646077175@qq.com"
git config user.name "jixiaolany"

REM 移除现有远程仓库（如果有）
git remote remove origin 2>nul

REM 添加新的远程仓库
set /p REPO_URL=请输入仓库URL（直接粘贴并按回车）：
git remote add origin "%REPO_URL%"

REM 推送代码
git branch -M main
git push -u origin main

echo.
echo ✅ 代码推送完成！
echo.
echo 🌐 接下来需要开启GitHub Pages：
echo 1. 打开仓库：%REPO_URL%
echo 2. 点击 Settings → Pages
echo 3. 设置：Source: Deploy from a branch
echo 4. 选择：Branch: main → /(root)
echo 5. 点击：Save
echo.
echo ⏰ 等待1-2分钟部署完成
echo 🔗 预计网站：https://jixiaolany.github.io/million-claw-website/
echo.
echo 按任意键退出...
pause >nul