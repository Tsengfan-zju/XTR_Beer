// 步骤数据
const steps = [
    {
        title: '系统介绍',
        description: '本系统集成第三方支付模块收钱吧，客户需自行开通注册收钱吧 APP，开通后扫码本机二维码绑定至自己的收钱吧账户中，收账支付信息在收钱吧 APP 内进行管理。',
        images: []
    },
    {
        title: '收钱吧账户开通',
        description: '客户可微信扫描以下二维码添加收钱吧专业客服协助注册开通收钱吧账号',
        images: ['../picture_pay/2.png']
    },
    {
        title: '设备与账目管理',
        description: '收钱吧账户开通后，在 APP 内进行小店添加，分别设置对应酒头的销售品类、销售价格',
        images: ['../picture_pay/3_1.jpg', '../picture_pay/3-2.jpg']
    },
    {
        title: '微信小店添加',
        description: '必要时可自行添加。',
        images: []
    }
];

// DOM元素
const stepOverview = document.getElementById('stepOverview');
const allStepsContainer = document.getElementById('allStepsContainer');
const returnHomeBtn = document.getElementById('returnHome');

// 初始化页面
function initPage() {
    // 创建步骤导航概览
    createStepOverview();
    
    // 渲染所有步骤内容
    renderAllSteps();
    
    // 添加返回首页事件监听
    returnHomeBtn.addEventListener('click', () => {
        window.location.href = '../index.html';
    });
}

// 创建步骤导航概览
function createStepOverview() {
    steps.forEach((step, index) => {
        const navItem = document.createElement('a');
        navItem.classList.add('step-nav-item');
        navItem.href = `#step-${index + 1}`;
        navItem.textContent = `${index + 1}. ${step.title}`;
        
        // 添加点击事件，平滑滚动到对应步骤
        navItem.addEventListener('click', (e) => {
            e.preventDefault();
            const targetStep = document.getElementById(`step-${index + 1}`);
            if (targetStep) {
                window.scrollTo({
                    top: targetStep.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
        
        stepOverview.appendChild(navItem);
    });
}

// 渲染所有步骤内容
function renderAllSteps() {
    steps.forEach((step, index) => {
        // 创建步骤项容器
        const stepItem = document.createElement('div');
        stepItem.classList.add('step-item');
        stepItem.id = `step-${index + 1}`;
        
        // 创建步骤头部
        const stepHeader = document.createElement('div');
        stepHeader.classList.add('step-item-header');
        
        const headerTitle = document.createElement('h2');
        const numberBadge = document.createElement('span');
        numberBadge.classList.add('step-number-badge');
        numberBadge.textContent = index + 1;
        
        const titleText = document.createTextNode(step.title);
        headerTitle.appendChild(numberBadge);
        headerTitle.appendChild(titleText);
        stepHeader.appendChild(headerTitle);
        
        // 创建步骤内容
        const stepContent = document.createElement('div');
        stepContent.classList.add('step-item-content');
        
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('step-content-wrapper');
        
        // 添加描述文本
        const textContent = document.createElement('div');
        textContent.classList.add('text-content');
        
        const description = document.createElement('p');
        description.classList.add('step-item-description');
        description.textContent = step.description;
        description.style.textAlign = 'left';
        
        textContent.appendChild(description);
        contentWrapper.appendChild(textContent);
        
        // 添加图片（如果有）
        if (step.images && step.images.length > 0) {
            const imagesContainer = document.createElement('div');
            imagesContainer.classList.add('images-container');
            
            step.images.forEach(imageSrc => {
                const img = document.createElement('img');
                img.classList.add('step-item-image');
                img.src = imageSrc;
                img.alt = step.title;
                imagesContainer.appendChild(img);
            });
            
            contentWrapper.appendChild(imagesContainer);
        }
        
        stepContent.appendChild(contentWrapper);
        
        // 组装步骤项
        stepItem.appendChild(stepHeader);
        stepItem.appendChild(stepContent);
        
        // 添加到容器
        allStepsContainer.appendChild(stepItem);
    });
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initPage);