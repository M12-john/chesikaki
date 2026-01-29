// Check if admin is logged in
const adminSession = localStorage.getItem('adminSession');

if (!adminSession) {
    alert('⚠️ Please login as admin first!');
    window.location.href = 'admin-login.html';
} else {
    const admin = JSON.parse(adminSession);
    document.getElementById('adminName').textContent = admin.username;
    loadStatistics();
    loadOrders();
}

// Load statistics
function loadStatistics() {
    const allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Calculate stats
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === 'Pending').length;
    const verifiedOrders = allOrders.filter(o => o.status === 'Verified').length;
    const collectedOrders = allOrders.filter(o => o.status === 'Collected').length;
    
    // Calculate total revenue
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Count unique farmers
    const uniqueFarmers = new Set(allOrders.map(o => o.farmerNumber)).size;
    
    // Update display
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('verifiedOrders').textContent = verifiedOrders;
    document.getElementById('collectedOrders').textContent = collectedOrders;
    document.getElementById('totalRevenue').textContent = 'KSh ' + totalRevenue.toLocaleString();
    document.getElementById('totalFarmers').textContent = uniqueFarmers;
}

// Load orders
function loadOrders() {
    let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Get filter values
    const statusFilter = document.getElementById('statusFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    // Apply filters
    let filteredOrders = allOrders;
    
    if (statusFilter !== 'All') {
        filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
    }
    
    if (searchInput) {
        filteredOrders = filteredOrders.filter(o => 
            o.orderNumber.toLowerCase().includes(searchInput) ||
            o.farmerName.toLowerCase().includes(searchInput) ||
            o.farmerNumber.toLowerCase().includes(searchInput)
        );
    }
    
    // Sort by date (newest first)
    filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    // Display orders
    const ordersTable = document.getElementById('ordersTable');
    
    if (filteredOrders.length === 0) {
        ordersTable.innerHTML = `
            <div class="no-orders">
                <h3>No orders found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    ordersTable.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        // Determine status class
        let statusClass = 'status-Pending';
        if (order.status === 'Verified') statusClass = 'status-Verified';
        if (order.status === 'Collected') statusClass = 'status-Collected';
        
        // Build items list
        let itemsHTML = '';
        order.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            itemsHTML += `
                <div class="order-item">
                    <div class="item-details">
                        <div class="item-name-qty">${item.name} × ${item.quantity}</div>
                        <div class="item-category">${item.category}</div>
                    </div>
                    <div class="item-price">KSh ${itemTotal.toLocaleString()}</div>
                </div>
            `;
        });
        
        // Action buttons based on status
        let actionsHTML = '';
        if (order.status === 'Pending') {
            actionsHTML = `
                <button class="btn-action btn-verify" onclick="changeStatus('${order.orderNumber}', 'Verified')">
                    ✅ Verify Order
                </button>
                <button class="btn-action btn-collect" onclick="changeStatus('${order.orderNumber}', 'Collected')">
                    🎉 Mark as Collected
                </button>
                <button class="btn-action btn-delete" onclick="deleteOrder('${order.orderNumber}')">
                    🗑️ Delete Order
                </button>
            `;
        } else if (order.status === 'Verified') {
            actionsHTML = `
                <button class="btn-action btn-pending" onclick="changeStatus('${order.orderNumber}', 'Pending')">
                    ⏳ Back to Pending
                </button>
                <button class="btn-action btn-collect" onclick="changeStatus('${order.orderNumber}', 'Collected')">
                    🎉 Mark as Collected
                </button>
                <button class="btn-action btn-delete" onclick="deleteOrder('${order.orderNumber}')">
                    🗑️ Delete Order
                </button>
            `;
        } else if (order.status === 'Collected') {
            actionsHTML = `
                <button class="btn-action btn-verify" onclick="changeStatus('${order.orderNumber}', 'Verified')">
                    ✅ Back to Verified
                </button>
                <button class="btn-action btn-delete" onclick="deleteOrder('${order.orderNumber}')">
                    🗑️ Delete Order
                </button>
            `;
        }
        
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-number">Order #${order.orderNumber}</div>
                <div class="order-status-badge ${statusClass}">${order.status}</div>
            </div>
            
            <div class="farmer-info">
                <div class="farmer-info-row">
                    <span class="farmer-label">Farmer Name:</span>
                    <span class="farmer-value">${order.farmerName}</span>
                </div>
                <div class="farmer-info-row">
                    <span class="farmer-label">Farmer Number:</span>
                    <span class="farmer-value">${order.farmerNumber}</span>
                </div>
                <div class="farmer-info-row">
                    <span class="farmer-label">Phone Number:</span>
                    <span class="farmer-value">${order.phoneNumber}</span>
                </div>
                <div class="farmer-info-row">
                    <span class="farmer-label">Order Date:</span>
                    <span class="farmer-value">📅 ${order.orderDate}</span>
                </div>
            </div>
            
            <div class="order-items">
                ${itemsHTML}
            </div>
            
            <div class="order-total">
                <span>Total Amount:</span>
                <span>KSh ${order.totalAmount.toLocaleString()}</span>
            </div>
            
            <div class="order-actions">
                ${actionsHTML}
            </div>
        `;
        
        ordersTable.appendChild(orderCard);
    });
}

