# Million Claw 网站部署脚本
Write-Host "🦞 Million Claw 网站部署脚本" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. 检查当前目录状态
Write-Host "1. 🔍 检查当前目录状态..." -ForegroundColor Yellow
if (-not (Test-Path "index.html")) {
    Write-Host "❌ 错误: 当前目录没有找到 index.html" -ForegroundColor Red
    Write-Host "   请确保在正确的网站目录中运行此脚本"
    pause
    exit 1
}
Write-Host "✅ 找到网站文件: index.html" -ForegroundColor Green

# 2. 初始化Git仓库
Write-Host ""
Write-Host "2. 📁 初始化Git仓库..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "   初始化新的Git仓库..." -ForegroundColor Gray
    git init
    git add .
    git commit -m "Initial commit: Million Claw website"
    Write-Host "✅ Git仓库初始化完成" -ForegroundColor Green
} else {
    Write-Host "   Git仓库已存在，更新文件..." -ForegroundColor Gray
    git add .
    git commit -m "Update website files" -ErrorAction SilentlyContinue
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ℹ️ 没有新更改" -ForegroundColor Gray
    }
}

# 3. 检查远程仓库
Write-Host ""
Write-Host "3. 🔗 检查远程仓库..." -ForegroundColor Yellow
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "   ⚠️ 没有设置远程仓库" -ForegroundColor Yellow
    
    $githubUser = Read-Host "   请输入GitHub用户名"
    $repoName = "million-claw-website"
    $repoUrl = "https://github.com/$githubUser/$repoName.git"
    
    Write-Host ""
    Write-Host "   📝 远程仓库信息:" -ForegroundColor Gray
    Write-Host "     用户名: $githubUser"
    Write-Host "     仓库名: $repoName"
    Write-Host "     URL: $repoUrl"
    Write-Host ""
    Write-Host "   ⚠️ 重要: 请先创建GitHub仓库" -ForegroundColor Yellow
    Write-Host "     1. 访问: https://github.com/new"
    Write-Host "     2. 仓库名: $repoName"
    Write-Host "     3. 选择: Public"
    Write-Host "     4. 不要初始化README、.gitignore或license"
    Write-Host "     5. 点击 Create repository"
    Write-Host ""
    pause
    
    git remote add origin $repoUrl
    Write-Host "✅ 远程仓库设置完成" -ForegroundColor Green
} else {
    Write-Host "   远程仓库: $remoteUrl" -ForegroundColor Gray
    Write-Host "✅ 远程仓库已配置" -ForegroundColor Green
}

# 4. 推送代码到GitHub
Write-Host ""
Write-Host "4. 🚀 推送代码到GitHub..." -ForegroundColor Yellow
Write-Host "   分支: main" -ForegroundColor Gray
git push -u origin main --force

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ 推送失败！" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 可能的原因:" -ForegroundColor Yellow
    Write-Host "   1. GitHub仓库不存在 (需要先创建)"
    Write-Host "   2. 网络连接问题"
    Write-Host "   3. 权限不足"
    Write-Host ""
    Write-Host "🔗 创建仓库: https://github.com/new"
    Write-Host "📝 仓库名: million-claw-website"
    Write-Host ""
    pause
    exit 1
}

Write-Host ""
Write-Host "✅ 代码推送成功！" -ForegroundColor Green

# 5. 配置指南
Write-Host ""
Write-Host "5. 🌐 配置GitHub Pages指南..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   ⚠️ 需要手动配置GitHub Pages:" -ForegroundColor Yellow
Write-Host "     1. 访问: https://github.com/$githubUser/million-claw-website/settings/pages"
Write-Host "     2. Source: Deploy from a branch"
Write-Host "     3. Branch: main → /(root)"
Write-Host "     4. 点击 Save"
Write-Host ""
Write-Host "   📍 网站地址: https://$githubUser.github.io/million-claw-website/" -ForegroundColor Cyan
Write-Host ""
Write-Host "   ⏱️ 部署需要1-2分钟生效" -ForegroundColor Gray

# 6. 创建部署指南
Write-Host ""
Write-Host "6. 📋 创建部署指南..." -ForegroundColor Yellow
$guideContent = @"
# Million Claw 网站部署指南

## 🌐 网站地址
https://$githubUser.github.io/million-claw-website/

## ⚙️ GitHub Pages 配置步骤
1. 访问仓库设置: https://github.com/$githubUser/million-claw-website/settings
2. 左侧菜单点击 "Pages"
3. 在 "Source" 部分:
   - 选择 "Deploy from a branch"
   - Branch: main
   - Folder: / (root)
4. 点击 "Save"

## 🔄 更新网站
要更新网站内容:
1. 修改文件
2. 运行: git add .
3. 运行: git commit -m "更新描述"
4. 运行: git push

## 📞 技术支持
如有问题，请检查:
1. GitHub Pages状态: https://githubstatus.com/
2. 仓库是否为公开 (Public)
3. 等待1-2分钟部署生效
"@

$guideContent | Out-File -FilePath "部署指南.md" -Encoding UTF8
Write-Host "✅ 创建部署指南: 部署指南.md" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "🎉 部署脚本执行完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📋 下一步:" -ForegroundColor Yellow
Write-Host "   1. 创建GitHub仓库 (如果还没创建)"
Write-Host "   2. 配置GitHub Pages"
Write-Host "   3. 访问网站确认"
Write-Host ""
Write-Host "📄 详细指南请查看: 部署指南.md" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan