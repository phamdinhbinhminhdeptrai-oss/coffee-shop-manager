const USERS_KEY = 'codecoffee_users';
const CURRENT_USER_KEY = 'codecoffee_current_user';

export function initAuth() {
    updateAuthUI();
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}
export function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
}

export function register(username, password) {
    const users = getUsers();
    if (users.some(u => u.username === username)) {
        alert("Tên đăng nhập đã tồn tại!");
        return false;
    }

    users.push({ username, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    alert("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
    return true;
}

export function login(username, password) {
    const user = getUsers().find(u => u.username === username && u.password === password);
    if (!user) {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
        return false;
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    updateAuthUI();
    alert("Đăng nhập thành công!");
    return true;
}

export function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    updateAuthUI();
}

export function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    const currentUser = getCurrentUser();

    if (currentUser) {
        authSection.innerHTML = `
            <div class="user-info">
                <span>Xin chào, ${currentUser.username}!</span>
                <button id="logoutBtn" class="btn btn-outline">Đăng xuất</button>
            </div>
        `;
        document.getElementById('logoutBtn').addEventListener('click', logout);
    } else {
        authSection.innerHTML = `
            <button id="loginBtn" class="btn btn-outline">Đăng nhập</button>
            <button id="registerBtn" class="btn btn-primary">Đăng ký</button>
        `;
        document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
        document.getElementById('registerBtn').addEventListener('click', () => openModal('registerModal'));
    }
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}