// Change order status
function changeStatus(orderNumber, newStatus) {
    const confirmChange = confirm(`Change order status to "${newStatus}"?`);
    
    if (!confirmChange) return;
    
    // Get all orders
    let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Find and update the order
    const orderIndex = allOrders.findIndex(o => o.orderNumber === orderNumber);
    
    if (orderIndex !== -1) {
        allOrders[orderIndex].status = newStatus;
        
        // Save back to storage
        localStorage.setItem('orders', JSON.stringify(allOrders));
        
        // Also update in farmer's personal orders
        const farmerNumber = allOrders[orderIndex].farmerNumber;
        let farmerOrders = JSON.parse(localStorage.getItem('userOrders_' + farmerNumber)) || [];
        
        const farmerOrderIndex = farmerOrders.findIndex(o => o.orderNumber === orderNumber);
        if (farmerOrderIndex !== -1) {
            farmerOrders[farmerOrderIndex].status = newStatus;
            localStorage.setItem('userOrders_' + farmerNumber, JSON.stringify(farmerOrders));
        }
        
        alert('✅ Order status updated to: ' + newStatus);
        
        // Reload data
        loadStatistics();
        loadOrders();
    }
}

// Delete single order
function deleteOrder(orderNumber) {
    const confirmDelete = confirm('⚠️ WARNING!\n\nAre you sure you want to DELETE this order?\n\nOrder: ' + orderNumber + '\n\nThis action CANNOT be undone!');
    
    if (!confirmDelete) return;
    
    // Double confirmation
    const doubleConfirm = confirm('⚠️ FINAL CONFIRMATION!\n\nThis will permanently delete the order.\n\nAre you absolutely sure?');
    
    if (!doubleConfirm) return;
    
    // Get all orders
    let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Find order to delete
    const orderToDelete = allOrders.find(o => o.orderNumber === orderNumber);
    
    if (!orderToDelete) {
        alert('❌ Order not found!');
        return;
    }
    
    // Remove from all orders
    allOrders = allOrders.filter(o => o.orderNumber !== orderNumber);
    localStorage.setItem('orders', JSON.stringify(allOrders));
    
    // Remove from farmer's personal orders
    const farmerNumber = orderToDelete.farmerNumber;
    let farmerOrders = JSON.parse(localStorage.getItem('userOrders_' + farmerNumber)) || [];
    farmerOrders = farmerOrders.filter(o => o.orderNumber !== orderNumber);
    localStorage.setItem('userOrders_' + farmerNumber, JSON.stringify(farmerOrders));
    
    alert('✅ Order deleted successfully!');
    
    // Reload data
    loadStatistics();
    loadOrders();
}

// Show farmers management
function showFarmersManagement() {
    window.location.href = 'admin-farmers.html';
}

// Delete all orders
function confirmDeleteAllOrders() {
    const confirmDelete = confirm('⚠️ EXTREME WARNING!\n\nThis will DELETE ALL ORDERS from the system!\n\nAre you sure?');
    
    if (!confirmDelete) return;
    
    const doubleConfirm = confirm('⚠️ FINAL WARNING!\n\nType "DELETE ALL" in your mind and click OK to proceed.\n\nThis CANNOT be undone!');
    
    if (!doubleConfirm) return;
    
    // Delete all orders
    localStorage.setItem('orders', JSON.stringify([]));
    
    // Delete all farmer orders
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
        if (key.startsWith('userOrders_')) {
            localStorage.removeItem(key);
        }
    });
    
    alert('✅ All orders have been deleted!');
    
    // Reload
    loadStatistics();
    loadOrders();
}

// Reset entire system
function confirmResetSystem() {
    const confirmReset = confirm('🚨 NUCLEAR OPTION! 🚨\n\nThis will RESET THE ENTIRE SYSTEM:\n- All orders\n- All farmers\n- All data\n\nAdmin account will remain.\n\nAre you ABSOLUTELY sure?');
    
    if (!confirmReset) return;
    
    const finalConfirm = confirm('⚠️ LAST CHANCE!\n\nClick OK to WIPE EVERYTHING.\n\nThis is IRREVERSIBLE!');
    
    if (!finalConfirm) return;
    
    // Clear everything except admin session and product inventory
    const adminData = localStorage.getItem('adminSession');
    const inventoryData = localStorage.getItem('productsInventory');
    
    localStorage.clear();
    
    // Restore admin and inventory
    if (adminData) localStorage.setItem('adminSession', adminData);
    if (inventoryData) localStorage.setItem('productsInventory', inventoryData);
    
    alert('✅ System has been reset!\n\nAll farmer data and orders have been deleted.');
    
    // Reload
    location.reload();
}

// Admin logout
function adminLogout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        localStorage.removeItem('adminSession');
        alert('✅ Admin logged out successfully!');
        window.location.href = 'admin-login.html';
    }
}