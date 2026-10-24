

export const categories = [
    {
        id: 1,
        name: "Ưu Đãi",
        image: "https://static.kfcvietnam.com.vn/images/category/lg/KHUYEN%20MAI.jpg",
        src: "./pages/uu-dai.html"
    },
    {
        id: 2,
        name: "Đồng Giá Siêu Hời",
        image: "https://static.kfcvietnam.com.vn/images/category/lg/Value-Deals.jpg?v=4Y6MGg"
    },
    {
        id: 3,
        name: "Món Mới",
        image: "https://static.kfcvietnam.com.vn/images/category/lg/MON%20MOI.jpg?v=4Y6MGg"
    },
    {
        id: 4,
        name: "Combo 1 Người",
        image: "https://static.kfcvietnam.com.vn/images/category/lg/COMBO%201%20NGUOI.jpg?v=4Y6MGg"
    },
    {
        id: 5,
        name: "Combo Nhóm",
        image: "https://static.kfcvietnam.com.vn/images/category/lg/COMBO%20NHOM.jpg?v=4Y6MGg"
    },
    {
        id: 6,
        name: "Gà Rán - Gà Quay",
        image: "https://static.kfcvietnam.com.vn/images/category/lg/GA.jpg?v=4Y6MGg"
    },
    {
        id: 7,
        name: "Burger - Cơm - Mì Ý",
        image: "https://static.kfcvietnam.com.vn/images/category/lg/COM.jpg?v=4Y6MGg"
    },
    {
        id: 8,
        name: "Thức Ăn Nhẹ",
        image: "https://static.kfcvietnam.com.vn/images/category/lg/MON%20AN%20NHE.jpg?v=4Y6MGg"
    },
    {
        id: 9,
        name: "Thức Uống & Tráng Miệng",
        image: "https://static.kfcvietnam.com.vn/images/category/lg/TRANG%20MIENG.jpg?v=4Y6MGg"
    }
];

export function renderCategories(list = categories) {
    const el = document.getElementById('categoryList');
    if (!el) return;

    el.innerHTML = list.length === 0
        ? '<p style="grid-column: 1/-1; text-align: center;">Không tìm thấy danh mục nào.</p>'
        : list.map(category => `
            <a href="${category.url || '#'}" class="card-wrapper">
                <div class="card card--menu">
                    <img src="${category.image}" class="card-img-top" alt="${category.name}"
                         onerror="this.onerror=null;this.src='./img/image.png';">
                    <div class="card-body">
                        <h4 class="card-text">${category.name} &gt;</h4>
                    </div>
                </div>
            </a>
        `).join('');
}

export function searchCategories(keyword) {
    const q = keyword.toLowerCase();
    renderCategories(categories.filter(c => c.name.toLowerCase().includes(q)));
}