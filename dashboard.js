// Check if user is logged in
const currentUser = localStorage.getItem('currentUser');

if (!currentUser) {
    // Not logged in, redirect to login
    alert('⚠️ Please login first!');
    window.location.href = 'login.html';
} else {
    // User is logged in, show their info
    const user = JSON.parse(currentUser);
    
    // Update welcome message
    document.getElementById('welcomeMessage').textContent = 'Welcome back, ' + user.fullName + '! 🌾';
    
    // Update navbar username
    document.getElementById('userName').textContent = user.fullName;
    
    // Update cart count
    updateCartCount();
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cartCount').textContent = cart.length;
}

// Navigate to different pages
function goToPage(page) {
    window.location.href = page;
}

// Logout function
function logout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        localStorage.removeItem('currentUser');
        alert('✅ Logged out successfully!');
        window.location.href = 'login.html';
    }
}