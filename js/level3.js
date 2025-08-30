// 场景数据定义
const scenarioData = {
    management: [
        {
            title: "点击一级热区",
            description: "老板长按右上角隐藏热区1-3s，输入店员密码，初始密码为123456（尽快修改），进入运营后台。",
            image: "../picture/level3/1-1.png"
        },
        {
            title: "点击二级热区",
            description: "老板长按右上角隐藏热区1-3s，输入老板二级密码（二级密码将在售卖设备时告知，请务必妥善保管），进入支付后台。",
            image: "../picture/level3/1-2.png"
        },
        {
            title: "支付后台",
            description: "在该页可修改店员一级密码及收款信息。通常可保持收款网址，仅需修改收款编码，具体收钱吧收款码申请地址在本网站后续有介绍。修改后点击保存，保存本次修改信息。",
            image: "../picture/level3/1-3.png"
        }
    ],
    reset: [
        {
            title: "点击初始化热区",
            description: "老板长按左上角隐藏热区1-3s，输入初始化三级密码（三级密码将在售卖设备时告知，请务必妥善保管），将本机恢复出厂设置。出厂设置参数见本网站后续内容。",
            image: "../picture/level3/2-1.png"
        },
        {
            title: "恢复初始化",
            description: "恢复出厂设置后请尽快更改默认一级密码123456。",
            image: "../picture/level3/2-1.png"
        }
    ]
};

// 当前状态
let currentScenario = "management";
let currentStep = 0;

// DOM元素
const scenarioSelectors = document.querySelectorAll(".scenario-btn");
const stepIndicators = document.getElementById("stepIndicators");
const stepContent = document.getElementById("stepContent");
const stepImage = document.querySelector(".step-image");
const stepTitle = document.querySelector(".step-title");
const stepDescription = document.querySelector(".step-description");
const prevStepBtn = document.getElementById("prevStep");
const nextStepBtn = document.getElementById("nextStep");

// 页面初始化函数
function initPage() {
    // 为场景选择按钮添加事件监听器
    scenarioSelectors.forEach(btn => {
        btn.addEventListener("click", function() {
            changeScenario(this.dataset.scenario);
        });
    });

    // 为步骤控制按钮添加事件监听器
    prevStepBtn.addEventListener("click", goToPrevStep);
    nextStepBtn.addEventListener("click", goToNextStep);

    // 初始化页面显示
    updatePage();
}

// 切换场景函数
function changeScenario(scenario) {
    if (scenario === currentScenario) return;
    
    // 更新当前场景
    currentScenario = scenario;
    currentStep = 0;
    
    // 更新场景选择按钮的激活状态
    scenarioSelectors.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.scenario === scenario);
    });
    
    // 更新页面内容
    updatePage();
}

// 生成步骤指示器函数
function generateStepIndicators() {
    // 清空现有指示器
    stepIndicators.innerHTML = "";
    
    // 获取当前场景的步骤数量
    const steps = scenarioData[currentScenario];
    
    // 生成新的指示器
    steps.forEach((_, index) => {
        const indicator = document.createElement("button");
        indicator.className = "step-indicator";
        indicator.dataset.index = index;
        
        // 设置激活状态
        if (index === currentStep) {
            indicator.classList.add("active");
        }
        
        // 添加点击事件
        indicator.addEventListener("click", function() {
            goToStep(parseInt(this.dataset.index));
        });
        
        stepIndicators.appendChild(indicator);
    });
}

// 更新步骤内容函数
function updateStepContent() {
    // 获取当前步骤数据
    const steps = scenarioData[currentScenario];
    const currentStepData = steps[currentStep];
    
    // 更新DOM内容
    if (currentStepData.image) {
        stepImage.src = currentStepData.image;
        stepImage.alt = currentStepData.title;
    }
    stepTitle.textContent = currentStepData.title;
    // 将文本中的换行符转换为HTML的br标签，确保正确换行显示
    stepDescription.innerHTML = currentStepData.description.replace(/\n/g, '<br>');
}

// 更新控制按钮状态函数
function updateControlButtons() {
    // 获取当前场景的步骤数量
    const steps = scenarioData[currentScenario];
    const totalSteps = steps.length;
    
    // 更新按钮状态
    prevStepBtn.disabled = currentStep === 0;
    nextStepBtn.disabled = currentStep === totalSteps - 1;
}

// 前往指定步骤函数
function goToStep(stepIndex) {
    const steps = scenarioData[currentScenario];
    if (stepIndex >= 0 && stepIndex < steps.length) {
        currentStep = stepIndex;
        updatePage();
    }
}

// 前往上一步函数
function goToPrevStep() {
    goToStep(currentStep - 1);
}

// 前往下一步函数
function goToNextStep() {
    goToStep(currentStep + 1);
}

// 更新整个页面函数
function updatePage() {
    updateStepContent();
    generateStepIndicators();
    updateControlButtons();
}

// 页面加载完成后初始化
window.addEventListener("DOMContentLoaded", initPage);