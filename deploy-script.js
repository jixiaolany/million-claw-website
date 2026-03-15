// 一键部署脚本 - 生成部署包
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { execSync } = require('child_process');

console.log('🚀 Million Claw 一键部署脚本启动...');
console.log('================================\n');

// 配置
const CONFIG = {
  appName: 'Million Claw',
  version: '1.0.0',
  author: 'Million Claw Team',
  website: 'https://jixiaolany.github.io/your-app-website-githubpages/',
  outputDir: path.join(__dirname, 'deploy-packages'),
  templateDir: path.join(__dirname, 'deploy-templates')
};

// 确保目录存在
function ensureDirectories() {
  console.log('1. 📁 创建目录结构...');
  
  const dirs = [
    CONFIG.outputDir,
    CONFIG.templateDir,
    path.join(CONFIG.templateDir, 'backend'),
    path.join(CONFIG.templateDir, 'frontend'),
    path.join(CONFIG.templateDir, 'scripts'),
    path.join(CONFIG.templateDir, 'config')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   ✅ 创建目录: ${path.basename(dir)}`);
    }
  });
}

// 创建部署模板文件
function createTemplateFiles() {
  console.log('\n2. 📄 创建部署模板文件...');
  
  // 1. 主配置文件
  const configContent = `# Million Claw 配置文件
APP_NAME="${CONFIG.appName}"
VERSION="${CONFIG.version}"
AUTHOR="${CONFIG.author}"
WEBSITE="${CONFIG.website}"

# 数据库配置
DB_PATH="./data/million-claw.db"
DB_BACKUP_DIR="./backups"

# 服务器配置
SERVER_PORT=3000
API_PREFIX="/api/v1"

# 功能配置
ENABLE_AI_ASSISTANT=true
ENABLE_DATA_REPORTING=true
ENABLE_LOCAL_STORAGE=true
ENABLE_GITHUB_SYNC=true

# GitHub配置
GITHUB_USERNAME="jixiaolany"
GITHUB_TOKEN="your_token_here"
GITHUB_DATA_REPO="your-app-data"
GITHUB_CONFIG_REPO="your-app-config"

# 数据上报配置
REPORT_ENDPOINT="https://你的系统地址/api/receive"
REPORT_INTERVAL=3600  # 1小时
REPORT_MAX_RETRY=3

# 合规性检查
COMPLIANCE_ENABLED=true
DATA_RETENTION_DAYS=30
PRIVACY_POLICY_URL="${CONFIG.website}/privacy"
`;

  fs.writeFileSync(path.join(CONFIG.templateDir, 'config', '.env'), configContent);
  console.log('   ✅ 创建配置文件: .env');

  // 2. 启动脚本
  const startupScript = `@echo off
echo ========================================
echo      Million Claw AI助手平台
echo ========================================
echo.
echo 🚀 正在启动 Million Claw...
echo 📅 时间: %date% %time%
echo.

REM 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到Node.js，请先安装Node.js
    echo 💡 访问: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到npm
    pause
    exit /b 1
)

REM 安装依赖
echo 📦 安装依赖包...
call npm install

REM 创建数据目录
if not exist "data" mkdir data
if not exist "backups" mkdir backups

REM 启动服务器
echo 🚀 启动Million Claw服务器...
echo.
echo 📊 服务器信息:
echo    本地地址: http://localhost:3000
echo    前端地址: http://localhost:5173
echo    数据目录: ./data/
echo.
echo 💡 按 Ctrl+C 停止服务器
echo.

REM 启动后端服务器
start cmd /k "node backend/server.js"

REM 等待后端启动
timeout /t 3 /nobreak >nul

REM 启动前端开发服务器
start cmd /k "npm run dev"

echo.
echo ✅ Million Claw 启动成功！
echo 🔗 请在浏览器中打开: http://localhost:5173
echo.
pause
`;

  fs.writeFileSync(path.join(CONFIG.templateDir, 'scripts', 'start.bat'), startupScript, 'utf8');
  console.log('   ✅ 创建启动脚本: start.bat');

  // 3. 后端服务器文件
  const serverContent = `const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 确保数据目录存在
const dataDir = path.join(__dirname, '../data');
const backupsDir = path.join(__dirname, '../backups');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir, { recursive: true });

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: process.env.APP_NAME,
    version: process.env.VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 数据上报端点
