// 创建Million Claw部署包ZIP
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

console.log('🚀 创建Million Claw部署包...');
console.log('================================\n');

// 配置
const CONFIG = {
  appName: 'Million Claw',
  version: '1.0.0',
  windowsZip: 'Million-Claw-Windows-Deployment.zip',
  macosZip: 'Million-Claw-macOS-Deployment.zip',
  sourceDir: __dirname
};

// 创建Windows部署包
function createWindowsPackage() {
  return new Promise((resolve, reject) => {
    console.log('1. 🪟 创建Windows部署包...');
    
    const output = fs.createWriteStream(path.join(CONFIG.sourceDir, CONFIG.windowsZip));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const size = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`   ✅ Windows部署包创建完成: ${size} MB`);
      resolve(size);
    });

    archive.on('error', reject);
    archive.pipe(output);

    // 添加Windows安装文件
    const windowsFiles = [
      'Million-Claw-Windows-Installer.bat',
      'index.html',
      'README-Windows.md'
    ];

    // 创建Windows README
    const windowsReadme = `# Million Claw Windows 部署指南

## 🚀 快速开始

### 系统要求
- Windows 10/11 (64位)
- 4GB RAM 或更高
- 2GB 可用磁盘空间
- 管理员权限

### 安装步骤

1. **下载部署包**
   下载 \`Million-Claw-Windows-Deployment.zip\` 并解压

2. **运行安装程序**
   右键点击 \`Million-Claw-Windows-Installer.bat\`
   选择"以管理员身份运行"

3. **完成安装**
   按照提示完成安装过程

4. **启动应用**
   双击桌面"Million Claw"图标
   或在开始菜单中搜索"Million Claw"

### 📋 功能特性

#### 核心功能
- ✅ 零配置AI助手
- ✅ 本地数据安全
- ✅ 自动化工作流
- ✅ 多平台协同

#### 技术特性
- 基于OpenClaw框架
- Node.js后端
- 现代化前端界面
- SQLite本地数据库

### 🔐 安全与隐私

#### 数据安全
- 所有数据保存在本地
- 无需上传到云端
- 端到端加密
- 隐私合规设计

#### 权限控制
- 需要管理员权限安装
- 沙盒运行环境
- 系统级安全保护

### 💰 付费模式

#### 使用要求
1. **邀请码** (由管理员发放)
2. **付费订阅** (专业版¥199/月)

#### 付费功能
- 无限制AI功能
- 高级自动化
- 优先技术支持
- 团队协作工具

### 🆘 技术支持

#### 常见问题
**Q: 安装时提示权限不足**
A: 请右键点击安装程序，选择"以管理员身份运行"

**Q: 启动时提示Node.js未安装**
A: 请先安装Node.js: https://nodejs.org/

**Q: 如何获取邀请码？**
A: 联系管理员或选择付费版本

**Q: 如何卸载？**
A: 控制面板 -> 程序和功能 -> Million Claw

#### 联系方式
- 官方网站: https://jixiaolany.github.io/your-app-website-githubpages/
- 技术支持: support@millionclaw.com
- 商务合作: sales@millionclaw.com

### 📄 许可证

Million Claw 基于 OpenClaw 框架构建，遵循相应的开源协议。

### ⚖️ 法律声明

使用 Million Claw 即表示您同意我们的服务条款和隐私政策。

---

© 2026 Million Claw Team. 保留所有权利。
`;

    archive.append(windowsReadme, { name: 'README-Windows.md' });

    windowsFiles.forEach(file => {
      const filePath = path.join(CONFIG.sourceDir, file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
        console.log(`   ✅ 添加: ${file}`);
      }
    });

    // 添加示例配置文件
    const sampleConfig = `# Million Claw 配置文件
APP_NAME="Million Claw"
VERSION="1.0.0"
SERVER_PORT=3000
ENABLE_AI_ASSISTANT=true
REQUIRE_INVITE_CODE=true
`;

    archive.append(sampleConfig, { name: 'config/.env.sample' });
    console.log('   ✅ 添加示例配置文件');

    archive.finalize();
  });
}

