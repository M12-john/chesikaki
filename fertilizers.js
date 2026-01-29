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

// FERTILIZERS DATA WITH REAL IMAGES
const fertilizers = [
    {
        id: 'fert1',
        name: 'DAP Fertilizer (50kg)',
        price: 5800,
        description: 'Di-Ammonium Phosphate. High phosphorus content for root development. NPK 18-46-0.',
        image: 'image/N.P.K.webp',
        category: 'Fertilizers',
        stock: 100
    },
    {
        id: 'fert2',
        name: 'CAN Fertilizer (50kg)',
        price: 4200,
        description: 'Calcium Ammonium Nitrate. Fast-acting nitrogen source for rapid growth. 26% Nitrogen.',
        image: 'image/N.P.K.webp',
        category: 'Fertilizers',
        stock: 120
    },
    {
        id: 'fert3',
        name: 'NPK 17-17-17 (50kg)',
        price: 5500,
        description: 'Balanced fertilizer with equal amounts of Nitrogen, Phosphorus and Potassium.',
        image: 'image/N.P.K.webp',
        category: 'Fertilizers',
        stock: 80
    },
    {
        id: 'fert4',
        name: 'Urea Fertilizer (50kg)',
        price: 4500,
        description: 'High nitrogen fertilizer (46% N) for leaf and stem growth. Quick-release formula.',
        image: 'image/N.P.K.webp',
        category: 'Fertilizers',
        stock: 150
    },
    {
        id: 'fert5',
        name: 'NPK 23-23-0 (50kg)',
        price: 5200,
        description: 'High nitrogen and phosphorus. Ideal for cereals and vegetables during planting.',
        image: 'image/N.P.K.webp',
        category: 'Fertilizers',
        stock: 90
    },
    {
        id: 'fert6',
        name: 'Organic Manure (50kg)',
        price: 800,
        description: 'Well-decomposed organic fertilizer. Improves soil structure and fertility naturally.',
        image: 'image/N.P.K.webp',
        category: 'Fertilizers',
        stock: 200
    },
    {
        id: 'fert7',
        name: 'Foliar Feed (1L)',
        price: 1200,
        description: 'Liquid fertilizer for spraying on leaves. Fast nutrient absorption. Rich in micronutrients.',
        image: 'image/N.P.K.webp',
        category: 'Fertilizers',
        stock: 60
    },
    {
        id: 'fert8',
        name: 'Booster Fertilizer (25kg)',
        price: 3500,
        description: 'NPK 20-10-10 for flowering and fruiting stage. Promotes better yields.',
        image: 'image/N.P.K.webp',
        category: 'Fertilizers',
        stock: 70
    },
    {
        id: 'fert9',
        name: 'Compost Accelerator (5kg)',
        price: 950,
        description: 'Speeds up composting process. Organic formula enriched with beneficial microbes.',
        image: 'image/N.P.K.webp',
        category: 'Fertilizers',
        stock: 45
    }
];

// Update inventory with images
function updateFertilizersWithImages() {
    let inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    
    fertilizers.forEach(fert => {
        const existingProduct = inventory.find(p => p.id === fert.id);
        if (existingProduct) {
            if (existingProduct.image && existingProduct.image.length <= 2) {
                existingProduct.image = fert.image;
            }
        } else {
            inventory.push(fert);
        }
    });
    
    localStorage.setItem('productsInventory', JSON.stringify(inventory));
}

updateFertilizersWithImages();

// Load products on page
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || fertilizers;
    
    const fertilizersWithStock = fertilizers.map(fert => {
        const inventoryItem = inventory.find(p => p.id === fert.id);
        return inventoryItem || fert;
    });
    
    fertilizersWithStock.forEach(product => {
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
                <div style="width: 100%; height: 220px; background: #f5f5f5; display: none; align-items: center; justify-content: center; font-size: 60px; border-radius: 15px 15px 0 0;">🌱</div>
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
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || fertilizers;
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

const inventory = JSON.parse(localStorage.getItem('productsInventory')) || fertilizers;
const recommendations = getCategoryBasedRecommendations('Fertilizers', null, inventory, 3);
displayRecommendations(recommendations, 'recommendations', '💡 Other fertilizers you might need');