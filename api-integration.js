// Million Claw 前端API集成脚本
// 将前端与后端API完全集成，实现完整功能

console.log('🦞 Million Claw 前端API集成脚本');
console.log('================================\n');

// API配置
const API_CONFIG = {
  baseUrl: 'http://localhost:3000', // 后端API地址
  endpoints: {
    validateInvite: '/api/auth/validate-invite',
    checkDownload: '/api/download/check-permission',
    health: '/health',
    status: '/api/status'
  },
  validInviteCodes: [
    'MILLION2026',
    'CLAWPRO', 
    'OPENAI2026',
    'BETA-TESTER'
  ]
};

// API工具函数
class MillionClawAPI {
  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  // 健康检查
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.health}`);
      const data = await response.json();
      return {
        success: response.ok,
        data,
        status: response.status
      };
    } catch (error) {
      console.error('健康检查失败:', error);
      return {
        success: false,
        error: error.message,
        message: '后端服务可能未启动'
      };
    }
  }

  // 验证邀请码
  async validateInviteCode(inviteCode) {
    if (!inviteCode || inviteCode.trim() === '') {
      return {
        success: false,
        message: '邀请码不能为空'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.validateInvite}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inviteCode })
      });

      const data = await response.json();
      
      return {
        success: response.ok && data.success,
        data,
        status: response.status,
        message: data.message
      };
    } catch (error) {
      console.error('邀请码验证失败:', error);
      
      // 如果API不可用，使用本地验证
      const isValid = API_CONFIG.validInviteCodes.includes(inviteCode.toUpperCase());
      
      return {
        success: isValid,
        data: {
          inviteCode,
          isValid,
          validCodes: isValid ? undefined : API_CONFIG.validInviteCodes
        },
        message: isValid ? '邀请码验证成功（本地验证）' : '邀请码无效或已过期',
        isLocalValidation: true
      };
    }
  }

  // 检查下载权限
  async checkDownloadPermission(inviteCode, platform) {
    if (!inviteCode || !platform) {
      return {
        success: false,
        message: '缺少必要参数'
      };
    }

    // 先验证邀请码
    const inviteResult = await this.validateInviteCode(inviteCode);
    
    if (!inviteResult.success) {
      return {
        success: false,
        message: inviteResult.message,
        requiresPayment: true
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.checkDownload}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inviteCode, platform })
      });

      const data = await response.json();
      
      return {
        success: response.ok && data.success,
        data,
        status: response.status,
        message: data.message
      };
    } catch (error) {
      console.error('下载权限检查失败:', error);
      
      // 如果API不可用，使用本地逻辑
      const validPlatforms = ['windows', 'macos'];
      const isPlatformValid = validPlatforms.includes(platform.toLowerCase());
      
      if (!isPlatformValid) {
        return {
          success: false,
          message: '不支持的平台',
          supportedPlatforms: validPlatforms,
          isLocalValidation: true
        };
      }

      // 本地下载链接
      const downloadLinks = {
        windows: './Million-Claw-Windows-Deployment.zip',
        macos: './Million-Claw-macOS-Deployment.zip'
      };

      return {
        success: true,
        data: {
          downloadUrl: downloadLinks[platform.toLowerCase()],
          platform,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        message: '允许下载（本地验证）',
        isLocalValidation: true
      };
    }
  }

  // 获取API状态
  async getApiStatus() {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.status}`);
      const data = await response.json();
      return {
        success: response.ok,
        data,
        status: response.status
      };
    } catch (error) {
      console.error('获取API状态失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// 前端集成类
class MillionClawFrontend {
  constructor() {
    this.api = new MillionClawAPI();
    this.initialize();
  }

  // 初始化
  initialize() {
    console.log('1. 🔧 初始化Million Claw前端集成...');
    
    // 检查后端健康状态
    this.checkBackendHealth();
    
    // 绑定事件
    this.bindEvents();
    
    // 更新UI状态
    this.updateUI();
  }

  // 检查后端健康状态
  async checkBackendHealth() {
    console.log('2. 🩺 检查后端服务健康状态...');
    
    const healthResult = await this.api.checkHealth();
    
    if (healthResult.success) {
      console.log('   ✅ 后端服务正常:', healthResult.data);
      this.showNotification('后端服务连接正常', 'success');
    } else {
      console.log('   ⚠️ 后端服务异常，使用本地验证模式');
      this.showNotification('使用本地验证模式（后端服务未启动）', 'warning');
    }
    
    return healthResult;
  }

  // 绑定事件
  bindEvents() {
    console.log('3. 🔗 绑定前端事件...');
    
    // 邀请码验证按钮
    const validateButton = document.querySelector('button');
    if (validateButton) {
      validateButton.addEventListener('click', () => this.handleInviteValidation());
    }
    
    // 邀请码输入框回车
    const inviteInput = document.querySelector('input[type="text"]');
    if (inviteInput) {
      inviteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleInviteValidation();
        }
      });
    }
    
    // 下载按钮
    const downloadButtons = document.querySelectorAll('.nav-button');
    downloadButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleDownloadClick(e));
    });
    
    console.log('   ✅ 事件绑定完成');
  }

  // 处理邀请码验证
  async handleInviteValidation() {
    const inviteInput = document.querySelector('input[type="text"]');
    const validateButton = document.querySelector('button');
    
    if (!inviteInput || !validateButton) return;
    
    const inviteCode = inviteInput.value.trim();
    
    if (!inviteCode) {
      this.showNotification('请输入邀请码', 'error');
      return;
    }
    
    // 显示加载状态
    const originalText = validateButton.textContent;
    validateButton.textContent = '验证中...';
    validateButton.disabled = true;
    
    try {
      // 调用API验证
      const result = await this.api.validateInviteCode(inviteCode);
      
      // 恢复按钮状态
      validateButton.textContent = originalText;
      validateButton.disabled = false;
      
      if (result.success) {
        this.showNotification(result.message, 'success');
        
        // 存储验证状态
        localStorage.setItem('millionClaw_inviteCode', inviteCode);
        localStorage.setItem('millionClaw_inviteValidated', 'true');
        localStorage.setItem('millionClaw_validationTime', new Date().toISOString());
        
        // 更新UI
        this.updateUI();
        
      } else {
        this.showNotification(result.message, 'error');
        
        // 显示有效邀请码列表
        if (result.data && result.data.validCodes) {
          const validCodesText = result.data.validCodes.join(', ');
          this.showNotification(`有效邀请码: ${validCodesText}`, 'info', 5000);
        }
      }
      
    } catch (error) {
      // 恢复按钮状态
      validateButton.textContent = originalText;
      validateButton.disabled = false;
      
      this.showNotification('验证过程中发生错误', 'error');
      console.error('邀请码验证错误:', error);
    }
  }

  // 处理下载点击
  async handleDownloadClick(event) {
    // 如果是下载按钮
    const button = event.currentTarget;
    const isWindowsDownload = button.textContent.includes('Windows');
    const isMacDownload = button.textContent.includes('macOS');
    
    if (!isWindowsDownload && !isMacDownload) {
      return; // 不是下载按钮
    }
    
    const platform = isWindowsDownload ? 'windows' : 'macos';
    
    // 检查是否已验证邀请码
    const inviteCode = document.querySelector('input[type="text"]').value.trim();
    const storedInviteCode = localStorage.getItem('millionClaw_inviteCode');
    const isValidated = localStorage.getItem('millionClaw_inviteValidated') === 'true';
    
    let finalInviteCode = inviteCode;
    
    // 如果没有输入邀请码，但之前验证过，使用存储的
    if (!finalInviteCode && storedInviteCode && isValidated) {
      finalInviteCode = storedInviteCode;
      document.querySelector('input[type="text"]').value = finalInviteCode;
    }
    
    // 如果没有邀请码，阻止下载并提示
    if (!finalInviteCode) {
      event.preventDefault();
      this.showNotification('需要有效的邀请码或选择付费版本', 'error');
      return;
    }
    
    // 检查下载权限
    event.preventDefault();
    
    // 显示加载状态
    const originalText = button.textContent;
    button.textContent = '检查权限中...';
    button.disabled = true;
    
    try {
      const result = await this.api.checkDownloadPermission(finalInviteCode, platform);
      
      // 恢复按钮状态
      button.textContent = originalText;
      button.disabled = false;
      
      if (result.success) {
        this.showNotification(result.message, 'success');
        
        // 开始下载
        const downloadUrl = result.data.downloadUrl;
        this.startDownload(downloadUrl, platform);
        
        // 记录下载
        this.recordDownload(finalInviteCode, platform);
        
      } else {
        this.showNotification(result.message, 'error');
        
        // 如果需要付费
        if (result.requiresPayment) {
          this.showPaymentOptions(platform);
        }
      }
      
    } catch (error) {
      // 恢复按钮状态
      button.textContent = originalText;
      button.disabled = false;
      
      this.showNotification('下载权限检查失败', 'error');
      console.error('下载权限检查错误:', error);
    }
  }

  // 开始下载
  startDownload(downloadUrl, platform) {
    console.log(`开始下载: ${platform} - ${downloadUrl}`);
    
    // 创建隐藏的下载链接
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadUrl.split('/').pop();
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 显示下载提示
    this.showNotification(`${platform === 'windows' ? 'Windows' : 'macOS'} 版本开始下载`, 'success');
  }

  // 记录下载
  recordDownload(inviteCode, platform) {
    const downloads = JSON.parse(localStorage.getItem('millionClaw_downloads') || '[]');
    
    downloads.push({
      inviteCode,
      platform,
      downloadedAt: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    localStorage.setItem('millionClaw_downloads', JSON.stringify(downloads));
    
    console.log('下载记录已保存:', {
      inviteCode,
      platform,
      count: downloads.length
    });
  }

  // 显示付费选项
  showPaymentOptions(platform) {
    const paymentModal = `
      <div class="payment-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000;">
        <div style="background: white; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%;">
          <h3 style="margin-bottom: 20px; color: #2563eb;">选择付费版本</h3>
          <p style="margin-bottom: 20px; color: #666;">邀请码无效或已过期，请选择付费版本继续使用。</p>
          
          <div style="display: grid; gap: 15px; margin-bottom: 30px;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 2px solid #e2e8f0;">
              <h4 style="margin-bottom: 10px; color: #1e293b;">专业版</h4>
              <p style="color: #64748b; margin-bottom: 15px;">完整功能，优先支持，定期更新</p>
              <div style="font-size: 24px; font-weight: bold; color: #2563eb;">¥199 <span style="font-size: 14px; color: #64748b;">/月</span></div>
              <button class="select-plan" data-plan="pro" style="margin-top: 15px; background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%;">选择专业版</button>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 2px solid #e2e8f0;">
              <h4 style="margin-bottom: 10px; color: #1e293b;">企业版</h4>
              <p style="color: #64748b; margin-bottom: 15px;">定制功能，专属支持，团队协作</p>
              <div style="font-size: 24px; font-weight: bold; color: #10b981;">定制价格</div>
              <button class="select-plan" data-plan="enterprise" style="margin-top: 15px; background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%;">联系定制</button>
            </div>
          </div>
          
          <button class="close-modal" style="background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%;">取消</button>
        </div>
      </div>
    `;
    
    // 添加模态框
    document.body.insertAdjacentHTML('beforeend', paymentModal);
    
    // 绑定事件
    setTimeout(() => {
      const modal = document.querySelector('.payment-modal');
      const closeBtn = modal.querySelector('.close-modal');
      const planButtons = modal.querySelectorAll('.select-plan');
      
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
      
      planButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const plan = e.target.dataset.plan;
          this.handlePlanSelection(plan, platform);
          document.body.removeChild(modal);
        });
      });
      
      // 点击背景关闭
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    }, 10);
  }

  // 处理方案选择
  handlePlanSelection(plan, platform) {
    if (plan === 'pro') {
      this.showNotification('已选择专业版，即将跳转到支付页面', 'info');
      // 这里应该跳转到支付页面
      setTimeout(() => {
        window.open('https://example.com/payment?plan=pro&platform=' + platform, '_blank');
      }, 1500);
    } else if (plan === 'enterprise') {
      this.showNotification('已选择企业版，请通过邮件联系定制', 'info');
      // 这里应该打开联系表单
      setTimeout(() => {
        window.open('mailto:support@millionclaw.com?subject=企业版定制咨询&body=平台：' + platform, '_blank');
      }, 1500);
    }
  }

  // 更新UI状态
  updateUI() {
    const isValidated = localStorage.getItem('millionClaw_inviteValidated') === 'true';
    const inviteCode = localStorage.getItem('millionClaw_inviteCode');
    
    if (isValidated && inviteCode) {
      // 更新输入框显示已验证的邀请码
      const inviteInput = document.querySelector('input[type="text"]');
      if (inviteInput) {
        inviteInput.value = inviteCode;
        inviteInput.style.borderColor = '#10b981';
        inviteInput.style.backgroundColor = '#f0fdf4';
      }
      
      // 更新按钮状态
      const validateButton = document.querySelector('button');
      if (validateButton) {
        validateButton.textContent = '已验证';
        validateButton.style.background = '#10b981';
        validateButton.disabled = true;
      }
    }
  }

  // 显示通知
  showNotification(message,