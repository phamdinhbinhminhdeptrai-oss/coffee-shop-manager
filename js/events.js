import { login, register } from './auth.js';

const closeModal = el => el.classList.remove('active');
const openModal = el => el.classList.add('active');

export function setupEvents() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    document.getElementById('closeLogin').addEventListener('click', () => closeModal(loginModal));
    document.getElementById('closeRegister').addEventListener('click', () => closeModal(registerModal));

    document.getElementById('switchToRegister').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        openModal(registerModal);
    });

    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(registerModal);
        openModal(loginModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === registerModal) closeModal(registerModal);
    });

    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ok = register(document.getElementById('regUsername').value, document.getElementById('regPassword').value);
        if (ok) {
            registerForm.reset();
            closeModal(registerModal);
            openModal(loginModal);
        }
    });

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ok = login(document.getElementById('logUsername').value, document.getElementById('logPassword').value);
        if (ok) {
            loginForm.reset();
            closeModal(loginModal);
        }
    });
}