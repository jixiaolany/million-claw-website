@echo off
echo ========================================
echo      Million Claw Windows 安装程序
echo ========================================
echo.
echo 🚀 正在安装 Million Claw...
echo 📅 时间: %date% %time%
echo.

REM 检查管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ 需要管理员权限
    echo 💡 请右键点击此文件，选择"以管理员身份运行"
    pause
    exit /b 1
)

echo ✅ 管理员权限确认
echo.

REM 创建安装目录
set INSTALL_DIR=%ProgramFiles%\MillionClaw
echo 📁 创建安装目录: %INSTALL_DIR%
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

REM 复制文件
echo 📦 复制文件...
xcopy /E /Y "%~dp0\*" "%INSTALL_DIR%\" >nul

REM 创建桌面快捷方式
echo 📋 创建快捷方式...
set SHORTCUT=%USERPROFILE%\Desktop\Million Claw.lnk
set TARGET=%INSTALL_DIR%\start.bat
set ICON=%INSTALL_DIR%\icon.ico

powershell -Command "$ws = New-Object -ComObject WScript.Shell; $sc = $ws.CreateShortcut('%SHORTCUT%'); $sc.TargetPath = '%TARGET%'; $sc.WorkingDirectory = '%INSTALL_DIR%'; $sc.IconLocation = '%ICON%'; $sc.Save()"

REM 创建开始菜单快捷方式
set START_MENU=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Million Claw.lnk
powershell -Command "$ws = New-Object -ComObject WScript.Shell; $sc = $ws.CreateShortcut('%START_MENU%'); $sc.TargetPath = '%TARGET%'; $sc.WorkingDirectory = '%INSTALL_DIR%'; $sc.IconLocation = '%ICON%'; $sc.Save()"

REM 添加到PATH环境变量
echo 🔧 配置环境变量...
setx PATH "%PATH%;%INSTALL_DIR%" /M >nul

REM 创建卸载程序
echo 🗑️ 创建卸载程序...
echo @echo off > "%INSTALL_DIR%\uninstall.bat"
echo echo 正在卸载 Million Claw... >> "%INSTALL_DIR%\uninstall.bat"
echo rmdir /S /Q "%INSTALL_DIR%" >> "%INSTALL_DIR%\uninstall.bat"
echo del "%USERPROFILE%\Desktop\Million Claw.lnk" >> "%INSTALL_DIR%\uninstall.bat"
echo del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Million Claw.lnk" >> "%INSTALL_DIR%\uninstall.bat"
echo echo ✅ Million Claw 已卸载 >> "%INSTALL_DIR%\uninstall.bat"
echo pause >> "%INSTALL_DIR%\uninstall.bat"

REM 创建控制面板卸载条目
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\MillionClaw" /v DisplayName /t REG_SZ /d "Million Claw" /f >nul
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\MillionClaw" /v UninstallString /t REG_SZ /d "\"%INSTALL_DIR%\uninstall.bat\"" /f >nul
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\MillionClaw" /v DisplayIcon /t REG_SZ /d "%ICON%" /f >nul
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\MillionClaw" /v Publisher /t REG_SZ /d "Million Claw Team" /f >nul

echo.
echo ========================================
echo 🎉 Million Claw 安装完成！
echo ========================================
echo.
echo 📊 安装信息:
echo     安装目录: %INSTALL_DIR%
echo     桌面快捷方式: 已创建
echo     开始菜单: 已添加
echo     环境变量: 已配置
echo.
echo 🚀 启动方式:
echo     1. 双击桌面"Million Claw"图标
echo     2. 或运行: %INSTALL_DIR%\start.bat
echo.
echo 💡 首次启动需要:
echo     1. 输入邀请码（如有）
echo     2. 或选择付费方案
echo.
echo 🗑️ 卸载方式:
echo     控制面板 -> 程序和功能 -> Million Claw
echo     或运行: %INSTALL_DIR%\uninstall.bat
echo.
echo ========================================
pause