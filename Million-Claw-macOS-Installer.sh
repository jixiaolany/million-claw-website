#!/bin/bash

echo "========================================"
echo "     Million Claw macOS 安装程序"
echo "========================================"
echo ""
echo "🚀 正在安装 Million Claw..."
echo "📅 时间: $(date)"
echo ""

# 检查是否以root运行
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️ 需要管理员权限"
    echo "💡 请使用: sudo bash $0"
    exit 1
fi

echo "✅ 管理员权限确认"
echo ""

# 创建安装目录
INSTALL_DIR="/Applications/MillionClaw.app"
echo "📁 创建安装目录: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR/Contents/MacOS"
mkdir -p "$INSTALL_DIR/Contents/Resources"

# 复制文件
echo "📦 复制文件..."
cp -r "$(dirname "$0")/"* "$INSTALL_DIR/Contents/Resources/" 2>/dev/null || true

# 创建启动脚本
echo "📋 创建启动脚本..."
cat > "$INSTALL_DIR/Contents/MacOS/MillionClaw" << 'EOF'
#!/bin/bash

# Million Claw 启动脚本
echo "========================================"
echo "     Million Claw AI助手平台"
echo "========================================"
echo ""
echo "🚀 正在启动 Million Claw..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到Node.js"
    echo "💡 请先安装Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ 检测到Node.js"

# 安装依赖
echo "📦 正在安装依赖..."
cd "$(dirname "$0")/../Resources"
npm install --silent

# 创建数据目录
mkdir -p data
mkdir -p backups

# 启动服务器
echo "🚀 启动服务器..."
echo "📡 本地地址: http://localhost:3000"
echo "🌐 前端地址: http://localhost:5173"
echo ""

# 启动后端
node backend/server.js &
SERVER_PID=$!

# 等待后端启动
sleep 3

# 启动前端
npm run dev &
FRONTEND_PID=$!

# 等待用户中断
echo "💡 按 Ctrl+C 停止服务器"
echo ""
trap 'kill $SERVER_PID $FRONTEND_PID; exit' INT
wait
EOF

chmod +x "$INSTALL_DIR/Contents/MacOS/MillionClaw"

# 创建Info.plist
echo "📄 创建应用配置..."
cat > "$INSTALL_DIR/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>Million Claw</string>
    <key>CFBundleExecutable</key>
    <string>MillionClaw</string>
    <key>CFBundleIdentifier</key>
    <string>com.millionclaw.app</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>NSHumanReadableCopyright</key>
    <string>© 2026 Million Claw Team. All rights reserved.</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
    <key>NSPrincipalClass</key>
    <string>NSApplication</string>
</dict>
</plist>
EOF

# 创建卸载脚本
echo "🗑️ 创建卸载脚本..."
cat > "/usr/local/bin/uninstall-millionclaw" << 'EOF'
#!/bin/bash

echo "正在卸载 Million Claw..."
echo ""

# 停止相关进程
pkill -f "MillionClaw" 2>/dev/null
pkill -f "node.*server.js" 2>/dev/null

# 删除应用
echo "删除应用文件..."
rm -rf "/Applications/MillionClaw.app"

# 删除数据
echo "删除用户数据..."
rm -rf "$HOME/Library/Application Support/MillionClaw"
rm -rf "$HOME/.millionclaw"

# 删除卸载脚本自身
rm -f "/usr/local/bin/uninstall-millionclaw"

echo ""
echo "✅ Million Claw 已完全卸载"
echo ""
EOF

chmod +x "/usr/local/bin/uninstall-millionclaw"

# 修复权限
echo "🔧 修复权限..."
chmod -R 755 "$INSTALL_DIR"
chown -R root:wheel "$INSTALL_DIR"

echo ""
echo "========================================"
echo "🎉 Million Claw 安装完成！"
echo "========================================"
echo ""
echo "📊 安装信息:"
echo "     应用位置: $INSTALL_DIR"
echo "     启动方式: 在应用程序中点击 Million Claw"
echo "     卸载方式: 运行 'sudo uninstall-millionclaw'"
echo ""
echo "🚀 首次启动需要:"
echo "     1. 输入邀请码（如有）"
echo "     2. 或选择付费方案"
echo ""
echo "⚠️ 安全提示:"
echo "     macOS 可能会阻止运行，请在"
echo "     系统偏好设置 -> 安全性与隐私 中允许运行"
echo ""
echo "========================================"
echo ""
echo "💡 安装完成！现在可以在应用程序中启动 Million Claw。"