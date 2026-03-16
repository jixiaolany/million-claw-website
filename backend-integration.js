// Million Claw 缃戠珯鍚庡彴闆嗘垚鑴氭湰锛堢敓浜х増鏈級
// 杩欎釜鑴氭湰灏嗗墠绔笌鐢熶骇鐜鍚庡彴API杩炴帴璧锋潵

// ==================== 閰嶇疆鍖哄煙 ====================
// 閮ㄧ讲鍚庨渶瑕佹洿鏂拌繖涓猆RL涓哄疄闄呯殑閮ㄧ讲鍦板潃
const API_BASE_URL = 'https://million-claw-test-api.onrender.com'; // 鐢熶骇鐜URL
// 鏈湴寮€鍙戯細'http://localhost:3001'
// 娴嬭瘯鐜锛?https://million-claw-backend-test.onrender.com'
// =================================================

// 鍒濆鍖栧嚱鏁?function initBackendIntegration() {
    console.log('馃殌 鍒濆鍖朚illion Claw鍚庡彴闆嗘垚...');
    
    // 鏄剧ずAPI鐘舵€?    checkApiStatus();
    
    // 绛夊緟DOM鍔犺浇瀹屾垚
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupEventListeners);
    } else {
        setupEventListeners();
    }
}

// 妫€鏌PI鐘舵€?async function checkApiStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        const data = await response.json();
        
        if (data.status === 'healthy') {
            console.log('鉁?鍚庡彴API杩炴帴姝ｅ父');
            showNotification('鍚庡彴鏈嶅姟宸茶繛鎺?, 'success');
        } else {
            console.warn('鈿狅笍 鍚庡彴API鐘舵€佸紓甯?);
            showNotification('鍚庡彴鏈嶅姟鐘舵€佸紓甯?, 'warning');
        }
    } catch (error) {
        console.error('鉂?鏃犳硶杩炴帴鍒板悗鍙癆PI:', error);
        showNotification('鏃犳硶杩炴帴鍒板悗鍙版湇鍔★紝閮ㄥ垎鍔熻兘鍙兘鍙楅檺', 'warning');
    }
}

// 璁剧疆浜嬩欢鐩戝惉鍣?function setupEventListeners() {
    console.log('馃敡 璁剧疆浜嬩欢鐩戝惉鍣?..');
    
    // 1. 涓嬭浇鎸夐挳鐐瑰嚮浜嬩欢
    setupDownloadButtons();
    
    // 2. 閭€璇风爜楠岃瘉
    setupInviteCodeValidation();
    
    // 3. 鍙嶉琛ㄥ崟鎻愪氦
    setupFeedbackForm();
    
    // 4. 鐢ㄦ埛娉ㄥ唽
    setupUserRegistration();
}

