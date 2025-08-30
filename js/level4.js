// 定义常见问题数据
const faqData = {
    general: [
        { question: '如何使用智能啤酒机购买啤酒？', answer: '使用智能啤酒机购买啤酒非常简单。首先，在主界面选择您喜欢的啤酒类型；然后确认您的选择和价格；接着选择支付方式并完成支付；支付成功后，系统会自动出酒；最后，取走您的啤酒即可。' },
        { question: '啤酒机支持哪些支付方式？', answer: '我们的智能啤酒机支持多种支付方式，包括微信支付、支付宝和银行卡支付。您可以根据自己的喜好选择最便捷的支付方式。' },
        { question: '啤酒的保质期是多久？', answer: '啤酒的保质期取决于多种因素，包括啤酒类型、存储条件等。一般来说，未经开启的啤酒在适宜的温度下（4-6℃）可以保存3-6个月。我们会定期检查和更换过期的啤酒，请放心购买。' },
        { question: '如何知道啤酒是否已经售罄？', answer: '当啤酒售罄时，系统会在界面上显示"售罄"状态。同时，您也可以在购买前查看每种啤酒的库存状态，以避免选择已售罄的啤酒。' },
        { question: '购买啤酒后可以退换吗？', answer: '由于啤酒是即时消费的食品，如果没有质量问题，一般不支持退换。如果您在购买过程中遇到问题，请及时联系客服处理。' }
    ],
    dispense: [
        { question: '啤酒不出酒怎么办？', answer: '如果啤酒不出酒，首先检查是否已成功支付。如果支付成功但仍然不出酒，可能是出酒口堵塞或机械故障。您可以尝试轻轻拍打出酒口周围，或联系工作人员进行维修。' },
        { question: '出酒速度很慢是什么原因？', answer: '出酒速度慢可能有几个原因：一是酒管中有空气；二是啤酒温度过低；三是出酒口部分堵塞。您可以尝试多次短按出酒按钮排除空气，或者联系工作人员进行检查。' },
        { question: '啤酒泡沫太多怎么办？', answer: '啤酒泡沫太多通常是由于出酒速度过快或角度不当造成的。您可以尝试调整接酒的角度，让啤酒沿着杯壁流下，或者联系工作人员调整出酒参数。' },
        { question: '出酒过程中设备突然停止工作怎么办？', answer: '如果在出酒过程中设备突然停止工作，首先检查是否是因为网络或电源问题。如果排除了这些因素，可能是设备内部故障，请联系工作人员进行维修，不要自行拆卸设备。' },
        { question: '取酒后发现啤酒有异味怎么办？', answer: '如果您发现啤酒有异味，可能是啤酒已经变质或设备需要清洁。请保留啤酒样本并立即联系工作人员，我们会为您提供退款或更换服务。' }
    ],
    payment: [
        { question: '扫码后无法完成支付怎么办？', answer: '如果扫码后无法完成支付，首先检查您的网络连接是否正常。如果网络正常但仍然无法支付，可能是支付系统暂时出现问题。您可以稍后再试，或者选择其他支付方式。' },
        { question: '支付成功但设备没有反应怎么办？', answer: '如果支付成功但设备没有反应，首先检查您的支付记录是否显示支付成功。如果确实支付成功，可以联系客服提供支付凭证，我们会为您处理退款或重新出酒。' },
        { question: '如何申请退款？', answer: '如果您需要申请退款，可以通过设备上的客服联系方式或我们的官方网站提交退款申请。请提供您的支付凭证和详细情况，我们会尽快处理您的申请。' },
        { question: '可以使用优惠券或折扣码吗？', answer: '是的，我们的智能啤酒机支持使用优惠券和折扣码。在支付前，您可以在界面上找到"使用优惠券"或"输入折扣码"的选项，按照提示操作即可享受优惠。' },
        { question: '支付信息安全吗？', answer: '我们非常重视用户的支付信息安全。所有支付信息都经过加密处理，不会被泄露或滥用。我们使用的支付系统符合行业安全标准，请放心使用。' }
    ],
    maintenance: [
        { question: '啤酒机多久需要清洁一次？', answer: '为了保证啤酒的品质和设备的正常运行，我们建议每周对啤酒机进行一次基本清洁，包括出酒口、接酒区域和设备外部。每月进行一次全面清洁和维护。' },
        { question: '如何清洁出酒口？', answer: '清洁出酒口时，首先关闭设备电源，然后使用专用的清洁刷或湿布轻轻擦拭出酒口。注意不要使用过于锋利的工具，以免损坏出酒口。清洁完成后，打开电源并运行一次清水冲洗程序。' },
        { question: '啤酒机需要定期消毒吗？', answer: '是的，啤酒机需要定期消毒，特别是与啤酒直接接触的部件。我们建议每两周进行一次消毒处理，使用食品级消毒液按照说明书的比例稀释后进行消毒。' },
        { question: '如何检查啤酒机的温度是否正常？', answer: '啤酒机通常会在界面上显示当前的温度。您也可以用温度计测量啤酒的温度，正常情况下，啤酒的温度应该在4-6℃之间。如果温度异常，请联系工作人员进行调整。' },
        { question: '发现设备有漏水现象怎么办？', answer: '如果发现设备有漏水现象，应立即停止使用并联系工作人员进行维修。不要尝试自行拆卸设备，以免造成更严重的损坏或安全事故。' }
    ],
    other: [
        { question: '如何联系客服？', answer: '您可以通过设备上显示的客服电话或二维码联系我们的客服团队。我们的客服人员会在工作时间内为您提供专业的帮助。' },
        { question: '啤酒机的营业时间是什么时候？', answer: '啤酒机的营业时间取决于安装地点的规定。一般来说，商场、酒吧等场所的啤酒机会与场所的营业时间保持一致。您可以在设备附近查看具体的营业时间信息。' },
        { question: '可以自定义啤酒的口味吗？', answer: '目前我们的智能啤酒机主要提供预设的啤酒口味。不过，我们正在开发支持自定义口味的功能，敬请期待。' },
        { question: '如何成为我们的合作伙伴？', answer: '如果您有兴趣成为我们的合作伙伴，可以通过官方网站或客服电话联系我们的商务合作团队。我们会为您提供详细的合作方案和支持政策。' },
        { question: '啤酒机适合安装在哪些场所？', answer: '我们的智能啤酒机适合安装在多种场所，包括酒吧、餐厅、商场、办公楼、体育场馆等。只要有稳定的电源和网络连接，就可以安装和使用我们的啤酒机。' }
    ],
    boss: [
        { question: '一直显示"暂停/售罄"', answer: '● 检查是否在售、是否更换酒桶；\n● 看"容器容量 − 累计售卖"是否大于报警阈值；\n● 更换酒桶后别忘了清零累计并设置新桶容量。' },
        { question: '扫码后不出酒', answer: '● 支付后台修改了前缀/后缀后，务必保存并回到支付页试扫，确保可以正常付款；' },
        { question: '出酒超时', answer: '● 默认 30s；10s 时已发送 T_OUT，语音播报即将超时请尽快打酒，0s 时发送 T_OVER，提示超时，然后照常 3 秒返回；\n● 可在管理页调大限制时间。' },
        { question: '出酒量不准/泡沫多', answer: '● 用量杯做一次脉冲校准（500ml/脉冲数→保存）。' },
        { question: '忘记管理员密码', answer: '● 使用左上角的恢复出厂设置热区，恢复后 PIN1 变为 123456。' }
    ],
    defaults: [
        { question: '默认参数一览（出厂设置）', answer: '● 名称：青岛啤酒｜价格：18.88 元/500ml\n● 单次出酒：500ml｜容器容量：10000ml\n● 报警阈值：200ml｜限制时间：30s\n● 累计售卖：0ml｜脉冲校准：500ml / 400 脉冲（ppml=0.8）\n● 管理员 PIN1：123456（请尽快修改）' }
    ]
};

