// Check if user is logged in
const currentUser = localStorage.getItem('currentUser');

if (!currentUser) {
    alert('⚠️ Please login first!');
    window.location.href = 'login.html';
} else {
    const user = JSON.parse(currentUser);
    document.getElementById('userName').textContent = user.fullName;
}

// Handle contact form submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const user = JSON.parse(currentUser);
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Create message object
    const contactMessage = {
        farmerName: user.fullName,
        farmerNumber: user.farmerNumber,
        phoneNumber: user.phoneNumber,
        subject: subject,
        message: message,
        date: new Date().toLocaleString(),
        status: 'Pending'
    };
    
    // Save message to localStorage (simulating database)
    let messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
    messages.push(contactMessage);
    localStorage.setItem('contactMessages', JSON.stringify(messages));
    
    // Show success message
    alert('✅ Message sent successfully!\n\nWe will get back to you within 24 hours.\n\nYou can also call us at:\n📱 +254 712 345 678');
    
    // Clear form
    contactForm.reset();
});

// Navigation
function goHome() {
    window.location.href = 'dashboard.html';
}

function logout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        localStorage.removeItem('currentUser');
        alert('✅ Logged out successfully!');
        window.location.href = 'login.html';
    }
}