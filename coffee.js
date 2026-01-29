// Check if user is logged in
const currentUser = localStorage.getItem('currentUser');

if (!currentUser) {
    alert('⚠️ Please login first!');
    window.location.href = 'login.html';
} else {
    const user = JSON.parse(currentUser);
    document.getElementById('userName').textContent = user.fullName;
    updateCartCount();
}

// COFFEE SEEDLINGS DATA
const coffeeSeedlings = [
    {
        id: 'coffee1',
        name: 'SL28 Coffee Seedlings',
        price: 150,
        description: 'High-quality SL28 variety. Excellent cup quality, drought resistant. 6-8 months old seedlings ready for planting.',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
        category: 'Coffee Seedlings',
        stock: 500
    },
    {
        id: 'coffee2',
        name: 'SL34 Coffee Seedlings',
        price: 150,
        description: 'Premium SL34 variety. Superior taste, high yield. 6-8 months old, disease resistant seedlings.',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
        category: 'Coffee Seedlings',
        stock: 450
    },
    {
        id: 'coffee3',
        name: 'Ruiru 11 Coffee Seedlings',
        price: 120,
        description: 'Disease resistant Ruiru 11. Immune to coffee berry disease and leaf rust. Fast growing variety.',
        image: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400&h=300&fit=crop',
        category: 'Coffee Seedlings',
        stock: 600
    },
    {
        id: 'coffee4',
        name: 'Batian Coffee Seedlings',
        price: 180,
        description: 'Modern Batian variety. High yielding, disease resistant. Matures in 18-24 months. Premium quality beans.',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
        category: 'Coffee Seedlings',
        stock: 350
    },
    {
        id: 'coffee5',
        name: 'K7 Coffee Seedlings',
        price: 140,
        description: 'Classic K7 variety. Good cup quality, moderate yield. Well adapted to various altitudes. Hardy seedlings.',
        image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=300&fit=crop',
        category: 'Coffee Seedlings',
        stock: 400
    },
    {
        id: 'coffee6',
        name: 'Blue Mountain Coffee Seedlings',
        price: 200,
        description: 'Premium Blue Mountain variety. Exceptional flavor profile. Best grown at high altitudes. Limited stock.',
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
        category: 'Coffee Seedlings',
        stock: 200
    },
    {
        id: 'coffee7',
        name: 'Grafted Coffee Seedlings (Mixed)',
        price: 250,
        description: 'Pre-grafted mixed varieties. Early bearing (12-18 months). Disease resistant rootstock. High yield potential.',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
        category: 'Coffee Seedlings',
        stock: 300
    }
];

// Initialize coffee seedlings in inventory if not exists
function initializeCoffeeInventory() {
    let inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    
    // Check if coffee products already exist
    const hasCoffee = inventory.some(p => p.category === 'Coffee Seedlings');
    
    if (!hasCoffee) {
        // Add all coffee seedlings to inventory
        inventory = [...inventory, ...coffeeSeedlings];
        localStorage.setItem('productsInventory', JSON.stringify(inventory));
        console.log('✅ Coffee seedlings added to inventory!');
    }
}

// Call initialization
initializeCoffeeInventory();

// Load products on page
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || coffeeSeedlings;
    
    // Get current stock levels from inventory
    const coffeeWithStock = coffeeSeedlings.map(coffee => {
        const inventoryItem = inventory.find(p => p.id === coffee.id);
        return inventoryItem || coffee;
    });
    
    coffeeWithStock.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Stock status
        let stockHTML = '';
        if (product.stock === 0) {
            stockHTML = '<div style="color: #ff5252; font-weight: bold; margin-bottom: 10px;">⚠️ Out of Stock</div>';
        } else if (product.stock < 10) {
            stockHTML = `<div style="color: #ff9800; font-weight: bold; margin-bottom: 10px;">⚠️ Only ${product.stock} left!</div>`;
        } else {
            stockHTML = `<div style="color: #4caf50; font-weight: bold; margin-bottom: 10px;">✅ In Stock (${product.stock})</div>`;
        }
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 220px; object-fit: cover; border-radius: 15px 15px 0 0;">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                ${stockHTML}
                <div class="product-price">KSh ${product.price.toLocaleString()}</div>
                <button class="btn-add-cart" onclick="addToCart('${product.id}')" ${product.stock === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Add to cart function
function addToCart(productId) {
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || coffeeSeedlings;
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
    updateCartCount();
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cartCount').textContent = cart.length;
}

// Navigation functions
function goHome() {
    window.location.href = 'dashboard.html';
}

function goToCart() {
    window.location.href = 'cart.html';
}

function logout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        localStorage.removeItem('currentUser');
        alert('✅ Logged out successfully!');
        window.location.href = 'login.html';
    }
}

// Add to cart from recommendation
function addToCartFromRecommendation(productId) {
    addToCart(productId);
}

loadProducts();

// Load recommendations
const inventory = JSON.parse(localStorage.getItem('productsInventory')) || coffeeSeedlings;
const recommendations = getCategoryBasedRecommendations('Coffee Seedlings', null, inventory, 3);
displayRecommendations(recommendations, 'recommendations', '☕ Other coffee varieties you might need');