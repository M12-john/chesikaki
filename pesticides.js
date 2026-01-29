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

// PESTICIDES DATA WITH REAL IMAGES
const pesticides = [
    {
        id: 'pest1',
        name: 'Duduthrin 1.75EC',
        price: 450,
        description: 'Broad-spectrum insecticide for controlling aphids, thrips and caterpillars. Fast-acting formula.',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
        category: 'Pesticides',
        stock: 50
    },
    {
        id: 'pest2',
        name: 'Karate 5EC',
        price: 850,
        description: 'Powerful pyrethroid insecticide. Controls pests on vegetables, maize and beans.',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
        category: 'Pesticides',
        stock: 45
    },
    {
        id: 'pest3',
        name: 'Thunder 14.5SC',
        price: 1200,
        description: 'Systemic insecticide for sucking and chewing insects. Long-lasting protection.',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
        category: 'Pesticides',
        stock: 30
    },
    {
        id: 'pest4',
        name: 'Escort 19EC',
        price: 950,
        description: 'Effective against bollworms, cutworms and armyworms. Works on contact and ingestion.',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
        category: 'Pesticides',
        stock: 40
    },
    {
        id: 'pest5',
        name: 'Ema Super 1EC',
        price: 380,
        description: 'Controls spider mites, whiteflies and aphids. Safe for beneficial insects.',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
        category: 'Pesticides',
        stock: 55
    },
    {
        id: 'pest6',
        name: 'Belt Expert 48SC',
        price: 1500,
        description: 'Premium insecticide for diamondback moth and fruit borers. Highly effective.',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
        category: 'Pesticides',
        stock: 25
    },
    {
        id: 'pest7',
        name: 'Profile 440EC',
        price: 680,
        description: 'Fungicide for controlling blight, mildew and rust on crops. Preventive and curative.',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
        category: 'Pesticides',
        stock: 38
    },
    {
        id: 'pest8',
        name: 'Absolute 50WP',
        price: 750,
        description: 'Systemic fungicide for downy mildew and early blight. Water-dispersible powder.',
        image: 'https://images.unsplash.com/photo-1582719366721-39cc230bf1ab?w=400&h=300&fit=crop',
        category: 'Pesticides',
        stock: 42
    }
];

// Update inventory with images
function updatePesticidesWithImages() {
    let inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    
    pesticides.forEach(pest => {
        const existingProduct = inventory.find(p => p.id === pest.id);
        if (existingProduct) {
            if (existingProduct.image && existingProduct.image.length <= 2) {
                existingProduct.image = pest.image;
            }
        } else {
            inventory.push(pest);
        }
    });
    
    localStorage.setItem('productsInventory', JSON.stringify(inventory));
}

updatePesticidesWithImages();

// Load products on page
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || pesticides;
    
    const pesticidesWithStock = pesticides.map(pest => {
        const inventoryItem = inventory.find(p => p.id === pest.id);
        return inventoryItem || pest;
    });
    
    pesticidesWithStock.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
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
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 220px; object-fit: cover; border-radius: 15px 15px 0 0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="width: 100%; height: 220px; background: #f5f5f5; display: none; align-items: center; justify-content: center; font-size: 60px; border-radius: 15px 15px 0 0;">🧪</div>
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

function addToCart(productId) {
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || pesticides;
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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cartCount').textContent = cart.length;
}

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

function addToCartFromRecommendation(productId) {
    addToCart(productId);
}

loadProducts();

const inventory = JSON.parse(localStorage.getItem('productsInventory')) || pesticides;
const recommendations = getCategoryBasedRecommendations('Pesticides', null, inventory, 3);
displayRecommendations(recommendations, 'recommendations', '💡 Other pesticides you might need');