// 创建macOS部署包
function createMacOSPackage() {
  return new Promise((resolve, reject) => {
    console.log('\n2. 🍎 创建macOS部署包...');
    
    const output = fs.createWriteStream(path.join(CONFIG.sourceDir, CONFIG.macosZip));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const size = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`   ✅ macOS部署包创建完成: ${size} MB`);
      resolve(size);
    });

    archive.on('error', reject);
    archive.pipe(output);

    // 添加macOS安装文件
    const macFiles = [
      'Million-Claw-macOS-Installer.sh',
      'index.html',
      'README-macOS.md'
    ];

    // 创建macOS README
    const macReadme = `# Million Claw macOS 部署指南

## 🚀 快速开始

### 系统要求
- macOS 10.15 (Catalina) 或更高
- 4GB RAM 或更高
- 2GB 可用磁盘空间
- 管理员权限

### 安装步骤

1. **下载部署包**
   下载 \`Million-Claw-macOS-Deployment.zip\` 并解压

2. **运行安装程序**
   打开终端，进入解压目录
   运行: \`sudo bash Million-Claw-macOS-Installer.sh\`

3. **完成安装**
   按照提示完成安装过程

4. **启动应用**
   在应用程序中点击"Million Claw"
   或通过终端运行

### 📋 功能特性

#### 核心功能
- ✅ 原生macOS体验
- ✅ 零配置AI助手
- ✅ 本地数据安全
- ✅ 自动化工作流

#### 技术特性
- 基于OpenClaw框架
- Node.js后端
- 现代化前端界面
- SQLite本地数据库

### 🔐 安全与隐私

#### 数据安全
- 所有数据保存在本地
- 无需上传到云端
- 端到端加密
- 隐私合规设计

#### 权限控制
- 需要sudo权限安装
- 沙盒运行环境
- Gatekeeper兼容

### 💰 付费模式

#### 使用要求
1. **邀请码** (由管理员发放)
2. **付费订阅** (专业版¥199/月)

#### 付费功能
- 无限制AI功能
- 高级自动化
- 优先技术支持
- 团队协作工具

### 🆘 技术支持

#### 常见问题
**Q: 安装时提示权限被拒绝**
A: 请使用sudo运行安装脚本

**Q: 启动时提示"无法打开，因为无法验证开发者"**
A: 前往 系统偏好设置 -> 安全性与隐私 -> 通用，点击"仍要打开"

**Q: 如何获取邀请码？**
A: 联系管理员或选择付费版本

**Q: 如何卸载？**
A: 运行: \`sudo uninstall-millionclaw\`

#### 联系方式
- 官方网站: https://jixiaolany.github.io/your-app-website-githubpages/
- 技术支持: support@millionclaw.com
- 商务合作: sales@millionclaw.com

### 📄 许可证

Million Claw 基于 OpenClaw 框架构建，遵循相应的开源协议。

### ⚖️ 法律声明

使用 Million Claw 即表示您同意我们的服务条款和隐私政策。

---

© 2026 Million Claw Team. 保留所有权利。
`;

    archive.append(macReadme, { name: 'README-macOS.md' });

    macFiles.forEach(file => {
      const filePath = path.join(CONFIG.sourceDir, file);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: file });
        console.log(`   ✅ 添加: ${file}`);
      }
    });

    // 添加macOS特定文件
    const macPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>com.millionclaw.installer</string>
    <key>CFBundleName</key>
    <string>Million Claw Installer</string>
</dict>
</plist>`;

    archive.append(macPlist, { name: 'Installer-Info.plist' });
    console.log('   ✅ 添加macOS配置文件');

    archive.finalize();
  });
}

// 主函数
async function main() {
  try {
    console.log('================================');
    console.log('🦞 Million Claw 多平台部署包生成');
    console.log('================================\n');
    
    console.log('📊 配置信息:');
    console.log(`   应用名称: ${CONFIG.appName}`);
    console.log(`   版本: ${CONFIG.version}`);
    console.log(`   Windows包: ${CONFIG.windowsZip}`);
    console.log(`   macOS包: ${CONFIG.macosZip}`);
    console.log('');
    
    // 创建Windows包
    const windowsSize = await createWindowsPackage();
    
    // 创建macOS包
    const macosSize = await createMacOSPackage();
    
    console.log('\n================================');
    console.log('🎉 部署包生成完成！');
    console.log('================================');
    console.log('📦 生成的文件:');
    console.log(`   1. ${CONFIG.windowsZip} (${windowsSize} MB)`);
    console.log(`   2. ${CONFIG.macosZip} (${macosSize} MB)`);
    console.log('');
    console.log('🚀 下一步操作:');
    console.log('   1. 将这两个ZIP文件上传到网站');
    console.log('   2. 修改网站下载链接指向这些文件');
    console.log('   3. 测试下载和安装流程');
    console.log('');
    console.log('💡 网站需要更新:');
    console.log('   - Windows下载按钮指向: ./${CONFIG.windowsZip}');
    console.log('   - macOS下载按钮指向: ./${CONFIG.macosZip}');
    console.log('   - 确保邀请码/付费验证正常工作');
    console.log('================================');
    
  } catch (error) {
    console.error('❌ 创建部署包失败:', error.message);
  }
}

// 执行
if (require.main === module) {
  main().catch(console.error);
}