// 导入 Proto 生成的类
const { LoginRequest } = require('./proto/auth_pb.js');
const { AuthClient } = require('./proto/auth_grpc_web_pb.js');

// 创建登录界面
function createLoginUI() {
    const container = document.createElement('div');
    container.className = 'login-container';
    container.innerHTML = `
        <style>
            .login-container {
                max-width: 900px;
                width: 90%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                margin: 0;
                padding: 40px;
                border-radius: 12px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .login-content {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
            }
            .login-section {
                padding: 20px;
            }
            .project-info {
                border-right: 1px solid rgba(255, 255, 255, 0.2);
                padding-right: 30px;
            }
            .feature-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            .feature-list li {
                margin-bottom: 12px;
                display: flex;
                align-items: start;
                gap: 10px;
                color: #34495e;
                font-size: 14px;
            }
            .feature-list li:before {
                content: "✓";
                color: #4CAF50;
                font-weight: bold;
            }
            .tech-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-top: 15px;
            }
            .tech-tag {
                background: rgba(76, 175, 80, 0.1);
                color: #4CAF50;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                border: 1px solid rgba(76, 175, 80, 0.2);
            }
            .login-header {
                text-align: center;
                margin-bottom: 25px;
            }
            .login-header h1 {
                color: #2c3e50;
                margin: 0;
                font-size: 24px;
            }
            .login-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .form-group label {
                color: #34495e;
                font-size: 14px;
                font-weight: 500;
            }
            .form-group input {
                padding: 10px 12px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.3s;
            }
            .form-group input:focus {
                border-color: #4CAF50;
                outline: none;
                box-shadow: 0 0 0 3px rgba(76,175,80,0.1);
            }
            .login-button {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 12px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 500;
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
            }
            .login-button:before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    120deg,
                    transparent,
                    rgba(255, 255, 255, 0.2),
                    transparent
                );
                transition: 0.5s;
            }
            .login-button:hover:before {
                left: 100%;
            }
            .login-button:hover {
                background: #45a049;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(76,175,80,0.2);
            }
            .login-button:active {
                transform: translateY(0);
            }
            .status-message {
                margin-top: 15px;
                padding: 12px;
                border-radius: 8px;
                text-align: center;
                font-size: 14px;
            }
            .status-message.success {
                background: #dff0d8;
                color: #3c763d;
                border: 1px solid #d0e9c6;
            }
            .status-message.error {
                background: #f2dede;
                color: #a94442;
                border: 1px solid #ebcccc;
            }
            .status-message.loading {
                background: #e8f5e9;
                color: #2e7d32;
                border: 1px solid #c8e6c9;
            }
            .login-tips {
                margin-top: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                font-size: 13px;
                color: #666;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #4CAF50;
                border-top-color: transparent;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
                margin-right: 8px;
                vertical-align: middle;
            }
            .github-link {
                text-align: center;
                margin-top: 20px;
                padding: 15px;
                border-top: 1px solid #eee;
            }
            .github-link a {
                color: #2c3e50;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                transition: color 0.3s;
            }
            .github-link a:hover {
                color: #4CAF50;
            }
            .github-icon {
                width: 20px;
                height: 20px;
                fill: currentColor;
            }
        </style>
        <div class="login-content">
            <div class="project-info login-section">
                <h2>GrpcGate 项目说明</h2>
                <ul class="feature-list">
                    <li>基于 gRPC-Web 的现代通信架构</li>
                    <li>Go 后端提供高性能服务</li>
                    <li>支持双向流式通信</li>
                    <li>内置安全认证机制</li>
                    <li>跨平台兼容性支持</li>
                </ul>
                <h2>技术特点</h2>
                <ul class="feature-list">
                    <li>Protocol Buffers 数据序列化</li>
                    <li>HTTP/2 长连接支持</li>
                    <li>支持服务端推送</li>
                    <li>二进制协议，高效传输</li>
                </ul>
                <div class="tech-tags">
                    <span class="tech-tag">gRPC-Web</span>
                    <span class="tech-tag">Golang</span>
                    <span class="tech-tag">JavaScript</span>
                    <span class="tech-tag">Protocol Buffers</span>
                    <span class="tech-tag">HTTP/2</span>
                </div>
            </div>
            <div class="login-section">
                <div class="login-header">
                    <h1>GrpcGate 登录系统荷花版本1.0</h1>
                </div>
                <form class="login-form" id="loginForm">
                    <div class="form-group">
                        <label for="username">用户名</label>
                        <input type="text" id="username" placeholder="请输入用户名" required>
                    </div>
                    <div class="form-group">
                        <label for="password">密码</label>
                        <input type="password" id="password" placeholder="请输入密码" required>
                    </div>
                    <button type="submit" class="login-button">登录</button>
                </form>
                <div id="status" class="status-message"></div>
                <div class="login-tips">
                    <strong>登录说明：</strong>
                    <ul>
                        <li>用户名和密码不能为空</li>
                        <li>用户名：admin，密码：admin 可用于测试</li>
                        <li>使用 gRPC-Web 进行安全通信</li>
                        <li>支持跨域请求和 HTTP/2</li>
                    </ul>
                </div>
                <div class="github-link">
                    <a href="https://github.com/test502git/GrpcGate" target="_blank">
                        <svg class="github-icon" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                        在 GitHub 上查看源码
                    </a>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(container);
    
    // 添加登录表单提交事件监听
    const form = container.querySelector('#loginForm');
    const statusDiv = container.querySelector('#status');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            statusDiv.className = 'status-message loading';
            statusDiv.innerHTML = '<span class="loading-spinner"></span>登录中...';
            
            const response = await loginUser(username, password);
            console.log('Login response:', response);
            
            if (response.success) {
                statusDiv.className = 'status-message success';
                statusDiv.innerHTML = `✓ ${response.message}`;
                
                // 添加登录成功动画
                form.style.transition = 'opacity 0.5s';
                form.style.opacity = '0.5';
                setTimeout(() => {
                    form.style.opacity = '1';
                    form.reset();
                }, 1000);
            } else {
                throw new Error(response.message || '登录失败');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            statusDiv.className = 'status-message error';
            statusDiv.innerHTML = '✗ 登录失败：' + (error.message || '未知错误');
            
            // 添加输入框抖动效果
            const inputs = form.querySelectorAll('input');
            inputs.forEach(input => {
                input.style.animation = 'none';
                setTimeout(() => {
                    input.style.animation = 'shake 0.5s';
                }, 0);
            });
        }
    });
}

// 登录函数
async function loginUser(username, password) {
    const client = new AuthClient('http://' + window.location.hostname + ':8080');
    
    return new Promise((resolve, reject) => {
        const request = new LoginRequest();
        request.setUsername(username);
        request.setPassword(password);
        
        client.login(request, {}, (err, response) => {
            if (err) {
                reject(err);
                return;
            }
            const result = response.toObject();
            if (!result.success) {
                reject(new Error(result.message || '登录失败'));
                return;
            }
            resolve(result);
        });
    });
}

// 添加抖动动画
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// 页面加载完成后创建登录界面
document.addEventListener('DOMContentLoaded', createLoginUI);
