// 定义不同场景的步骤数据
const scenarioData = {
    management: [
        { id: 1, title: '进入管理模式', description: '首先需要输入管理员密码进入管理模式。通常在设备背面或侧面有物理按钮或密码输入区域。', image: '../picture/level2/1-1.png' },
        { id: 2, title: '查看库存状态', description: '在管理模式下，您可以查看每种啤酒的库存状态，了解哪些啤酒需要补货。', image: '../picture/level2/1-2.png' },
        { id: 3, title: '清洁维护', description: '按照系统提示进行定期清洁维护，包括出酒口、接酒区域和设备外部的清洁。', image: '../picture/level2/1-3.png' }
    ],
    pulse: [
        { id: 1, title: '准备脉冲测试', description: '在进行脉冲测试前，请确保设备已断电，并已断开所有外部连接。', image: '../picture/level2/2-1.png' },
        { id: 2, title: '进入测试模式', description: '按照设备说明书的指导进入脉冲测试模式。通常需要同时按住特定的按钮组合。', image: '../picture/level2/2-2.jpg' },
        { id: 3, title: '执行脉冲测试', description: '在测试模式下，启动脉冲测试功能，观察设备是否能够正常响应脉冲信号。', image: '../picture/level2/2-3.jpg' },
        { id: 4, title: '记录测试结果', description: '记录测试过程中观察到的任何异常情况，包括声音、指示灯状态等。', image: '../picture/level2/2-4.jpg' },
        { id: 5, title: '分析测试数据', description: '根据测试结果分析设备的运行状态，判断是否存在需要维修的部件。', image: '../picture/level2/2-5.jpg' },
        { id: 6, title: '完成测试', description: '测试完成后，退出测试模式，重新连接所有外部设备，并恢复正常供电。', image: '../picture/level2/2-6.png' }
    ]
};

// 当前状态
let currentScenario = 'management';
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
    
    // 初始化显示管理模式的第一步
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
    
    const contentWrapper = stepContent.querySelector('.content-wrapper');
    const stepImage = contentWrapper.querySelector('.step-image');
    const stepTitle = contentWrapper.querySelector('.step-title');
    const stepDescription = contentWrapper.querySelector('.step-description');
    
    stepImage.src = currentStepData.image;
    stepImage.alt = currentStepData.title;
    stepTitle.textContent = currentStepData.title;
    stepDescription.textContent = currentStepData.description;
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