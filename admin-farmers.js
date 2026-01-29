// Check if admin is logged in
const adminSession = localStorage.getItem('adminSession');

if (!adminSession) {
    alert('⚠️ Please login as admin first!');
    window.location.href = 'admin-login.html';
} else {
    const admin = JSON.parse(adminSession);
    document.getElementById('adminName').textContent = admin.username;
    loadFarmers();
}

// Load all farmers
function loadFarmers() {
    const allKeys = Object.keys(localStorage);
    const farmers = [];
    
    // Find all farmer accounts
    allKeys.forEach(key => {
        if (key.startsWith('farmer_')) {
            const farmerData = JSON.parse(localStorage.getItem(key));
            farmers.push(farmerData);
        }
    });
    
    // Update stats
    document.getElementById('totalFarmers').textContent = farmers.length;
    
    // Display farmers
    const tbody = document.getElementById('farmersTableBody');
    tbody.innerHTML = '';
    
    if (farmers.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #666;">
                    No farmers registered yet
                </td>
            </tr>
        `;
        return;
    }
    
    farmers.forEach(farmer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${farmer.fullName}</strong></td>
            <td>${farmer.farmerNumber}</td>
            <td>${farmer.idNumber}</td>
            <td>${farmer.phoneNumber}</td>
            <td>
                <button class="btn-view" onclick="viewFarmerOrders('${farmer.farmerNumber}')">📋 View Orders</button>
                <button class="btn-delete" onclick="deleteFarmer('${farmer.farmerNumber}', '${farmer.fullName}')">🗑️ Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// View farmer orders
function viewFarmerOrders(farmerNumber) {
    const farmerOrders = JSON.parse(localStorage.getItem('userOrders_' + farmerNumber)) || [];
    
    if (farmerOrders.length === 0) {
        alert('This farmer has no orders yet.');
        return;
    }
    
    let ordersList = `Farmer Orders (${farmerOrders.length} total):\n\n`;
    
    farmerOrders.forEach((order, index) => {
        ordersList += `${index + 1}. Order ${order.orderNumber}\n`;
        ordersList += `   Date: ${order.orderDate}\n`;
        ordersList += `   Status: ${order.status}\n`;
        ordersList += `   Total: KSh ${order.totalAmount.toLocaleString()}\n\n`;
    });
    
    alert(ordersList);
}

// Delete farmer
function deleteFarmer(farmerNumber, farmerName) {
    const confirmDelete = confirm(`⚠️ WARNING!\n\nDelete farmer: ${farmerName}?\nFarmer Number: ${farmerNumber}\n\nThis will also delete:\n- Farmer account\n- All their orders\n\nThis CANNOT be undone!`);
    
    if (!confirmDelete) return;
    
    const doubleConfirm = confirm('⚠️ FINAL CONFIRMATION!\n\nAre you absolutely sure?');
    
    if (!doubleConfirm) return;
    
    // Delete farmer account
    localStorage.removeItem('farmer_' + farmerNumber);
    
    // Delete farmer's orders
    localStorage.removeItem('userOrders_' + farmerNumber);
    
    // Remove farmer's orders from global orders
    let allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    allOrders = allOrders.filter(o => o.farmerNumber !== farmerNumber);
    localStorage.setItem('orders', JSON.stringify(allOrders));
    
    alert(`✅ Farmer "${farmerName}" has been deleted!`);
    
    // Reload
    loadFarmers();
}

// Navigation
function goToDashboard() {
    window.location.href = 'admin-dashboard.html';
}

function adminLogout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        localStorage.removeItem('adminSession');
        alert('✅ Admin logged out successfully!');
        window.location.href = 'admin-login.html';
    }
}