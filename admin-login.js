// Admin credentials (in real app, this would be in secure database)
const ADMIN_USERNAME = "chesikaki_admin";
const ADMIN_PASSWORD = "admin2025";

// Get the admin login form
const adminLoginForm = document.getElementById('adminLoginForm');

adminLoginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Check credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Create admin session
        const adminSession = {
            username: username,
            loginTime: new Date().toLocaleString(),
            role: 'admin'
        };
        
        localStorage.setItem('adminSession', JSON.stringify(adminSession));
        
        alert('✅ Welcome Admin!\n\nRedirecting to admin dashboard...');
        window.location.href = 'admin-dashboard.html';
    } else {
        alert('❌ Invalid admin credentials!\n\nPlease check your username and password.');
    }
});