import { searchCategories } from './categories.js';

export function initSearch() {
    const input = document.getElementById('searchInput');
    const btn = document.getElementById('searchBtn');
    if (!input || !btn) return;

    input.addEventListener('input', () => searchCategories(input.value));
    btn.addEventListener('click', () => searchCategories(input.value));
}