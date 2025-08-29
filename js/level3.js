// DOM元素
const functionBtns = document.querySelectorAll('.function-btn');
const functionContent = document.getElementById('functionContent');
const returnHomeBtn = document.getElementById('returnHome');

// 初始化页面
function initPage() {
    // 初始化功能选择事件监听
    functionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const functionType = btn.getAttribute('data-function');
            changeFunction(functionType);
        });
    });
    
    // 初始化返回首页按钮事件监听
    returnHomeBtn.addEventListener('click', returnToHome);
    
    // 初始化显示数据分析功能
    changeFunction('analytics');
}

// 切换功能区域
function changeFunction(functionType) {
    // 更新功能按钮状态
    functionBtns.forEach(btn => {
        if (btn.getAttribute('data-function') === functionType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 更新功能内容
    if (functionType === 'analytics') {
        showAnalyticsContent();
    } else if (functionType === 'settings') {
        showSettingsContent();
    }
}

// 显示数据分析内容
function showAnalyticsContent() {
    functionContent.innerHTML = `
        <div class="analytics-content">
            <div class="analytics-section">
                <h3>销售数据分析</h3>
                <p>查看不同时间段内的销售数据，包括总销售额、销售数量、热销产品等信息。通过这些数据，您可以了解客户的消费习惯，优化产品组合。</p>
            </div>
            
            <div class="analytics-section">
                <h3>库存状态监控</h3>
                <p>实时监控每种啤酒的库存状态，及时了解需要补货的产品。系统会根据销售数据预测库存消耗速度，帮助您制定更合理的补货计划。</p>
            </div>
            
            <div class="analytics-section">
                <h3>客户行为分析</h3>
                <p>分析客户的购买频率、偏好产品类型等信息。通过这些分析，您可以更好地了解目标客户群体，制定更有效的营销策略。</p>
            </div>
            
            <div class="analytics-section">
                <h3>设备运行效率</h3>
                <p>查看设备的运行状态、使用率等信息。了解设备的高峰使用时段，合理安排维护时间，确保设备的正常运行。</p>
            </div>
        </div>
    `;
}

// 显示系统设置内容
function showSettingsContent() {
    functionContent.innerHTML = `
        <div class="settings-content">
            <div class="setting-item">
                <label for="password">管理员密码</label>
                <input type="password" id="password" placeholder="请输入新密码">
                <button class="btn-primary" id="changePasswordBtn">修改密码</button>
            </div>
            
            <div class="setting-item">
                <label for="price">啤酒价格设置</label>
                <select id="price">
                    <option value="5">5元/杯</option>
                    <option value="10">10元/杯</option>
                    <option value="15">15元/杯</option>
                    <option value="20">20元/杯</option>
                    <option value="custom">自定义价格</option>
                </select>
                <input type="number" id="customPrice" placeholder="请输入自定义价格" style="display: none;">
                <button class="btn-primary" id="savePriceBtn">保存设置</button>
            </div>
            
            <div class="setting-item">
                <label for="language">系统语言</label>
                <select id="language">
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English</option>
                    <option value="ja-JP">日本語</option>
                    <option value="ko-KR">한국어</option>
                </select>
                <button class="btn-primary" id="saveLanguageBtn">保存设置</button>
            </div>
            
            <div class="setting-item">
                <label for="theme">界面主题</label>
                <select id="theme">
                    <option value="light">浅色主题</option>
                    <option value="dark">深色主题</option>
                    <option value="auto">自动切换</option>
                </select>
                <button class="btn-primary" id="saveThemeBtn">保存设置</button>
            </div>
        </div>
    `;
    
    // 初始化设置相关的事件监听
    initSettingsEvents();
}

// 初始化设置相关的事件监听
function initSettingsEvents() {
    // 价格选择事件
    const priceSelect = document.getElementById('price');
    const customPriceInput = document.getElementById('customPrice');
    
    priceSelect.addEventListener('change', () => {
        if (priceSelect.value === 'custom') {
            customPriceInput.style.display = 'block';
        } else {
            customPriceInput.style.display = 'none';
        }
    });
    
    // 修改密码按钮事件
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    changePasswordBtn.addEventListener('click', () => {
        alert('密码修改功能已触发，实际项目中会有更复杂的验证逻辑');
    });
    
    // 保存价格设置按钮事件
    const savePriceBtn = document.getElementById('savePriceBtn');
    savePriceBtn.addEventListener('click', () => {
        let priceValue = priceSelect.value;
        if (priceValue === 'custom') {
            priceValue = customPriceInput.value;
        }
        alert(`价格设置已保存：${priceValue}元/杯`);
    });
    
    // 保存语言设置按钮事件
    const saveLanguageBtn = document.getElementById('saveLanguageBtn');
    const languageSelect = document.getElementById('language');
    saveLanguageBtn.addEventListener('click', () => {
        alert(`语言设置已保存：${languageSelect.options[languageSelect.selectedIndex].text}`);
    });
    
    // 保存主题设置按钮事件
    const saveThemeBtn = document.getElementById('saveThemeBtn');
    const themeSelect = document.getElementById('theme');
    saveThemeBtn.addEventListener('click', () => {
        alert(`主题设置已保存：${themeSelect.options[themeSelect.selectedIndex].text}`);
    });
}

// 返回首页
function returnToHome() {
    window.location.href = '../index.html';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);