app.post('/api/report', (req, res) => {
  try {
    const data = req.body;
    const timestamp = new Date().toISOString();
    
    // 保存到本地文件
    const reportFile = path.join(dataDir, \`report-\${timestamp.replace(/[:.]/g, '-')}.json\`);
    fs.writeFileSync(reportFile, JSON.stringify({
      ...data,
      timestamp,
      source: 'million-claw'
    }, null, 2));
    
    console.log(\`📊 数据上报保存: \${reportFile}\`);
    
    res.json({
      success: true,
      message: '数据上报成功',
      timestamp,
      file: path.basename(reportFile)
    });
  } catch (error) {
    console.error('❌ 数据上报失败:', error);
    res.status(500).json({
      success: false,
      message: '数据上报失败',
      error: error.message
    });
  }
});

// 获取统计数据
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      app: process.env.APP_NAME,
      version: process.env.VERSION,
      dataFiles: fs.readdirSync(dataDir).length,
      backupFiles: fs.readdirSync(backupsDir).length,
      serverUptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(\`🚀 Million Claw 服务器启动成功！\`);
  console.log(\`📡 本地地址: http://localhost:\${PORT}\`);
  console.log(\`🏷️ 应用名称: \${process.env.APP_NAME}\`);
  console.log(\`📦 版本: \${process.env.VERSION}\`);
  console.log(\`📁 数据目录: \${dataDir}\`);
  console.log(\`💾 备份目录: \${backupsDir}\`);
  console.log(\`================================\`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\\n🛑 收到关闭信号，正在停止服务器...');
  process.exit(0);
});

module.exports = app;
`;

  fs.writeFileSync(path.join(CONFIG.templateDir, 'backend', 'server.js'), serverContent);
  console.log('   ✅ 创建后端服务器: server.js');

  // 4. package.json
  const packageJson = {
    name: "million-claw",
    version: "1.0.0",
    description: "Million Claw AI助手平台 - 本地化AI助手部署解决方案",
    main: "backend/server.js",
    scripts: {
      "start": "node backend/server.js",
      "dev": "vite frontend/",
      "build": "vite build frontend/",
      "preview": "vite preview frontend/",
      "backup": "node scripts/backup.js",
      "report": "node scripts/data-report.js"
    },
    dependencies: {
      "express": "^4.18.2",
      "cors": "^2.8.5",
      "dotenv": "^16.3.1",
      "sqlite3": "^5.1.6",
      "axios": "^1.6.0",
      "winston": "^3.11.0"
    },
    devDependencies: {
      "vite": "^5.0.0",
      "@vitejs/plugin-vue": "^4.5.0",
      "vue": "^3.3.0"
    },
    keywords: ["ai-assistant", "local-ai", "million-claw", "privacy", "data-security"],
    author: "Million Claw Team",
    license: "MIT",
    repository: {
      type: "git",
      url: "https://github.com/jixiaolany/your-app-website-githubpages"
    },
    homepage: "https://jixiaolany.github.io/your-app-website-githubpages/"
  };

  fs.writeFileSync(
    path.join(CONFIG.templateDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log('   ✅ 创建package.json');

  // 5. 前端入口文件
  const frontendHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Million Claw - AI助手控制台</title>
    <style>
        :root {
            --primary: #409EFF;
            --secondary: #67C23A;
            --dark: #303133;
            --light: #F5F7FA;
        }
        
        body {
            font-family: 'Microsoft YaHei', 'Segoe UI', sans-serif;
            background: #f8f9fa;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 40px 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .card {
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
        }
        
        .card h3 {
            color: var(--primary);
            margin-bottom: 15px;
            font-size: 1.3rem;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }
        
        .stat-item {
            text-align: center;
            padding: 15px;
            background: var(--light);
            border-radius: 8px;
        }
        
        .stat-value {
            font-size: 1.8rem;
            font-weight: bold;
            color: var(--primary);
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: #666;
            margin-top: 5px;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.3s;
        }
        
        .btn:hover {
            background: #337ecc;
        }
        
        .btn-success {
            background: var(--secondary);
        }
        
        .btn-success:hover {
            background: #5daf34;
        }
        
        .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-online {
            background: var(--secondary);
        }
        
        .status-offline {
            background: #F56C6C;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Million Claw AI助手控制台</h1>
            <p>本地化AI助手管理平台 · 数据安全 · 隐私保护</p>
        </div>
        
        <div class="dashboard">
            <div class="card">
                <h3>系统状态</h3>
                <div class="stats">
                    <div class="stat-item">
                        <div class="stat-value" id="serverStatus">检查中...</div>
                        <div class="stat-label">服务器状态</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="dataFiles">0</div>
                        <div class="stat-label">数据文件</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="uptime">0s</div>
                        <div class="stat-label">运行时间</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value" id="memory">0 MB</div>
                        <div class="stat-label">内存使用</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3>快速操作</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button class="btn" onclick="testConnection()">测试服务器连接</button>
                    <button class="btn" onclick="sendTestReport()">发送测试数据</button>
                    <button class="btn btn-success" onclick="openConfig()">打开配置文件</button>
                    <button class="btn" onclick="backupData()">备份数据</button>
                </div>
            </div>
            
            <div class="card">
                <h3>系统信息</h3>
                <div id="systemInfo">
                    <p>正在加载系统信息...</p>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 40px;">
            <p>© 2026 Million Claw Team. 所有数据保存在本地设备。</p>
            <p>版本: <span id="appVersion">1.0.0</span> | 
                <a href="https://jixiaolany.github.io/your-app-website-githubpages/" target="_blank">官方网站</a> | 
                <a href="#" onclick="showPrivacy()">隐私政策</a>
            </p>
        </div>
    </div>

    <script>
        // 获取系统信息
        async function loadSystemInfo() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                
                document.getElementById('serverStatus').innerHTML = 
                    \`<span class="status-indicator status-online"></span>在线\`;
                document.getElementById('uptime').textContent = Math.floor(data.uptime) + 's';
                document.getElementById('appVersion').textContent = data.version;
                
                // 获取统计数据
                const statsResponse = await fetch('/api/stats');
                const stats = await statsResponse.json();
                
                document.getElementById('dataFiles').textContent = stats.dataFiles;
                const memoryMB = (stats.memoryUsage.heapUsed / 1024 / 1024).toFixed(1);
                document.getElementById('memory').textContent = memoryMB + ' MB';
                
                // 显示系统信息
                document.getElementById('systemInfo').innerHTML = \`
                    <p><strong>应用名称:</strong> \${data.app}</p>
                    <p><strong>版本:</strong> \${data.version}</p>
                    <p><strong>启动时间:</strong> \${new Date(data.timestamp).toLocaleString()}</p>
                    <p><strong>数据文件:</strong> \${stats.dataFiles} 个</p>
                    <p><strong>备份文件:</strong> \${stats.backupFiles} 个</p>
                \`;
            } catch (error) {
                document.getElementById('serverStatus').