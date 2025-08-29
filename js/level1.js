// 定义不同场景的步骤数据
const scenarioData = {
    normal: [
        { id: 1, title: '选择啤酒', description: '在主界面选择您喜欢的啤酒类型。系统会显示所有可用的啤酒选项。' },
        { id: 2, title: '确认选择', description: '确认您的啤酒选择。检查价格和容量信息是否正确。' },
        { id: 3, title: '支付方式', description: '选择支付方式，可以使用微信支付、支付宝或银行卡支付。' },
        { id: 4, title: '扫码支付', description: '使用手机扫描屏幕上的二维码进行支付。' },
        { id: 5, title: '等待出酒', description: '支付成功后，系统开始出酒。请耐心等待啤酒完全流出。' },
        { id: 6, title: '取酒完成', description: '啤酒已经准备好，请取走您的啤酒并享受。记得拿走您的银行卡或手机。' }
    ],
    timeout: [
        { id: 1, title: '操作超时提示', description: '系统显示操作超时提示，提示您的操作已经超过了规定时间。' },
        { id: 2, title: '返回主界面', description: '系统自动返回主界面，您可以重新开始选择啤酒的流程。' },
        { id: 3, title: '重新选择', description: '在主界面重新选择您喜欢的啤酒类型，系统会重新计时。' },
        { id: 4, title: '快速操作', description: '尽量在规定时间内完成操作，避免再次超时。' },
        { id: 5, title: '联系客服', description: '如果频繁出现超时问题，可以联系客服寻求帮助。' }
    ],
    soldout: [
        { id: 1, title: '售罄提示', description: '当您选择的啤酒显示为售罄状态时，系统会有明确的提示。' },
        { id: 2, title: '选择其他啤酒', description: '系统会引导您选择其他可用的啤酒类型。' },
        { id: 3, title: '查看补货时间', description: '有些系统会显示下一次补货的预计时间。' },
        { id: 4, title: '添加到提醒列表', description: '您可以将售罄的啤酒添加到提醒列表，以便补货后收到通知。' },
        { id: 5, title: '推荐类似啤酒', description: '系统会根据您的喜好推荐类似口味的啤酒。' },
        { id: 6, title: '继续购买', description: '选择替代啤酒后，继续购买流程。' }
    ]
};

// 当前状态
let currentScenario = 'normal';
let currentStep = 0; // 索引从0开始

// DOM元素
const scenarioBtns = document.querySelectorAll('.scenario-btn');
const stepIndicators = document.getElementById('stepIndicators');
const stepContent = document.getElementById('stepContent');
const prevStepBtn = document.getElementById('prevStep');
const nextStepBtn = document.getElementById('nextStep');

// 初始化页面
function initPage() {
    // 初始化场景选择事件监听
    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const scenario = btn.getAttribute('data-scenario');
            changeScenario(scenario);
        });
    });
    
    // 初始化步骤控制按钮事件监听
    prevStepBtn.addEventListener('click', goToPrevStep);
    nextStepBtn.addEventListener('click', goToNextStep);
    
    // 初始化显示正常情况的第一步
    updatePage();
}

// 切换场景
function changeScenario(scenario) {
    currentScenario = scenario;
    currentStep = 0;
    
    // 更新场景按钮状态
    scenarioBtns.forEach(btn => {
        if (btn.getAttribute('data-scenario') === scenario) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 更新页面内容
    updatePage();
}

// 生成步骤指示器
function generateStepIndicators() {
    stepIndicators.innerHTML = '';
    const steps = scenarioData[currentScenario];
    
    steps.forEach((step, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('step-indicator');
        if (index === currentStep) {
            indicator.classList.add('active');
        }
        indicator.addEventListener('click', () => {
            currentStep = index;
            updatePage();
        });
        stepIndicators.appendChild(indicator);
    });
}

// 更新步骤内容
function updateStepContent() {
    const steps = scenarioData[currentScenario];
    const currentStepData = steps[currentStep];
    
    stepContent.innerHTML = `
        <h2 class="step-title">${currentStepData.title}</h2>
        <p class="step-description">${currentStepData.description}</p>
    `;
}

// 更新步骤控制按钮状态
function updateControlButtons() {
    const steps = scenarioData[currentScenario];
    
    // 更新上一步按钮
    if (currentStep === 0) {
        prevStepBtn.disabled = true;
    } else {
        prevStepBtn.disabled = false;
    }
    
    // 更新下一步按钮
    if (currentStep === steps.length - 1) {
        nextStepBtn.textContent = '返回首页';
    } else {
        nextStepBtn.textContent = '下一步';
    }
}

// 前往上一步
function goToPrevStep() {
    if (currentStep > 0) {
        currentStep--;
        updatePage();
    }
}

// 前往下一步
function goToNextStep() {
    const steps = scenarioData[currentScenario];
    
    if (currentStep < steps.length - 1) {
        currentStep++;
        updatePage();
    } else {
        // 如果是最后一步，点击"下一步"返回首页
        window.location.href = '../index.html';
    }
}

// 更新整个页面
function updatePage() {
    generateStepIndicators();
    updateStepContent();
    updateControlButtons();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);