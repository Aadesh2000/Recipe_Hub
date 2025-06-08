// Authentication state
let currentUser = null;

// API endpoints
const API_BASE_URL = 'http://localhost:8080/api';
const AUTH_ENDPOINTS = {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    verify: `${API_BASE_URL}/auth/verify`
};

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupAuthListeners();
});

// Setup event listeners for auth buttons
function setupAuthListeners() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if (loginBtn) {
        loginBtn.addEventListener('click', showLoginModal);
    }
    if (registerBtn) {
        registerBtn.addEventListener('click', showRegisterModal);
    }
}

// Check if user is authenticated
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        updateUIForGuest();
        return;
    }

    try {
        const response = await fetch(AUTH_ENDPOINTS.verify, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            updateUIForUser();
        } else {
            localStorage.removeItem('token');
            updateUIForGuest();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        updateUIForGuest();
    }
}

// Update UI based on authentication status
function updateUIForUser() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if (loginBtn) loginBtn.textContent = 'Dashboard';
    if (registerBtn) registerBtn.textContent = 'Logout';
}

function updateUIForGuest() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    if (loginBtn) loginBtn.textContent = 'Login';
    if (registerBtn) registerBtn.textContent = 'Register';
}

// Show login modal
function showLoginModal() {
    // TODO: Implement login modal
    console.log('Show login modal');
}

// Show register modal
function showRegisterModal() {
    // TODO: Implement register modal
    console.log('Show register modal');
}

// Handle login
async function handleLogin(email, password) {
    try {
        const response = await fetch(AUTH_ENDPOINTS.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUIForUser();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
}

// Handle registration
async function handleRegister(email, password, name) {
    try {
        const response = await fetch(AUTH_ENDPOINTS.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, name })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            updateUIForUser();
            return true;
        }
        return false;
    } catch (error) {
        console.error('Registration failed:', error);
        return false;
    }
}

// Handle logout
async function handleLogout() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            await fetch(AUTH_ENDPOINTS.logout, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        localStorage.removeItem('token');
        currentUser = null;
        updateUIForGuest();
    }
} 