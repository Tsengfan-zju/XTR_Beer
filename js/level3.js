// 场景数据定义
const scenarioData = {
    analytics: [
        {
            title: "销售数据概览",
            description: "查看每日、每周和每月的销售总额和趋势分析，帮助您了解业务状况。",
            image: "../picture/level3/1-1.png"
        },
        {
            title: "销量排行榜",
            description: "查看各种啤酒的销量排名，了解哪些产品最受欢迎，优化进货决策。",
            image: "../picture/level3/1-2.png"
        },
        {
            title: "库存预警",
            description: "实时监控各款啤酒的库存状态，当库存不足时及时收到预警通知。",
            image: "../picture/level3/1-3.png"
        }
    ],
    settings: [
        {
            title: "系统设置",
            description: "这里是系统设置",
            image: "../picture/level3/2-1.png"
        }
    ]
};

// 当前状态
let currentScenario = "analytics";
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
    stepImage.src = currentStepData.image;
    stepTitle.textContent = currentStepData.title;
    stepDescription.textContent = currentStepData.description;
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