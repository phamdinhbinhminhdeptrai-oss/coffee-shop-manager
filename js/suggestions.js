import { addToCart } from './cart.js';

export const suggestions = [
    {
        id: 1,
        shortName: "Combo 1 Miếng Gà",
        fullName: "Combo Gà Rán 1 Người",
        price: 89000,
        items: ["1 miếng Gà Rán", "1 Khoai Tây Chiên vừa", "1 Pepsi vừa"],
        image: "https://static.kfcvietnam.com.vn/images/items/lg/D-CHICKEN-1.jpg?v=4Y6aKg"
    },
    {
        id: 2,
        shortName: "Combo 1 Mình Chill",
        fullName: "Combo Nhóm 3 Người",
        price: 219000,
        items: ["6 miếng Gà Rán", "2 Khoai Tây Chiên lớn", "3 Pepsi vừa"],
        image: "https://static.kfcvietnam.com.vn/images/items/lg/EC.CBO-1COB-Pasta.jpg?v=4Y6aKg"
    },
    {
        id: 3,
        shortName: "Combo 2 Miếng Gà",
        fullName: "Combo Cặp Đôi Hạnh Phúc",
        price: 159000,
        items: ["4 miếng Gà Rán", "1 Khoai Tây Chiên lớn", "2 Pepsi vừa"],
        image: "https://static.kfcvietnam.com.vn/images/items/lg/D-CHICKEN-2.jpg?v=4Y6aKg"
    },
    {
        id: 4,
        shortName: "Combo Mỳ Ý Solo",
        fullName: "Combo Burger Gà Zinger",
        price: 79000,
        items: ["1 Burger Zinger", "1 Khoai Tây Chiên vừa", "1 Pepsi vừa"],
        image: "https://static.kfcvietnam.com.vn/images/items/lg/EC.CBO-1-Pasta-COB.jpg?v=4Y6aKg"
    },
    {
        id: 5,
        shortName: "Combo Gà Quay",
        fullName: "Combo Gà Quay Mật Ong",
        price: 129000,
        items: ["2 miếng Gà Quay", "1 Cơm Gà", "1 Pepsi vừa"],
        image: "https://static.kfcvietnam.com.vn/images/items/lg/EC.CBO-Pasta-Tender.jpg?v=4Y6aKg"
    },
    {
        id: 6,
        shortName: "Combo Ăn Nhẹ",
        fullName: "Combo Ăn Nhẹ Xế Chiều",
        price: 59000,
        items: ["2 Miếng Gà Popcorn", "1 Khoai Tây Chiên nhỏ", "1 Pepsi nhỏ"],
        image: "https://static.kfcvietnam.com.vn/images/items/lg/EC.CBO-RICE-COB.jpg?v=4Y6aKg"
    },
    {
        id: 7,
        shortName: "Combo Tráng Miệng",
        fullName: "Combo Tráng Miệng Ngọt Ngào",
        price: 49000,
        items: ["1 Kem Ly", "1 Bánh Tart Trứng", "1 Trà Đào"],
        image: "https://static.kfcvietnam.com.vn/images/category/lg/TRANG%20MIENG.jpg?v=4Y6MGg"
    },
    {
        id: 8,
        shortName: "Combo Món Mới",
        fullName: "Combo Thử Món Mới",
        price: 99000,
        items: ["1 Gà Sốt Mới", "1 Khoai Tây Lắc", "1 Pepsi vừa"],
        image: "https://static.kfcvietnam.com.vn/images/items/lg/EC.CBO-Rice-Soup.jpg?v=4Y6aKg"
    }
];

const VISIBLE_COUNT = 4;
let startIndex = 0;

function buildCardHTML(item) {
    const items = item.items.map(i => `<li>${i}</li>`).join('');
    return `
        <div class="suggest-card card-wrapper">
            <div class="card card--menu">
                <img src="${item.image}" class="card-img-top" alt="${item.shortName}"
                    onerror="this.onerror=null;this.src='./img/image.png';">
                <div class="card-body">
                    <h4 class="card-text">${item.shortName}</h4>
                    <p class="suggest-fullname">${item.fullName}</p>
                    <ul class="suggest-items">${items}</ul>
                    <p class="price">${item.price.toLocaleString('vi-VN')} đ</p>
                    <button class="add-cart-btn" data-id="${item.id}">Thêm vào giỏ</button>
                </div>
            </div>
        </div>
    `;
}

export function renderSuggestions() {
    const el = document.getElementById('suggestTrack');
    if (!el) return;
    if (suggestions.length === 0) {
        el.innerHTML = '<p>Không có món gợi ý nào.</p>';
        return;
    }
    el.innerHTML = Array.from({ length: VISIBLE_COUNT }, (_, i) =>
        buildCardHTML(suggestions[(startIndex + i) % suggestions.length])).join('');
}

function slide(step) {
    startIndex = (startIndex + step + suggestions.length) % suggestions.length;
    renderSuggestions();
}

export function initSuggestions() {
    renderSuggestions();
    document.getElementById('suggestPrev')?.addEventListener('click', () => slide(-1));
    document.getElementById('suggestNext')?.addEventListener('click', () => slide(1));
    document.getElementById('suggestTrack')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-cart-btn');
        if (!btn) return;
        const item = suggestions.find(s => s.id === Number(btn.dataset.id));
        addToCart(item.fullName, item.price);
    });
}