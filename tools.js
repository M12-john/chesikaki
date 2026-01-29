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

// FARMING TOOLS DATA WITH REAL IMAGES
const farmingTools = [
    {
        id: 'tool1',
        name: 'Jembe (Hoe)',
        price: 800,
        description: 'Heavy-duty jembe for tilling and weeding. Durable steel blade with wooden handle.',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
        category: 'Farming Tools',
        stock: 25
    },
    {
        id: 'tool2',
        name: 'Panga (Machete)',
        price: 600,
        description: 'Sharp panga for cutting grass, clearing bushes and harvesting. High carbon steel blade.',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
        category: 'Farming Tools',
        stock: 30
    },
    {
        id: 'tool3',
        name: 'Wheelbarrow',
        price: 4500,
        description: 'Heavy-duty wheelbarrow with steel tray. Perfect for transporting soil, manure and harvests.',
        image: 'https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=400&h=300&fit=crop',
        category: 'Farming Tools',
        stock: 10
    },
    {
        id: 'tool4',
        name: 'Spade',
        price: 1200,
        description: 'Strong spade for digging and moving soil. Steel blade with comfortable grip handle.',
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=300&fit=crop',
        category: 'Farming Tools',
        stock: 20
    },
    {
        id: 'tool5',
        name: 'Garden Fork',
        price: 950,
        description: 'Four-pronged fork for breaking up soil and turning compost. Rust-resistant.',
        image: 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=400&h=300&fit=crop',
        category: 'Farming Tools',
        stock: 15
    },
    {
        id: 'tool6',
        name: 'Rake',
        price: 700,
        description: 'Metal rake for leveling soil and collecting debris. 14-tooth design.',
        image: 'https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=400&h=300&fit=crop',
        category: 'Farming Tools',
        stock: 18
    },
    {
        id: 'tool7',
        name: 'Hand Trowel',
        price: 350,
        description: 'Small hand trowel for planting seedlings and transplanting. Ergonomic handle.',
        image: 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=400&h=300&fit=crop',
        category: 'Farming Tools',
        stock: 40
    },
    {
        id: 'tool8',
        name: 'Pruning Shears',
        price: 850,
        description: 'Sharp pruning shears for trimming branches and harvesting. Spring-loaded design.',
        image: 'https://images.unsplash.com/photo-1617082731062-36b0f2f96b8e?w=400&h=300&fit=crop',
        category: 'Farming Tools',
        stock: 22
    },
    {
        id: 'tool9',
        name: 'Watering Can',
        price: 450,
        description: '10-liter watering can with removable rose. Perfect for seedlings and gardens.',
        image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=300&fit=crop',
        category: 'Farming Tools',
        stock: 35
    }
];

// Update inventory with images if needed
function updateToolsWithImages() {
    let inventory = JSON.parse(localStorage.getItem('productsInventory')) || [];
    
    farmingTools.forEach(tool => {
        const existingProduct = inventory.find(p => p.id === tool.id);
        if (existingProduct) {
            // Update image if it's still an emoji
            if (existingProduct.image && existingProduct.image.length <= 2) {
                existingProduct.image = tool.image;
            }
        } else {
            // Add if doesn't exist
            inventory.push(tool);
        }
    });
    
    localStorage.setItem('productsInventory', JSON.stringify(inventory));
}

// Call update
updateToolsWithImages();

// Load products on page
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || farmingTools;
    
    // Get current stock levels from inventory
    const toolsWithStock = farmingTools.map(tool => {
        const inventoryItem = inventory.find(p => p.id === tool.id);
        return inventoryItem || tool;
    });
    
    toolsWithStock.forEach(product => {
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
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 220px; object-fit: cover; border-radius: 15px 15px 0 0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="width: 100%; height: 220px; background: #f5f5f5; display: none; align-items: center; justify-content: center; font-size: 60px; border-radius: 15px 15px 0 0;">🛠️</div>
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
    const inventory = JSON.parse(localStorage.getItem('productsInventory')) || farmingTools;
    const product = inventory.find(p => p.id === productId);
    
    if (!product || product.stock === 0) {
        alert('❌ Sorry, this product is out of stock!');
        return;
    }
    
    // Get existing cart or create new one
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
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
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
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

// Load products when page loads
loadProducts();

// Load recommendations
const inventory = JSON.parse(localStorage.getItem('productsInventory')) || farmingTools;
const recommendations = getCategoryBasedRecommendations('Farming Tools', null, inventory, 3);
displayRecommendations(recommendations, 'recommendations', '💡 Other tools you might need');