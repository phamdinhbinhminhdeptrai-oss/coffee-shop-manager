import { initAuth } from './auth.js';
import { renderCategories } from './categories.js';
import { initSuggestions } from './suggestions.js';
import { initSearch } from './products.js';
import { initComments } from './comments.js';
import { setupEvents } from './events.js';
import { initCart } from './cart.js';
import { categories } from './categories.js';

const categoryPages = {
    1: './pages/uu-dai.html',
    2: './pages/dong-gia-sh.html',
    3: './pages/mon-moi.html',
    4: './pages/cb-1-nguoi.html',
    5: './pages/cb-nhom.html',
    6: './pages/ga-ran-quay.html',
    7: './pages/burger-com-my.html',
    8: './pages/an-vat.html',
    9: './pages/thuc-uong.html'
};

document.addEventListener('DOMContentLoaded', () => {
    categories.forEach(c => {
        c.url = categoryPages[c.id] || '#';
    });
    initAuth();
    renderCategories();
    initSuggestions();
    initSearch();
    initComments();
    initCart();
    setupEvents();
});
