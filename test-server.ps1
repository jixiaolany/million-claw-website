# 简单的HTTP服务器测试
$port = 8080
$url = "http://localhost:$port/"

Write-Host "启动本地HTTP服务器..." -ForegroundColor Yellow
Write-Host "网站地址: $url" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Gray

# 创建简单的HTTP监听器
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)
$listener.Start()

Write-Host "服务器已启动!" -ForegroundColor Green

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $filePath = Join-Path $PWD.Path $request.Url.LocalPath.TrimStart('/')
        if ($filePath -eq $PWD.Path -or $filePath -like "*\clean-deploy") {
            $filePath = Join-Path $PWD.Path "index.html"
        }
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = Get-Content $filePath -Raw
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            Write-Host "服务文件: $($request.Url.LocalPath)" -ForegroundColor Gray
        } else {
            $notFound = "<h1>404 - 文件未找到</h1><p>请求的文件: $($request.Url.LocalPath)</p>"
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFound)
            $response.StatusCode = 404
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            Write-Host "404: $($request.Url.LocalPath)" -ForegroundColor Red
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "服务器已停止" -ForegroundColor Yellow
}