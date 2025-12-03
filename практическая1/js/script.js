// js/script.js
// ________________________________________________________________________________Прокрутка фона_____________________________________________________________________________
window.addEventListener('scroll', function () {
    const bg = document.querySelector('.scrolling-bg');
    if (bg) {
        const scrolled = window.pageYOffset;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrolled / maxScroll;
        const bgMovement = scrollPercent * 50;
        bg.style.transform = `translateY(-${bgMovement}vh)`;
    }
});

// __________________________________________________________________________Обработка формы__________________________________________________________________________________________________________
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;

            // Создаем простое уведомление
            const notification = document.createElement('div');
            notification.className = 'notification';

            notification.textContent = "Ваше обращение отправлено! Ваш отзыв очень важен для вас!";
            notification.style.background = '#4CAF50';

            // Очищаем форму
            this.reset();
            document.body.appendChild(notification);

            // Удаляем уведомление через 3 секунды
            setTimeout(() => {
                notification.remove();
            }, 3000);
        });
    }
});

// __________________________________________________________________________Кнопка "вверх"________________________________________________________________________________________
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.title = 'Вернуться наверх';
document.body.appendChild(scrollToTopBtn);

// Показываем/скрываем кнопку при скролле
window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Плавная прокрутка при клике
scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// _______________________________________________________________________Боковое меню_________________________________________________________________________________
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const body = document.body;

// Создаем элементы если их нет в HTML
if (!menuToggle) {
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-toggle';
    menuBtn.id = 'menuToggle';
    menuBtn.innerHTML = '<span></span><span></span><span></span>';
    document.body.appendChild(menuBtn);

    const sidePanel = document.createElement('div');
    sidePanel.className = 'sidebar';
    sidePanel.id = 'sidebar';
    sidePanel.innerHTML = `
        <nav class="sidebar-nav">
            <a href="../index.html">Главная</a>
            <a href="../aboutus.html">О нас</a>
            <a href="../contacts.html">Контакты</a>
        </nav>
    `;
    document.body.appendChild(sidePanel);
}

// Открытие/закрытие меню
menuToggle.addEventListener('click', function () {
    sidebar.classList.toggle('open');
    body.classList.toggle('sidebar-open');
});

// Закрытие меню при клике вне его
document.addEventListener('click', function (e) {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target) && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        body.classList.remove('sidebar-open');
    }
});

// Показываем кнопку меню при прокрутке
window.addEventListener('scroll', function () {
    if (window.pageYOffset > 100) {
        body.classList.add('show-menu-toggle');
    } else {
        body.classList.remove('show-menu-toggle');
        sidebar.classList.remove('open');
        body.classList.remove('sidebar-open');
    }
});

// __________________________________________________Корзина____________________________________________________
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Функция добавления в корзину
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    showNotification(`"${product.name}" добавлен в корзину`);
    updateCartCounter();
}

// Функция обновления счетчика корзины
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartCounters = document.querySelectorAll('#cartCounter');

    if (cartCounters.length > 0) {
        cartCounters.forEach(counter => {
            counter.textContent = totalItems;
        });
    }
}

// Функция показа уведомлений
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#f44336' : '#4CAF50'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// Функция оформления заказа
function checkout() {
    if (cart.length === 0) {
        showNotification('Корзина пуста', 'error');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const productList = cart.map(item =>
        `${item.name}${item.quantity > 1 ? ` (${item.quantity} шт.)` : ''}`
    ).join(', ');

    showNotification(`
        Заказ оформлен!<br>
        <strong>Товары:</strong> ${productList}<br>
        <strong>Итого:</strong> ${total} ₽<br>
        <small>Спасибо за заказ!</small>
    `, 'success');

    // Очищаем корзину
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    displayCartItems();
}

// Показываем корзину на странице
function displayCartItems() {
    const cartContainer = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');

    if (!cartContainer) return;

    //всегда берем свежие данные из localStorage (фикс для стрелки назад)
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="color: black; text-align: center;">Корзина пуста</p>';
        totalElement.textContent = '0';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    totalElement.textContent = total;

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" style="
            border: 1px solid #e0e0e0; 
            padding: 12px; 
            margin: 8px 0; 
            border-radius: 8px;
            background: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            color: black;
        ">
            <div style="flex: 1;">
                <h4 style="margin: 0 0 5px 0; font-size: 14px; color: black;">${item.name}</h4>
                <p style="margin: 0; font-size: 12px; color: #666;">${item.price} ₽ × ${item.quantity || 1}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-weight: bold; font-size: 14px; color: black;">
                    ${item.price * (item.quantity || 1)} ₽
                </span>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button onclick="changeQuantity('${item.id}', -1)" 
                            style="width: 25px; height: 25px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 3px; cursor: pointer;">-</button>
                    <span style="min-width: 20px; text-align: center; color: black;">${item.quantity || 1}</span>
                    <button onclick="changeQuantity('${item.id}', 1)" 
                            style="width: 25px; height: 25px; border: 1px solid #ddd; background: #f5f5f5; border-radius: 3px; cursor: pointer;">+</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Функция изменения количества
function changeQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity = (item.quantity || 1) + change;

    // Если количество стало 0 или меньше - удаляем товар
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    displayCartItems();
}

// Удаление товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    displayCartItems();
    showNotification('Товар удален из корзины');
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function () {
    updateCartCounter();
    if (window.location.pathname.includes('korzina.html')) {
        displayCartItems();
    }
});
//инициализация работает при любой загрузке страницы
function initCart() {
    // Всегда обновляем данные из localStorage
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCounter();

    if (window.location.pathname.includes('korzina.html')) {
        displayCartItems();
    }
}

// Срабатывает при первой загрузке
document.addEventListener('DOMContentLoaded', initCart);

//Срабатывает при возврате стрелочкой (когда страница восстанавливается из кэша)
window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
        console.log('Страница восстановлена из кэша (стрелка назад)');
        initCart();
    }
});

