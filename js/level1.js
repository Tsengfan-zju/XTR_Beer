// 定义不同场景的步骤数据
const scenarioData = {
    normal: [
        { id: 1, title: '来一杯', description: '此页显示当前啤酒的单价与单次打酒量，用户点击"来一杯"按钮，开始购买。', image: '../picture/level1/1-1.png' },
        { id: 2, title: '付款', description: '显示付款二维码与当前购买的信息，用户扫码支付，完成支付后，支付界面将自动跳转至下一个界面。', image: '../picture/level1/1-2.jpg' },
        { id: 3, title: '开始打酒', description: '用户扫码完成支付后，系统会自动识别支付成功并准备打酒，开启30s倒计时。若打酒过程中，杯满需要退出打酒，用户可点击左上角返回键，后台累计本次实际出酒量。', image: '../picture/level1/1-3.jpg' },
        { id: 4, title: '打酒中', description: '系统开始倒酒，显示倒酒进度与脉冲。若检测到脉冲，倒计时会重新更新为30s，确保用户有足够的时间打酒。', image: '../picture/level1/1-4.jpg' },
        { id: 5, title: '打酒完成', description: '当打酒完成后，界面上会显示"已完成"，并进入3秒自动返回流程。', image: '../picture/level1/1-5.jpg' },
        { id: 6, title: '返回首页', description: '倒酒完成后，系统进行3秒倒计时，后台累计本次实际出酒量，用户回到首页准备下一次操作。', image: '../picture/level1/1-6.png' }
    ],
    timeout: [
        { id: 1, title: '来一杯', description: '此页显示当前啤酒的单价与单次打酒量，用户点击"来一杯"按钮，开始购买。', image: '../picture/level1/2-1.png' },
        { id: 2, title: '付款', description: '显示付款二维码与当前购买的信息，用户扫码支付，完成支付后，支付界面将自动跳转至下一个界面。', image: '../picture/level1/2-2.jpg' },
        { id: 3, title: '开始打酒', description: '用户扫码完成支付后，系统会自动识别支付成功并准备打酒，开启30s倒计时。若打酒过程中，杯满需要退出打酒，用户可点击左上角返回键，后台累计本次实际出酒量。', image: '../picture/level1/2-3.jpg' },
        { id: 4, title: '超时', description: '若用户在规定时间内未拉动打酒手柄进行打酒，倒计时结束后将自动执行结束流程，防止打酒头长期被占用。此时可联系店员进行重打。若用户中途拉动打酒手柄打酒，倒计时重新更新为30s，确保用户有足够的时间打酒。', image: '../picture/level1/2-4.jpg' },
        { id: 5, title: '返回首页', description: '超时后，系统进行3秒倒计时，后台累计本次实际出酒量，用户回到首页准备下一次操作。', image: '../picture/level1/2-5.png' }
    ],
    soldout: [
        { id: 1, title: '来一杯', description: '此页显示当前啤酒的单价与单次打酒量，用户点击"来一杯"按钮，开始购买。显示付款二维码与当前购买的信息，用户扫码支付，完成支付后，支付界面将自动跳转至下一个界面。', image: '../picture/level1/3-1.png' },
        { id: 2, title: '付款', description: '用户扫码完成支付后，系统会自动识别支付成功并准备打酒，开启30s倒计时。若打酒过程中，杯满需要退出打酒，用户可点击左上角返回键，后台累计本次实际出酒量。', image: '../picture/level1/3-2.jpg' },
        { id: 3, title: '开始打酒', description: '系统开始倒酒，显示倒酒进度与脉冲。若检测到脉冲，倒计时会重新更新为30s，确保用户有足够的时间打酒。', image: '../picture/level1/3-3.jpg' },
        { id: 4, title: '打酒完成', description: '当打酒完成后，界面上会显示"已完成"，并进入3秒自动返回流程。', image: '../picture/level1/3-4.jpg' },
        { id: 5, title: '售罄', description: '倒酒完成后，系统进行3秒倒计时，后台累计本次实际出酒量，若累计酒量达到警戒值，则跳转至售罄界面。用户需联系店员更换酒桶。', image: '../picture/level1/3-5.jpg' }
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