// DOM元素
const faqTabs = document.getElementById('faqTabs');
const faqList = document.getElementById('faqList');
const returnHomeBtn = document.getElementById('returnHome');

// 初始化页面
function initPage() {
    // 初始化问题分类标签事件监听
    const tabs = faqTabs.querySelectorAll('.faq-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            changeCategory(category);
        });
    });
    
    // 初始化返回首页按钮事件监听
    returnHomeBtn.addEventListener('click', returnToHome);
    
    // 初始化显示常见问题
    changeCategory('boss');
}

// 切换问题分类
function changeCategory(category) {
    // 更新标签状态
    const tabs = faqTabs.querySelectorAll('.faq-tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-category') === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // 生成问题列表
    generateFaqList(category);
}

// 生成问题列表
function generateFaqList(category) {
    faqList.innerHTML = '';
    const faqs = faqData[category];
    
    // 默认参数分类特殊处理
    if (category === 'defaults') {
        const defaultsContainer = document.createElement('div');
        defaultsContainer.classList.add('defaults-container');
        
        faqs.forEach(faq => {
            const title = document.createElement('h3');
            title.textContent = faq.question;
            
            const content = document.createElement('div');
            content.classList.add('defaults-content');
            
            // 将文本中的换行符转换为HTML的br标签
            const paragraphs = faq.answer.split('\n');
            paragraphs.forEach(para => {
                const p = document.createElement('p');
                p.innerHTML = para.replace(/\n/g, '<br>');
                content.appendChild(p);
            });
            
            defaultsContainer.appendChild(title);
            defaultsContainer.appendChild(content);
        });
        
        faqList.appendChild(defaultsContainer);
    } else {
        // 普通问题列表处理
        faqs.forEach((faq, index) => {
            const faqItem = document.createElement('div');
            faqItem.classList.add('faq-item');
            
            const questionBtn = document.createElement('button');
            questionBtn.classList.add('faq-question');
            questionBtn.textContent = faq.question;
            
            const answerDiv = document.createElement('div');
            answerDiv.classList.add('faq-answer');
            const answerPara = document.createElement('p');
            // 将文本中的换行符转换为HTML的br标签
            answerPara.innerHTML = faq.answer.replace(/\n/g, '<br>');
            answerDiv.appendChild(answerPara);
            
            faqItem.appendChild(questionBtn);
            faqItem.appendChild(answerDiv);
            faqList.appendChild(faqItem);
            
            // 添加问题点击事件
            questionBtn.addEventListener('click', () => {
                questionBtn.classList.toggle('active');
                answerDiv.classList.toggle('active');
            });
        });
    }
}

// 返回首页
function returnToHome() {
    window.location.href = '../index.html';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);