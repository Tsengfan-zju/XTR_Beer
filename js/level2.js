// 定义不同场景的步骤数据
const scenarioData = {
    management: [
        { id: 1, title: '点击热区', description: '店员长按右上角隐藏热区1-3s，输入店员密码，初始密码为123456（尽快修改），进入运营后台。', image: '../picture/level2/1-1.png' },
        { id: 2, title: '运营后台', description: '运营后台展示可更改的各项参数，点击即可编辑。\n\n第一部分：基本参数\n● 名称：当前酒的名称（其他：点击其他，可选择已另存的酒类）\n● 单价：单次出酒量对应的价格\n● 限制时间：单次打酒的倒计时\n● 单次出酒：单次打酒的毫升数\n● 容器总量：酒桶的容量\n● 报警阈值：当酒桶的容量为多少时，停止售卖\n● 累计售卖：目前已售卖的酒量，不可编辑（清零：点击清零后，累计售卖清零。注意在每次更换酒桶后需要手动清零，否则将引起“售罄”现象）\n\n第二部分脉冲系数校准：\n● 出酒量： 校准的出酒量\n● 脉冲数： 校准的出酒量所对应的脉冲数\n● 脉冲系数：脉冲数/出酒量的比值\n\n保存：每次修改后必须保存本次修改\n另存为：将本套方案另存至配方，方便下次直接选择该方案', image: '../picture/level2/1-2.png' },
        { id: 3, title: '配方管理', description: '点击其他后，将进入已经保存的配方管理界面，共10个保存的槽位。点击不同的槽位，会在预览区显示该槽位保存的内容。点击应用，使用该槽位的相关参数；点击删除，清空该槽位。', image: '../picture/level2/1-3.png' }
    ],
    pulse: [
        { id: 1, title: '来一杯', description: '店员通过打酒页面的脉冲数进行脉冲校准。因此需要使用正常用户的付款流程。店员点击"来一杯"按钮，开始测试。', image: '../picture/level2/2-1.png' },
        { id: 2, title: '付款', description: '店员扫码支付，完成支付后，支付界面将自动跳转至下一个界面。', image: '../picture/level2/2-2.jpg' },
        { id: 3, title: '开始打酒', description: '店员扫码完成支付后，系统会自动识别支付成功并准备打酒，开启30s倒计时。', image: '../picture/level2/2-3.jpg' },
        { id: 4, title: '记录脉冲数', description: '系统开始倒酒，显示倒酒进度与脉冲。忽略设备上显示的毫升数，店员通过记录脉冲数，使用量杯测试固定脉冲数打出多少真实毫升。脉冲数可在运营后台界面进行设置，如本次需要测试100个脉冲会打多少毫升的酒，店员需在运营后台界面设置脉冲数为100。', image: '../picture/level2/2-4.jpg' },
        { id: 5, title: '完成校准', description: '店员记录本次的脉冲数，测试打出的真实毫升数，在管理界面修改对应脉冲数对应的真实毫升数，完成校准。', image: '../picture/level2/2-5.jpg' },
        { id: 6, title: '返回首页', description: '倒酒完成后，系统进行3秒倒计时，后台累计本次实际出酒量，回到首页准备下一次操作。', image: '../picture/level2/2-6.png' }
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