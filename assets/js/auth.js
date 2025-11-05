const API_BASE = 'https://backend-room-2.onrender.com/api';

// Session timeout (2 hours)
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

// Check if user is authenticated with session validation
function checkAuth() {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('loginTime');
    
    if (!token) {
        redirectToLogin();
        return null;
    }

    // Check session timeout
    if (loginTime) {
        const currentTime = new Date().getTime();
        const loginTimestamp = parseInt(loginTime);
        
        if (currentTime - loginTimestamp > SESSION_TIMEOUT) {
            logout();
            showNotification('Session expired. Please login again.', 'error');
            return null;
        }
    }

    return token;
}

// Redirect to login
function redirectToLogin() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    window.location.href = '../owner/login.html';
}

// Enhanced logout function
function logout() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    
    // Redirect to login
    window.location.href = '../owner/login.html';
}

// Get auth headers with session check
function getAuthHeaders() {
    const token = checkAuth();
    if (!token) {
        return {};
    }
    
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Store login time
function setLoginTime() {
    localStorage.setItem('loginTime', new Date().getTime().toString());
}

// Auto logout after inactivity (optional)
function setupAutoLogout() {
    let timeout;
    
    function resetTimer() {
        clearTimeout(timeout);
        timeout = setTimeout(logout, SESSION_TIMEOUT);
    }
    
    // Reset timer on user activity
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer;
    window.ontouchstart = resetTimer;
    window.onclick = resetTimer;
    window.onkeypress = resetTimer;
}

// Check session on page load
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (token && window.location.pathname.includes('login.html')) {
        // If already logged in and trying to access login page, redirect to dashboard
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'admin') {
            window.location.href = '../admin/admin-panel.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
});

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.custom-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `custom-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}