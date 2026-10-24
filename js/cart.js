import { categories } from './categories.js';

const CART_KEY = 'codecoffee_cart';
const cartCountEl = document.getElementById('cartCount');

export function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

export function updateCartCount() {
    cartCountEl.textContent = getCart().length;
}

export function addToCart(name, price) {
    const cart = getCart();
    cart.push({ name, price });
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
    alert('Đã thêm vào giỏ hàng: ' + name);
}

export function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

export function openCart() {
    const cart = getCart();
    let html = '<h3>Giỏ Hàng</h3>';
    if (cart.length === 0) {
        html += '<p>Giỏ hàng trống.</p>';
    } else {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        html += '<ul class="cart-items">';
        cart.forEach((item, i) => {
            html += `<li>${item.name} - ${item.price.toLocaleString('vi-VN')} đ
                <button data-remove="${i}">Xóa</button></li>`;
        });
        html += '</ul>';
        html += `<p class="cart-total">Tổng: ${total.toLocaleString('vi-VN')} đ</p>`;
    }
    openNav(html);
}

export function openMenu() {
    let html = '<ul class="nav-menu-list">';
    categories.forEach(c => {
        html += `<li><a href="#">${c.name}</a></li>`;
    });
    html += '</ul>';
    openNav(html);
}

function openNav(html) {
    const nav = document.getElementById('navMenu');
    nav.innerHTML = html;
    nav.classList.add('active');
}

function toggle(openFn) {
    const nav = document.getElementById('navMenu');
    if (nav.classList.contains('active')) closeNav();
    else openFn();
}

export function closeNav() {
    document.getElementById('navMenu').classList.remove('active');
}

export function initCart() {
    updateCartCount();
    document.getElementById('cartBtn').addEventListener('click', () => toggle(openCart));
    document.getElementById('menuBtn').addEventListener('click', () => toggle(openMenu));

    document.getElementById('navMenu').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-remove]');
        if (!btn) return;
        removeFromCart(Number(btn.dataset.remove));
        openCart();
    });

    document.addEventListener('click', (e) => {
        const nav = document.getElementById('navMenu');
        if (!nav.classList.contains('active')) return;
        if (e.target.closest('#navMenu, #cartBtn, #menuBtn')) return;
        closeNav();
    });
}
