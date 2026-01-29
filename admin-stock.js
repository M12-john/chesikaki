// Check if admin is logged in
const adminSession = localStorage.getItem('adminSession');

if (!adminSession) {
    alert('⚠️ Please login as admin first!');
    window.location.href = 'admin-login.html';
} else {
    const admin = JSON.parse(adminSession);
    document.getElementById('adminName').textContent = admin.username;
    loadStock();
    updateStats();
}

// Load stock data
function loadStock() {
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    const categoryFilter = document.getElementById('categoryFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;
    
    let filteredInventory = inventory;
    
    // Apply category filter
    if (categoryFilter !== 'All') {
        filteredInventory = filteredInventory.filter(p => p.category === categoryFilter);
    }
    
    // Apply stock filter
    if (stockFilter === 'In Stock') {
        filteredInventory = filteredInventory.filter(p => p.stock >= 10);
    } else if (stockFilter === 'Low Stock') {
        filteredInventory = filteredInventory.filter(p => p.stock > 0 && p.stock < 10);
    } else if (stockFilter === 'Out of Stock') {
        filteredInventory = filteredInventory.filter(p => p.stock === 0);
    }
    
    displayStock(filteredInventory);
    updateStats();
    showLowStockAlert(inventory);
}

// Display stock in table
function displayStock(products) {
    const tbody = document.getElementById('stockTableBody');
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #666;">
                    No products found with selected filters
                </td>
            </tr>
        `;
        return;
    }
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        
        // Determine stock status
        let stockStatus = '';
        if (product.stock === 0) {
            stockStatus = '<span class="stock-status stock-out">Out of Stock</span>';
        } else if (product.stock < 10) {
            stockStatus = '<span class="stock-status stock-low">Low Stock</span>';
        } else {
            stockStatus = '<span class="stock-status stock-good">In Stock</span>';
        }
        
        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${product.image && product.image.startsWith('http') ? 
                        `<img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" onerror="this.outerHTML='<span class=\\'product-icon\\'>📦</span>';">` : 
                        `<span class="product-icon">${product.image || '📦'}</span>`
                    }
                    <strong>${product.name}</strong>
                </div>
            </td>
            <td>${product.category}</td>
            <td>KSh ${product.price.toLocaleString()}</td>
            <td><strong style="font-size: 18px;">${product.stock}</strong></td>
            <td>${stockStatus}</td>
            <td>
                <div class="stock-controls">
                    <button class="btn-stock btn-subtract" onclick="quickUpdate('${product.id}', -10)">-10</button>
                    <button class="btn-stock btn-subtract" onclick="quickUpdate('${product.id}', -1)">-1</button>
                    <input type="number" class="stock-input" id="input_${product.id}" value="${product.stock}" min="0">
                    <button class="btn-stock btn-add" onclick="quickUpdate('${product.id}', 1)">+1</button>
                    <button class="btn-stock btn-add" onclick="quickUpdate('${product.id}', 10)">+10</button>
                    <button class="btn-stock btn-update" onclick="updateStock('${product.id}')">Update</button>
                    <button class="btn-delete-product" onclick="deleteProduct('${product.id}', '${product.name}')">🗑️</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Quick update (add/subtract)
function quickUpdate(productId, amount) {
    let inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    const product = inventory.find(p => p.id === productId);
    
    if (product) {
        product.stock = Math.max(0, product.stock + amount);
        localStorage.setItem('productsInventory', JSON.stringify(inventory));
        
        // Update input field
        document.getElementById('input_' + productId).value = product.stock;
        
        loadStock();
    }
}

// Update stock from input
function updateStock(productId) {
    const newStock = parseInt(document.getElementById('input_' + productId).value);
    
    if (isNaN(newStock) || newStock < 0) {
        alert('❌ Please enter a valid stock number (0 or greater)');
        return;
    }
    
    let inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    const product = inventory.find(p => p.id === productId);
    
    if (product) {
        const oldStock = product.stock;
        product.stock = newStock;
        localStorage.setItem('productsInventory', JSON.stringify(inventory));
        
        alert(`✅ Stock updated!\n\n${product.name}\nOld Stock: ${oldStock}\nNew Stock: ${newStock}`);
        
        loadStock();
    }
}

// Delete product
function deleteProduct(productId, productName) {
    const confirmDelete = confirm(`⚠️ WARNING!\n\nDelete product: ${productName}?\n\nThis will permanently remove this product from the store.\n\nThis CANNOT be undone!`);
    
    if (!confirmDelete) return;
    
    let inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    inventory = inventory.filter(p => p.id !== productId);
    localStorage.setItem('productsInventory', JSON.stringify(inventory));
    
    alert(`✅ Product "${productName}" has been deleted!`);
    
    loadStock();
}

// Update statistics
function updateStats() {
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    
    const totalProducts = inventory.length;
    const inStockProducts = inventory.filter(p => p.stock >= 10).length;
    const lowStockProducts = inventory.filter(p => p.stock > 0 && p.stock < 10).length;
    const outOfStockProducts = inventory.filter(p => p.stock === 0).length;
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('inStockProducts').textContent = inStockProducts;
    document.getElementById('lowStockProducts').textContent = lowStockProducts;
    document.getElementById('outOfStockProducts').textContent = outOfStockProducts;
}

// Show low stock alert
function showLowStockAlert(inventory) {
    const lowStockItems = inventory.filter(p => p.stock > 0 && p.stock < 10);
    const outOfStockItems = inventory.filter(p => p.stock === 0);
    const alertDiv = document.getElementById('lowStockAlert');
    
    if (lowStockItems.length === 0 && outOfStockItems.length === 0) {
        alertDiv.innerHTML = '';
        return;
    }
    
    let alertMessage = '';
    if (outOfStockItems.length > 0) {
        alertMessage += `<strong>${outOfStockItems.length} product(s) are OUT OF STOCK!</strong><br>`;
    }
    if (lowStockItems.length > 0) {
        alertMessage += `<strong>${lowStockItems.length} product(s) have LOW STOCK!</strong>`;
    }
    
    alertDiv.innerHTML = `
        <div class="alert-banner">
            <div class="alert-icon">⚠️</div>
            <div>${alertMessage}</div>
        </div>
    `;
}

// Open add product modal
function openAddProductModal() {
    document.getElementById('addProductModal').classList.add('active');
}

// Close add product modal
function closeAddProductModal() {
    document.getElementById('addProductModal').classList.remove('active');
    document.getElementById('addProductForm').reset();
}

// Handle add product form submission
document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const category = document.getElementById('productCategory').value;
    const name = document.getElementById('productName').value.trim();
    const price = parseInt(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    
    // Validate
    if (!category || !name || !price || !description || !image) {
        alert('❌ Please fill in all required fields!');
        return;
    }
    
    if (price < 0 || stock < 0) {
        alert('❌ Price and stock must be 0 or greater!');
        return;
    }
    
    // Generate unique ID
    const timestamp = Date.now();
    const categoryPrefix = category === 'Farming Tools' ? 'tool' : 
                          category === 'Pesticides' ? 'pest' : 
                          category === 'Fertilizers' ? 'fert' : 'coffee';
    const productId = categoryPrefix + '_custom_' + timestamp;
    
    // Create product object
    const newProduct = {
        id: productId,
        name: name,
        price: price,
        description: description,
        image: image,
        category: category,
        stock: stock
    };
    
    console.log('New Product Created:', newProduct);
    // Add to inventory
    let inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    inventory.push(newProduct);
    localStorage.setItem('productsInventory', JSON.stringify(inventory));
    
    alert(`✅ Product added successfully!\n\n${name}\nCategory: ${category}\nPrice: KSh ${price.toLocaleString()}\nStock: ${stock}`);
    
    // Close modal and reload
    closeAddProductModal();
    loadStock();
});

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