// 修复网站下载功能
const fs = require('fs');
const path = require('path');

const htmlFile = path.join(__dirname, 'index.html');

console.log('🔧 修复网站下载功能...');
console.log('📁 文件:', htmlFile);

// 读取HTML文件
let html = fs.readFileSync(htmlFile, 'utf8');

// 修复1: 下载按钮直接链接到ZIP文件
html = html.replace(
  /<a href="#" class="download-btn" id="windows-download">/g,
  '<a href="./Million-Claw-Windows-Deployment.zip" class="download-btn" id="windows-download" download="Million-Claw-Windows-Deployment.zip">'
);

html = html.replace(
  /<a href="#" class="download-btn" id="mac-download">/g,
  '<a href="./Million-Claw-macOS-Deployment.zip" class="download-btn" id="mac-download" download="Million-Claw-macOS-Deployment.zip">'
);

// 修复2: 修改startDownload函数
const startDownloadPattern = /\/\/ 开始下载[\s\S]*?function startDownload\(platform, inviteCode\) \{[\s\S]*?\}/;
const newStartDownload = `        // 开始下载
        function startDownload(platform, inviteCode) {
            alert(\`✅ 邀请码验证成功！\\n\\n开始下载 \${platform === 'windows' ? 'Windows' : 'macOS'} 版本...\\n邀请码: \${inviteCode}\`);
            
            // 触发实际下载
            const downloadUrl = platform === 'windows' 
                ? './Million-Claw-Windows-Deployment.zip'
                : './Million-Claw-macOS-Deployment.zip';
            
            // 创建下载链接
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = downloadUrl.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // 显示安装指南
            setTimeout(() => {
                showInstallationGuide(platform);
            }, 1000);
            
            // 记录下载（在实际应用中应该发送到服务器）
            console.log(\`Download started: \${platform}, inviteCode: \${inviteCode}, timestamp: \${new Date().toISOString()}\`);
        }`;

html = html.replace(startDownloadPattern, newStartDownload);

// 修复3: 移除simulateDownload函数（不再需要）
const simulateDownloadPattern = /\/\/ 模拟下载[\s\S]*?function simulateDownload\(platform\) \{[\s\S]*?\}/g;
html = html.replace(simulateDownloadPattern, '');

// 修复4: 确保下载按钮事件监听器正确
const eventListenerPattern = /document\.getElementById\('windows-download'\)\.addEventListener\('click', function\(e\) \{[\s\S]*?checkInviteCode\('windows'\);\s*\}\);/;
const newEventListener = `        // 下载按钮点击处理 - 需要邀请码验证
        document.getElementById('windows-download').addEventListener('click', function(e) {
            const inviteCode = document.getElementById('invite-code').value.trim();
            
            if (!inviteCode) {
                e.preventDefault();
                alert('需要邀请码或付费使用。\\n\\n如果没有邀请码，请选择付费版本。');
                showPricingModal();
                return;
            }
            
            // 检查邀请码
            if (!VALID_INVITE_CODES.includes(inviteCode.toUpperCase())) {
                e.preventDefault();
                alert('邀请码无效或已过期。\\n\\n请检查邀请码或选择付费版本。');
                showPricingModal();
            }
            // 如果邀请码有效，允许默认下载行为继续
        });
        
        document.getElementById('mac-download').addEventListener('click', function(e) {
            const inviteCode = document.getElementById('invite-code').value.trim();
            
            if (!inviteCode) {
                e.preventDefault();
                alert('需要邀请码或付费使用。\\n\\n如果没有邀请码，请选择付费版本。');
                showPricingModal();
                return;
            }
            
            // 检查邀请码
            if (!VALID_INVITE_CODES.includes(inviteCode.toUpperCase())) {
                e.preventDefault();
                alert('邀请码无效或已过期。\\n\\n请检查邀请码或选择付费版本。');
                showPricingModal();
            }
            // 如果邀请码有效，允许默认下载行为继续
        });`;

html = html.replace(eventListenerPattern, newEventListener);

// 保存修改
fs.writeFileSync(htmlFile, html, 'utf8');

console.log('✅ 网站下载功能修复完成！');
console.log('');
console.log('📊 修复内容:');
console.log('   1. ✅ 下载按钮直接链接到ZIP文件');
console.log('   2. ✅ 修复startDownload函数');
console.log('   3. ✅ 移除模拟下载函数');
console.log('   4. ✅ 修复事件监听器逻辑');
console.log('');
console.log('🚀 现在用户可以:');
console.log('   1. 输入有效邀请码 → 直接下载');
console.log('   2. 没有邀请码 → 显示付费选项');
console.log('   3. 无效邀请码 → 显示付费选项');
console.log('');
console.log('💡 邀请码列表:');
console.log('   - MILLION2026');
console.log('   - CLAWPRO');
console.log('   - OPENAI2026');
console.log('   - BETA-TESTER');