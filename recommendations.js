// RECOMMENDATION ENGINE 💡

// Define product relationships (items that go well together)
const productRelationships = {
    // Tools that work well together
    'tool1': ['tool4', 'tool6', 'fert6'], // Jembe -> Spade, Rake, Organic Manure
    'tool2': ['tool8', 'tool7', 'pest5'], // Panga -> Pruning Shears, Trowel
    'tool3': ['fert6', 'tool4', 'tool1'], // Wheelbarrow -> Organic Manure, Spade, Jembe
    'tool4': ['tool1', 'tool3', 'fert6'], // Spade -> Jembe, Wheelbarrow
    'tool5': ['fert6', 'tool4', 'tool1'], // Garden Fork -> Organic Manure
    'tool6': ['tool1', 'tool4', 'tool5'], // Rake -> Jembe, Spade
    'tool7': ['tool8', 'fert7', 'pest5'], // Hand Trowel -> Pruning Shears
    'tool8': ['tool2', 'tool7', 'pest7'], // Pruning Shears -> Panga
    'tool9': ['fert7', 'tool7', 'pest5'], // Watering Can -> Foliar Feed
    
    // Pesticides that complement each other
    'pest1': ['pest7', 'fert7', 'tool9'], // Duduthrin -> Profile (fungicide)
    'pest2': ['pest4', 'fert4', 'tool9'], // Karate -> Escort
    'pest3': ['pest1', 'fert3', 'tool9'], // Thunder -> Duduthrin
    'pest4': ['pest2', 'fert4', 'tool9'], // Escort -> Karate
    'pest5': ['pest1', 'fert7', 'tool9'], // Ema Super -> Duduthrin
    'pest6': ['pest4', 'fert8', 'tool9'], // Belt Expert -> Escort
    'pest7': ['pest1', 'fert3', 'tool9'], // Profile -> Duduthrin
    'pest8': ['pest7', 'fert3', 'tool9'], // Absolute -> Profile
    
    // Fertilizers and their companions
    'fert1': ['fert2', 'pest1', 'tool1'], // DAP -> CAN
    'fert2': ['fert1', 'pest2', 'tool1'], // CAN -> DAP
    'fert3': ['fert4', 'pest3', 'tool3'], // NPK 17-17-17 -> Urea
    'fert4': ['fert3', 'pest2', 'tool1'], // Urea -> NPK
    'fert5': ['fert1', 'pest4', 'tool1'], // NPK 23-23-0 -> DAP
    'fert6': ['tool3', 'tool5', 'tool1'], // Organic Manure -> Tools
    'fert7': ['tool9', 'pest5', 'fert3'], // Foliar Feed -> Watering Can
    'fert8': ['pest6', 'fert3', 'tool9'], // Booster -> Belt Expert
    'fert9': ['fert6', 'tool5', 'tool3']  // Compost Accelerator -> Organic Manure
};

// Get recommendations based on cart
function getCartBasedRecommendations(cart, allProducts, limit = 3) {
    if (!cart || cart.length === 0) return [];
    
    const cartIds = cart.map(item => item.id);
    const recommendedIds = new Set();
    
    // For each item in cart, get related products
    cartIds.forEach(id => {
        if (productRelationships[id]) {
            productRelationships[id].forEach(relatedId => {
                // Don't recommend items already in cart
                if (!cartIds.includes(relatedId)) {
                    recommendedIds.add(relatedId);
                }
            });
        }
    });
    
    // Convert to products
    const recommendations = Array.from(recommendedIds)
        .map(id => allProducts.find(p => p.id === id))
        .filter(p => p && p.stock > 0)
        .slice(0, limit);
    
    return recommendations;
}

// Get recommendations based on category
function getCategoryBasedRecommendations(currentCategory, currentProductId, allProducts, limit = 3) {
    return allProducts
        .filter(p => 
            p.category === currentCategory && 
            p.id !== currentProductId &&
            p.stock > 0
        )
        .sort(() => Math.random() - 0.5) // Shuffle
        .slice(0, limit);
}

// Get popular products (by price range - assuming popular = good value)
function getPopularProducts(allProducts, limit = 3) {
    return allProducts
        .filter(p => p.stock > 0)
        .sort((a, b) => {
            // Products in sweet spot price range
            const aScore = (a.price >= 500 && a.price <= 2000) ? 1 : 0;
            const bScore = (b.price >= 500 && b.price <= 2000) ? 1 : 0;
            return bScore - aScore;
        })
        .slice(0, limit);
}

// Display recommendations
function displayRecommendations(recommendations, containerId, title = "💡 You might also like") {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (recommendations.length === 0) {
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    
    let html = `
        <div style="background: white; border-radius: 15px; padding: 30px; margin-top: 30px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #2d5016; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span>${title}</span>
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
    `;
    
    recommendations.forEach(product => {
        let stockHTML = '';
        if (product.stock < 10) {
            stockHTML = `<div style="color: #ff9800; font-size: 12px; font-weight: bold;">⚠️ Only ${product.stock} left!</div>`;
        }
        
        html += `
            <div style="border: 2px solid #e0e0e0; border-radius: 10px; padding: 15px; transition: transform 0.3s, border-color 0.3s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.borderColor='#4a7c2c'" onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='#e0e0e0'">
                <div style="width: 100%; height: 150px; overflow: hidden; margin-bottom: 10px; border-radius: 10px;">
                    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=&quot;font-size: 50px; text-align: center; padding-top: 40px;&quot;>📦</div>';">
                </div>
                <h4 style="color: #2d5016; margin-bottom: 5px; font-size: 16px;">${product.name}</h4>
                <p style="color: #666; font-size: 12px; margin-bottom: 10px;">${product.description.substring(0, 60)}...</p>
                ${stockHTML}
                <div style="color: #ff9800; font-size: 18px; font-weight: bold; margin: 10px 0;">KSh ${product.price.toLocaleString()}</div>
                <button onclick="addToCartFromRecommendation('${product.id}')" style="width: 100%; background: #4a7c2c; color: white; border: none; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold; transition: background 0.3s;" onmouseover="this.style.background='#2d5016'" onmouseout="this.style.background='#4a7c2c'">
                    Add to Cart 🛒
                </button>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Add to cart from recommendation
function addToCartFromRecommendation(productId) {
    // This will be defined in each page's JS file
    if (typeof addToCart === 'function') {
        addToCart(productId);
    }
}