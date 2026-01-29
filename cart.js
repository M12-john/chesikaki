// Check if user is logged in
const currentUser = localStorage.getItem('currentUser');

if (!currentUser) {
    alert('⚠️ Please login first!');
    window.location.href = 'login.html';
} else {
    const user = JSON.parse(currentUser);
    document.getElementById('userName').textContent = user.fullName;
    loadCart();
}

// Load cart items
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <button onclick="goHome()" class="btn-submit" style="max-width: 300px; margin: 20px auto;">
                    Go to Dashboard
                </button>
            </div>
        `;
        updateSummary(cart);
        return;
    }
    
    cartItemsDiv.innerHTML = '';
    
    cart.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        // Replace the old itemDiv.innerHTML with this:
     itemDiv.innerHTML = `
     <div class="item-icon">
        <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
     </div>
     <div class="item-details">
        <div class="item-name">${item.name}</div>
        <div class="item-category">${item.category}</div>
        <div class="item-price">KSh ${item.price.toLocaleString()}</div>
      </div>
     <div class="item-quantity">
        <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
        <span class="qty-display">${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
    </div>
    <button class="item-remove" onclick="removeItem(${index})">Remove</button>
`;
        cartItemsDiv.appendChild(itemDiv);
    });
    
    updateSummary(cart);
    loadRecommendations();
}

// Update quantity
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Remove item
function removeItem(index) {
    const confirmRemove = confirm('Remove this item from cart?');
    if (confirmRemove) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Update summary
function updateSummary(cart) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('subtotal').textContent = 'KSh ' + subtotal.toLocaleString();
    document.getElementById('totalAmount').textContent = 'KSh ' + subtotal.toLocaleString();
}

// Clear cart
function clearCart() {
    const confirmClear = confirm('Are you sure you want to clear your entire cart?');
    if (confirmClear) {
        localStorage.setItem('cart', JSON.stringify([]));
        loadCart();
        alert('✅ Cart cleared!');
    }
}

// Submit order
function submitOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('❌ Your cart is empty! Add some items first.');
        return;
    }
    
    const user = JSON.parse(currentUser);
    
    // Generate order ID
    const orderNumber = 'CHF-' + Date.now();
    const orderDate = new Date().toLocaleString();
    
    // Calculate total
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order object
    const order = {
        orderNumber: orderNumber,
        farmerName: user.fullName,
        farmerNumber: user.farmerNumber,
        phoneNumber: user.phoneNumber,
        orderDate: orderDate,
        items: cart,
        totalAmount: totalAmount,
        status: 'Pending'
    };
    
    // Save order to orders history
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Save current user's orders
    let userOrders = JSON.parse(localStorage.getItem('userOrders_' + user.farmerNumber)) || [];
    userOrders.push(order);
    localStorage.setItem('userOrders_' + user.farmerNumber, JSON.stringify(userOrders));
    
    // Update stock levels
    updateStockLevels(cart);
    
    // Clear cart
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Show printable receipt
    showPrintableReceipt(order);
}

// Update stock levels after order
function updateStockLevels(cartItems) {
    let inventory = JSON.parse(localStorage.getItem('productsInventory'));
    
    if (!inventory) return;
    
    cartItems.forEach(cartItem => {
        const product = inventory.find(p => p.id === cartItem.id);
        if (product) {
            product.stock = Math.max(0, product.stock - cartItem.quantity);
        }
    });
    
    localStorage.setItem('productsInventory', JSON.stringify(inventory));
}

// Show printable receipt
function showPrintableReceipt(order) {
    const receiptHTML = generateReceiptHTML(order);
    document.getElementById('receiptPrint').innerHTML = receiptHTML;
    document.getElementById('receiptModal').classList.add('active');
}

// Generate receipt HTML
function generateReceiptHTML(order) {
    let itemsHTML = '';
    order.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        itemsHTML += `
            <div class="receipt-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.category}</small><br>
                    <small>KSh ${item.price.toLocaleString()} × ${item.quantity}</small>
                </div>
                <div><strong>KSh ${itemTotal.toLocaleString()}</strong></div>
            </div>
        `;
    });
    
    return `
        <div class="receipt-header">
            <div class="receipt-title">🌾 CHESIKAKI FARMERS PORTAL</div>
            <div class="receipt-subtitle">Order Receipt</div>
        </div>

        <div class="receipt-section">
            <div class="receipt-row">
                <span class="receipt-label">Order Number:</span>
                <span>${order.orderNumber}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Date & Time:</span>
                <span>${order.orderDate}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Status:</span>
                <span style="color: #ff9800; font-weight: bold;">${order.status}</span>
            </div>
        </div>

        <div class="receipt-section">
            <div class="receipt-row">
                <span class="receipt-label">Farmer Name:</span>
                <span>${order.farmerName}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Farmer Number:</span>
                <span>${order.farmerNumber}</span>
            </div>
            <div class="receipt-row">
                <span class="receipt-label">Phone Number:</span>
                <span>${order.phoneNumber}</span>
            </div>
        </div>

        <div class="receipt-section">
            <strong style="font-size: 16px;">ITEMS ORDERED:</strong>
            <div class="receipt-items">
                ${itemsHTML}
            </div>
        </div>

        <div class="receipt-row receipt-total">
            <span>TOTAL AMOUNT:</span>
            <span>KSh ${order.totalAmount.toLocaleString()}</span>
        </div>

        <div class="receipt-section">
            <strong style="font-size: 14px; display: block; margin-bottom: 10px;">⚠️ IMPORTANT INSTRUCTIONS:</strong>
            <div style="font-size: 12px; line-height: 1.8;">
                1. Present this receipt at our office<br>
                2. Payment will be made at the office<br>
                3. Collect your items after payment<br>
                4. Keep this receipt for verification
            </div>
        </div>

        <div class="receipt-section">
            <strong style="font-size: 14px; display: block; margin-bottom: 10px;">📍 OFFICE LOCATION:</strong>
            <div style="font-size: 12px; line-height: 1.8;">
                Chesikaki Trading Center<br>
                Near Chesikaki Market<br>
                Bungoma County, Kenya<br>
                📱 +254 712 345 678
            </div>
        </div>

        <div class="receipt-footer">
            <p>Thank you for using Chesikaki Farmers Portal! 🌾</p>
            <p style="margin-top: 10px; font-size: 10px;">This is a computer-generated receipt</p>
        </div>
    `;
}

// Print receipt
function printReceipt() {
    window.print();
}

// Close receipt modal
function closeReceipt() {
    document.getElementById('receiptModal').classList.remove('active');
    
    const goToProfile = confirm('Order submitted successfully! 🎉\n\nWould you like to view your order history in your profile?');
    if (goToProfile) {
        window.location.href = 'profile.html';
    } else {
        window.location.href = 'dashboard.html';
    }
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

// Load recommendations based on cart
function loadRecommendations() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    
    if (cart.length === 0) return;
    
    const recommendations = getCartBasedRecommendations(cart, inventory, 3);
    displayRecommendations(recommendations, 'recommendations', '💡 Complete your order with these');
}

// Add to cart from recommendation
function addToCartFromRecommendation(productId) {
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    const product = inventory.find(p => p.id === productId);
    
    if (!product || product.stock === 0) {
        alert('❌ Sorry, this product is out of stock!');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        alert('✅ Added another ' + product.name + ' to cart!\nQuantity: ' + existingItem.quantity);
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
        alert('✅ ' + product.name + ' added to cart!');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}