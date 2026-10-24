import { initAuth } from '../../js/auth.js';
import { renderCategories, categories } from '../../js/categories.js';
import { initSearch } from '../../js/products.js';
import { initCart } from '../../js/cart.js';

const subPageUrls = {
    1: './uu-dai.html',
    2: './dong-gia-sh.html',
    3: './mon-moi.html',
    4: './cb-1-nguoi.html',
    5: './cb-nhom.html',
    6: './ga-ran-quay.html',
    7: './burger-com-my.html',
    8: './an-vat.html',
    9: './thuc-uong.html'
};

document.addEventListener('DOMContentLoaded', () => {
    initAuth();

    const linkSearch = () => {
        categories.forEach(c => {
            c.url = subPageUrls[c.id] || '../index.html';
        });
    };
    linkSearch();
    renderCategories();

    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    if (input && btn) {
        input.addEventListener('input', () => {
            const q = input.value.trim().toLowerCase();
            const listEl = document.getElementById('categoryList');
            if (!q) {
                renderCategories();
                return;
            }
            const matches = categories.filter(c => c.name.toLowerCase().includes(q));
            if (matches.length === 0) {
                listEl.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Không tìm thấy danh mục nào.</p>';
                return;
            }
            window.location.href = matches[0].url;
        });
        btn.addEventListener('click', () => {
            const q = input.value.trim().toLowerCase();
            const match = categories.find(c => c.name.toLowerCase().includes(q));
            if (match) window.location.href = match.url;
        });
    }

    initCart();
});
