// Check if user is logged in
const currentUser = localStorage.getItem('currentUser');

if (!currentUser) {
    alert('⚠️ Please login first!');
    window.location.href = 'login.html';
} else {
    const user = JSON.parse(currentUser);
    document.getElementById('userName').textContent = user.fullName;
    loadProfile();
}

// Load profile information
function loadProfile() {
    const user = JSON.parse(currentUser);
    
    // Display personal info
    document.getElementById('fullName').textContent = user.fullName;
    document.getElementById('farmerNumber').textContent = user.farmerNumber;
    document.getElementById('idNumber').textContent = user.idNumber;
    document.getElementById('phoneNumber').textContent = user.phoneNumber;
    
    // Load order history
    loadOrderHistory();
}

// Load order history
function loadOrderHistory() {
    const user = JSON.parse(currentUser);
    const userOrders = JSON.parse(localStorage.getItem('userOrders_' + user.farmerNumber)) || [];
    
    // Calculate statistics
    const totalOrders = userOrders.length;
    const pendingOrders = userOrders.filter(o => o.status === 'Pending').length;
    const verifiedOrders = userOrders.filter(o => o.status === 'Verified').length;
    const collectedOrders = userOrders.filter(o => o.status === 'Collected').length;
    
    // Update stats
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('verifiedOrders').textContent = verifiedOrders;
    document.getElementById('collectedOrders').textContent = collectedOrders;
    
    // Display orders
    const ordersContainer = document.getElementById('ordersContainer');
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="no-orders">
                <div class="no-orders-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Start shopping to see your order history!</p>
                <button onclick="goHome()" class="btn-logout" style="background: #4a7c2c; margin-top: 20px;">
                    Go Shopping
                </button>
            </div>
        `;
        return;
    }
    
    // Sort orders by date (newest first)
    userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    ordersContainer.innerHTML = '';
    
    userOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Determine status class
        let statusClass = 'status-pending';
        if (order.status === 'Verified') statusClass = 'status-verified';
        if (order.status === 'Collected') statusClass = 'status-collected';
        
        // Build items list
        let itemsHTML = '';
        order.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            itemsHTML += `
                <div class="order-item">
                    <div class="item-info">
                        <div class="item-name-qty">${item.name} × ${item.quantity}</div>
                        <div class="item-category">${item.category}</div>
                    </div>
                    <div class="item-price">KSh ${itemTotal.toLocaleString()}</div>
                </div>
            `;
        });
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-number">Order #${order.orderNumber}</div>
                <div class="order-status ${statusClass}">${order.status}</div>
            </div>
            <div class="order-date">📅 ${order.orderDate}</div>
            <div class="order-items">
                ${itemsHTML}
            </div>
            <div class="order-total">
                <span>Total Amount:</span>
                <span>KSh ${order.totalAmount.toLocaleString()}</span>
            </div>
        `;
        
        ordersContainer.appendChild(orderCard);
    });
}

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