// 璁剧疆涓嬭浇鎸夐挳
function setupDownloadButtons() {
    // 鏌ユ壘鎵€鏈変笅杞介摼鎺?    const downloadLinks = document.querySelectorAll('a[href*="download"], a[href*=".exe"], a[href*=".apk"]');
    
    downloadLinks.forEach(link => {
        // 淇濆瓨鍘熷href
        const originalHref = link.getAttribute('href');
        
        // 娣诲姞鐐瑰嚮浜嬩欢
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            
            // 纭畾骞冲彴
            let platform = 'unknown';
            if (originalHref.includes('.exe')) platform = 'windows';
            if (originalHref.includes('.apk')) platform = 'android';
            if (link.textContent.toLowerCase().includes('mac')) platform = 'macos';
            if (link.textContent.toLowerCase().includes('cloud')) platform = 'cloud';
            
            // 鏄剧ず涓嬭浇涓姸鎬?            const originalText = link.textContent;
            link.textContent = '涓嬭浇涓?..';
            link.style.opacity = '0.7';
            link.style.cursor = 'wait';
            
            try {
                // 1. 璁板綍涓嬭浇鍒板悗鍙?                await recordDownload(platform);
                
                // 2. 鏄剧ず鎴愬姛娑堟伅
                showNotification(`姝ｅ湪涓嬭浇 ${getPlatformName(platform)} 鐗堟湰`, 'success');
                
                // 3. 寤惰繜鍚庡紑濮嬪疄闄呬笅杞?                setTimeout(() => {
                    // 鎭㈠鍘熷鐘舵€?                    link.textContent = originalText;
                    link.style.opacity = '1';
                    link.style.cursor = 'pointer';
                    
                    // 寮€濮嬩笅杞?                    window.open(originalHref, '_blank');
                }, 1000);
                
            } catch (error) {
                console.error('涓嬭浇璁板綍澶辫触:', error);
                
                // 鎭㈠鍘熷鐘舵€?                link.textContent = originalText;
                link.style.opacity = '1';
                link.style.cursor = 'pointer';
                
                // 鏄剧ず閿欒浣嗙户缁笅杞?                showNotification('涓嬭浇缁熻璁板綍澶辫触锛岀户缁笅杞?..', 'warning');
                
                // 鐩存帴寮€濮嬩笅杞?                setTimeout(() => {
                    window.open(originalHref, '_blank');
                }, 500);
            }
        });
    });
    
    console.log(`鉁?璁剧疆浜?${downloadLinks.length} 涓笅杞芥寜閽甡);
}

// 璁板綍涓嬭浇鍒板悗鍙?async function recordDownload(platform) {
    const response = await fetch(`${API_BASE_URL}/api/downloads/record`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

// 璁剧疆閭€璇风爜楠岃瘉
function setupInviteCodeValidation() {
    // 鏌ユ壘閭€璇风爜杈撳叆妗?    const inviteInputs = document.querySelectorAll('input[type="text"][placeholder*="閭€璇风爜"], input[name*="invite"]');
    
    inviteInputs.forEach(input => {
        // 娣诲姞杈撳叆浜嬩欢鐩戝惉
        input.addEventListener('blur', async () => {
            const code = input.value.trim();
            
            if (code.length < 5) return;
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/invite/validate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code })
                });
                
                const data = await response.json();
                
                if (data.valid) {
                    showNotification('閭€璇风爜鏈夋晥', 'success');
                    input.style.borderColor = '#10b981';
                } else {
                    showNotification('閭€璇风爜鏃犳晥', 'error');
                    input.style.borderColor = '#ef4444';
                }
            } catch (error) {
                console.error('閭€璇风爜楠岃瘉澶辫触:', error);
                showNotification('楠岃瘉鏈嶅姟鏆傛椂涓嶅彲鐢?, 'warning');
            }
        });
    });
}

// 璁剧疆鍙嶉琛ㄥ崟
function setupFeedbackForm() {
    // 鏌ユ壘鍙嶉琛ㄥ崟
    const feedbackForms = document.querySelectorAll('form[action*="feedback"], form[id*="feedback"]');
    
    feedbackForms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            // 鑾峰彇琛ㄥ崟鏁版嵁
            const formData = new FormData(form);
            const email = formData.get('email') || '';
            const message = formData.get('message') || formData.get('content') || '';
            
            if (!message.trim()) {
                showNotification('璇疯緭鍏ュ弽棣堝唴瀹?, 'error');
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/feedback/submit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, message })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('鍙嶉鎻愪氦鎴愬姛锛屾劅璋㈡偍鐨勬剰瑙侊紒', 'success');
                    form.reset();
                } else {
                    showNotification('鍙嶉鎻愪氦澶辫触锛岃閲嶈瘯', 'error');
                }
            } catch (error) {
                console.error('鍙嶉鎻愪氦澶辫触:', error);
                showNotification('缃戠粶閿欒锛岃绋嶅悗閲嶈瘯', 'error');
            }
        });
    });
}

// 璁剧疆鐢ㄦ埛娉ㄥ唽
function setupUserRegistration() {
    // 鏌ユ壘娉ㄥ唽琛ㄥ崟
    const registerForms = document.querySelectorAll('form[action*="register"], form[id*="register"]');
    
    registerForms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput) return;
            
            const email = emailInput.value.trim();
            
            if (!email.includes('@')) {
                showNotification('璇疯緭鍏ユ湁鏁堢殑閭鍦板潃', 'error');
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showNotification('娉ㄥ唽鎴愬姛锛佽鏌ョ湅閭纭', 'success');
                    form.reset();
                } else {
                    showNotification('娉ㄥ唽澶辫触锛岃閲嶈瘯', 'error');
                }
            } catch (error) {
                console.error('娉ㄥ唽澶辫触:', error);
                showNotification('缃戠粶閿欒锛岃绋嶅悗閲嶈瘯', 'error');
            }
        });
    });
}

// 鏄剧ず閫氱煡
function showNotification(message, type = 'info') {
    // 鍒涘缓閫氱煡鍏冪礌
    const notification = document.createElement('div');
    notification.className = `million-claw-notification million-claw-notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // 娣诲姞鏍峰紡
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 8px;
        background: ${getNotificationColor(type)};
        color: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    // 娣诲姞鍔ㄧ敾
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            margin-left: 12px;
        }
    `;
    document.head.appendChild(style);
    
    // 娣诲姞鍏抽棴鎸夐挳浜嬩欢
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // 鑷姩娑堝け
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// 杈呭姪鍑芥暟
function getPlatformName(platform) {
    const names = {
        'windows': 'Windows',
        'macos': 'macOS',
        'android': 'Android',
        'cloud': '浜戠増',
        'unknown': '鏈煡'
    };
    return names[platform] || platform;
}

function getNotificationIcon(type) {
    const icons = {
        'success': '鉁?,
        'error': '鉂?,
        'warning': '鈿狅笍',
        'info': '鈩癸笍'
    };
    return icons[type] || '鈩癸笍';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// 瀵煎嚭鍒濆鍖栧嚱鏁?window.MillionClawBackend = {
    init: initBackendIntegration,
    recordDownload,
    validateInviteCode: async (code) => {
        const response = await fetch(`${API_BASE_URL}/api/invite/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        return await response.json();
    },
    submitFeedback: async (email, message) => {
        const response = await fetch(`${API_BASE_URL}/api/feedback/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, message })
        });
        return await response.json();
    },
    getApiStatus: async () => {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        return await response.json();
    },
    getDownloadStats: async () => {
        const response = await fetch(`${API_BASE_URL}/api/downloads/stats`);
        return await response.json();
    }
};

// 鑷姩鍒濆鍖?initBackendIntegration();
