# 创建GitHub仓库的脚本
Write-Host "🔄 尝试创建GitHub仓库..." -ForegroundColor Yellow

# 需要GitHub Personal Access Token
$token = Read-Host "请输入GitHub Personal Access Token (需要repo权限)" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
$plainToken = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

$username = "jixiaolany"  # GitHub用户名
$repoName = "million-claw-website"

$headers = @{
    "Authorization" = "token $plainToken"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    name = $repoName
    description = "Million Claw product website"
    private = $false
    auto_init = $false
} | ConvertTo-Json

try {
    Write-Host "正在创建仓库: $repoName..." -ForegroundColor Gray
    $response = Invoke-WebRequest -Uri "https://api.github.com/user/repos" `
        -Method POST `
        -Headers $headers `
        -Body $body `
        -ContentType "application/json"
    
    Write-Host "✅ GitHub仓库创建成功!" -ForegroundColor Green
    Write-Host "仓库URL: https://github.com/$username/$repoName" -ForegroundColor Cyan
    
    # 设置远程仓库
    Write-Host "设置远程仓库..." -ForegroundColor Gray
    git remote remove origin 2>$null
    git remote add origin "https://github.com/$username/$repoName.git"
    
    # 推送代码
    Write-Host "推送代码到GitHub..." -ForegroundColor Gray
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 代码推送成功!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 下一步: 配置GitHub Pages" -ForegroundColor Yellow
        Write-Host "1. 访问: https://github.com/$username/$repoName/settings/pages"
        Write-Host "2. Source: Deploy from a branch"
        Write-Host "3. Branch: main → /(root)"
        Write-Host "4. 点击 Save"
        Write-Host ""
        Write-Host "📍 网站地址: https://$username.github.io/$repoName/" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "❌ 创建仓库失败: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 请手动创建仓库:" -ForegroundColor Yellow
    Write-Host "1. 访问: https://github.com/new"
    Write-Host "2. 仓库名: $repoName"
    Write-Host "3. 选择: Public"
    Write-Host "4. 不要初始化README/.gitignore/license"
}

# 清理token
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)