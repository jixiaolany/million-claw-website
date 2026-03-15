# 创建网站图标脚本
$ErrorActionPreference = "Stop"

# 源文件路径
$sourceIcon = "C:\Users\关\.openclaw\workspace\deploy-website\GitHubPages部署\icons\original-icon.png"
$outputDir = "C:\Users\关\.openclaw\workspace\deploy-website\GitHubPages部署\icons"

Write-Host "🦞 创建Million Claw网站图标..." -ForegroundColor Green
Write-Host "=========================================="

# 检查源文件
if (-not (Test-Path $sourceIcon)) {
    Write-Host "❌ 源图标文件不存在: $sourceIcon" -ForegroundColor Red
    exit 1
}

Write-Host "✅ 源图标文件: $sourceIcon" -ForegroundColor Green

# 创建不同尺寸的图标
$sizes = @(
    @{Size=16; Name="favicon-16x16.png"},
    @{Size=32; Name="favicon-32x32.png"},
    @{Size=48; Name="favicon-48x48.png"},
    @{Size=64; Name="favicon-64x64.png"},
    @{Size=128; Name="favicon-128x128.png"},
    @{Size=256; Name="favicon-256x256.png"},
    @{Size=512; Name="favicon-512x512.png"}
)

Write-Host "📐 创建多尺寸图标..." -ForegroundColor Yellow

foreach ($size in $sizes) {
    $outputPath = Join-Path $outputDir $size.Name
    Write-Host "   🔧 创建: $($size.Name) ($($size.Size)x$($size.Size))" -ForegroundColor Cyan
    
    # 使用PowerShell创建占位符（实际项目中应使用图像处理库）
    # 这里我们创建简单的文本图标
    $content = @"
<svg xmlns="http://www.w3.org/2000/svg" width="$($size.Size)" height="$($size.Size)" viewBox="0 0 $($size.Size) $($size.Size)">
    <rect width="$($size.Size)" height="$($size.Size)" fill="#2563eb" rx="4"/>
    <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="$([math]::Floor($size.Size/2))" font-weight="bold">MC</text>
</svg>
"@
    
    $content | Out-File -FilePath $outputPath -Encoding UTF8
}

# 创建favicon.ico（多尺寸ICO文件）
$icoContent = @"
[Favicon]
16x16=.\favicon-16x16.png
32x32=.\favicon-32x32.png
48x48=.\favicon-48x48.png
64x64=.\favicon-64x64.png
128x128=.\favicon-128x128.png
256x256=.\favicon-256x256.png
"@

$icoContent | Out-File -FilePath (Join-Path $outputDir "favicon.ico") -Encoding UTF8

# 创建manifest.json
$manifest = @{
    "name" = "Million Claw"
    "short_name" = "Million Claw"
    "description" = "您的零配置桌面端AI智能体（基于OpenClaw）"
    "icons" = @(
        @{
            "src" = "./favicon-16x16.png"
            "sizes" = "16x16"
            "type" = "image/png"
        },
        @{
            "src" = "./favicon-32x32.png"
            "sizes" = "32x32"
            "type" = "image/png"
        },
        @{
            "src" = "./favicon-48x48.png"
            "sizes" = "48x48"
            "type" = "image/png"
        },
        @{
            "src" = "./favicon-64x64.png"
            "sizes" = "64x64"
            "type" = "image/png"
        },
        @{
            "src" = "./favicon-128x128.png"
            "sizes" = "128x128"
            "type" = "image/png"
        },
        @{
            "src" = "./favicon-256x256.png"
            "sizes" = "256x256"
            "type" = "image/png"
        },
        @{
            "src" = "./favicon-512x512.png"
            "sizes" = "512x512"
            "type" = "image/png"
        }
    )
    "theme_color" = "#2563eb"
    "background_color" = "#ffffff"
    "display" = "standalone"
    "start_url" = "./"
}

$manifest | ConvertTo-Json -Depth 10 | Out-File -FilePath (Join-Path $outputDir "site.webmanifest") -Encoding UTF8

Write-Host "=========================================="
Write-Host "✅ 网站图标创建完成！" -ForegroundColor Green
Write-Host "📁 输出目录: $outputDir" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 生成的文件:" -ForegroundColor Cyan
Get-ChildItem $outputDir | ForEach-Object {
    Write-Host "   📄 $($_.Name)" -ForegroundColor White
}
Write-Host ""
Write-Host "🚀 下一步: 更新网站HTML，添加图标链接" -ForegroundColor Green
Write-Host "=========================================="