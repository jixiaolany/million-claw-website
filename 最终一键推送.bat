@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🦞 Million Claw 网站最终一键推送脚本
echo ========================================
echo.
echo 📱 基于抖音视频指南：OpenClaw安装完必做！
echo 💰 养虾新手避坑省钱指南
echo.
echo 🔗 参考视频：https://v.douyin.com/k1HDlxcInVM/
echo ========================================
echo.

REM 检查Git配置
echo 1. 🔧 检查Git配置...
git config user.email "646077175@qq.com"
git config user.name "jixiaolany"
echo    ✅ Git用户配置完成
echo.

REM 显示当前状态
echo 2. 📊 显示当前Git状态...
git status --short
echo.

REM 显示提交历史
echo 3. 📝 显示最近提交...
git log --oneline -3
echo.

REM 检查远程仓库
echo 4. 🔗 检查远程仓库配置...
git remote -v
echo.

echo ========================================
echo 🚀 推送步骤说明
echo ========================================
echo.
echo 请按顺序完成以下步骤：
echo.
echo 步骤1：创建GitHub仓库
echo   1. 打开浏览器访问：https://github.com/new
echo   2. 填写仓库信息：
echo      Repository name: million-claw-website
echo      Description: Million Claw - 完全复刻EasyClaw的AI助手部署平台
echo      Public: ✅ 选择公开
echo      Initialize: ☐ 不要勾选任何选项
echo   3. 点击：Create repository
echo.
echo 步骤2：获取仓库URL
echo   创建完成后，复制仓库URL：
echo   格式：https://github.com/jixiaolany/million-claw-website.git
echo.
echo 步骤3：配置远程仓库
echo   按任意键继续配置远程仓库...
pause >nul
echo.

:configure_repo
echo 请输入GitHub仓库URL（直接粘贴并按回车）：
set /p REPO_URL=
if "%REPO_URL%"=="" (
    echo ❌ 请输入有效的仓库URL
    goto configure_repo
)

echo.
echo 5. 🔗 配置远程仓库...
git remote remove origin 2>nul
git remote add origin "%REPO_URL%"
echo    ✅ 远程仓库配置完成：%REPO_URL%
echo.

echo 6. 🚀 推送代码到GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 代码推送成功！
    echo.
    echo ========================================
    echo 🌐 下一步：开启GitHub Pages
    echo ========================================
    echo.
    echo 1. 打开仓库：%REPO_URL%
    echo 2. 点击 Settings → Pages
    echo 3. 设置：Source: Deploy from a branch
    echo 4. 选择：Branch: main → /(root)
    echo 5. 点击：Save
    echo.
    echo ⏰ 等待1-2分钟部署完成
    echo 🔗 预计网站：https://jixiaolany.github.io/million-claw-website/
    echo.
    echo 💡 省钱技巧：GitHub Pages完全免费！
    echo 🕳️ 避坑指南：确保仓库为公开状态
    echo.
) else (
    echo.
    echo ❌ 推送失败，请检查：
    echo   1. 网络连接
    echo   2. GitHub权限
    echo   3. 仓库URL是否正确
    echo.
)

echo ========================================
echo 🦞 基于抖音视频指南的完整流程
echo ========================================
echo ✅ 前端完全复刻EasyClaw
echo ✅ 包含完整功能实现计划
echo ✅ 集成后端API框架设计
echo ✅ 提供省钱技巧和避坑指南
echo ========================================
echo.
echo 按任意键退出...
pause >nul