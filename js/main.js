// 全局JavaScript文件，处理全局逻辑和功能

// 页面加载完成后的初始化
function initApp() {
    // 设置页面标题
    setPageTitle();
    
    // 添加页面加载动画
    addPageTransition();
    
    // 设置响应式菜单
    setupResponsiveMenu();
    
    // 添加平滑滚动
    addSmoothScroll();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
}

// 设置页面标题
function setPageTitle() {
    // 可以根据页面URL动态设置标题
    const pageTitle = document.title;
    document.title = pageTitle || '智能啤酒机使用教程';
}

// 添加页面加载动画
function addPageTransition() {
    // 页面加载完成后显示内容
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('loaded');
    });
}

// 设置响应式菜单
function setupResponsiveMenu() {
    // 可以在这里添加移动端菜单逻辑
    // 例如：点击汉堡按钮显示/隐藏菜单等
}

// 添加平滑滚动
function addSmoothScroll() {
    // 为所有内部链接添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 减去头部高度
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 处理窗口大小变化
function handleResize() {
    // 根据窗口大小调整页面元素
    const windowWidth = window.innerWidth;
    
    // 可以在这里添加响应式调整逻辑
}

// 表单验证功能
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            // 添加错误样式
            input.classList.add('error');
        } else {
            // 移除错误样式
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// 显示通知消息
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.classList.add(`notification-${type}`);
    notification.textContent = message;
    
    // 添加到body
    document.body.appendChild(notification);
    
    // 添加显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 设置自动隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 存储用户偏好设置
function saveUserPreferences(preferences) {
    try {
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        return true;
    } catch (error) {
        console.error('保存用户偏好设置失败:', error);
        return false;
    }
}

// 获取用户偏好设置
function getUserPreferences() {
    try {
        const preferences = localStorage.getItem('userPreferences');
        return preferences ? JSON.parse(preferences) : null;
    } catch (error) {
        console.error('获取用户偏好设置失败:', error);
        return null;
    }
}

// 页面加载完成后初始化应用
window.addEventListener('DOMContentLoaded', initApp);