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

// ALL PRODUCTS DATABASE
const allProducts = [
    // Farming Tools
    { id: 'tool1', name: 'Jembe (Hoe)', price: 800, description: 'Heavy-duty jembe for tilling and weeding. Durable steel blade with wooden handle.', image: '🔨', category: 'Farming Tools', stock: 25 },
    { id: 'tool2', name: 'Panga (Machete)', price: 600, description: 'Sharp panga for cutting grass, clearing bushes and harvesting. High carbon steel blade.', image: '🔪', category: 'Farming Tools', stock: 30 },
    { id: 'tool3', name: 'Wheelbarrow', price: 4500, description: 'Heavy-duty wheelbarrow with steel tray. Perfect for transporting soil, manure and harvests.', image: '🚜', category: 'Farming Tools', stock: 10 },
    { id: 'tool4', name: 'Spade', price: 1200, description: 'Strong spade for digging and moving soil. Steel blade with comfortable grip handle.', image: '⛏️', category: 'Farming Tools', stock: 20 },
    { id: 'tool5', name: 'Garden Fork', price: 950, description: 'Four-pronged fork for breaking up soil and turning compost. Rust-resistant.', image: '🔱', category: 'Farming Tools', stock: 15 },
    { id: 'tool6', name: 'Rake', price: 700, description: 'Metal rake for leveling soil and collecting debris. 14-tooth design.', image: '🧹', category: 'Farming Tools', stock: 18 },
    { id: 'tool7', name: 'Hand Trowel', price: 350, description: 'Small hand trowel for planting seedlings and transplanting. Ergonomic handle.', image: '🥄', category: 'Farming Tools', stock: 40 },
    { id: 'tool8', name: 'Pruning Shears', price: 850, description: 'Sharp pruning shears for trimming branches and harvesting. Spring-loaded design.', image: '✂️', category: 'Farming Tools', stock: 22 },
    { id: 'tool9', name: 'Watering Can', price: 450, description: '10-liter watering can with removable rose. Perfect for seedlings and gardens.', image: '💧', category: 'Farming Tools', stock: 35 },
    
    // Pesticides
    { id: 'pest1', name: 'Duduthrin 1.75EC', price: 450, description: 'Broad-spectrum insecticide for controlling aphids, thrips and caterpillars. Fast-acting formula.', image: '🧪', category: 'Pesticides', stock: 50 },
    { id: 'pest2', name: 'Karate 5EC', price: 850, description: 'Powerful pyrethroid insecticide. Controls pests on vegetables, maize and beans.', image: '💉', category: 'Pesticides', stock: 45 },
    { id: 'pest3', name: 'Thunder 14.5SC', price: 1200, description: 'Systemic insecticide for sucking and chewing insects. Long-lasting protection.', image: '⚗️', category: 'Pesticides', stock: 30 },
    { id: 'pest4', name: 'Escort 19EC', price: 950, description: 'Effective against bollworms, cutworms and armyworms. Works on contact and ingestion.', image: '🧫', category: 'Pesticides', stock: 40 },
    { id: 'pest5', name: 'Ema Super 1EC', price: 380, description: 'Controls spider mites, whiteflies and aphids. Safe for beneficial insects.', image: '💊', category: 'Pesticides', stock: 55 },
    { id: 'pest6', name: 'Belt Expert 48SC', price: 1500, description: 'Premium insecticide for diamondback moth and fruit borers. Highly effective.', image: '🔬', category: 'Pesticides', stock: 25 },
    { id: 'pest7', name: 'Profile 440EC', price: 680, description: 'Fungicide for controlling blight, mildew and rust on crops. Preventive and curative.', image: '🧬', category: 'Pesticides', stock: 38 },
    { id: 'pest8', name: 'Absolute 50WP', price: 750, description: 'Systemic fungicide for downy mildew and early blight. Water-dispersible powder.', image: '⚕️', category: 'Pesticides', stock: 42 },
    
    // Fertilizers
    { id: 'fert1', name: 'DAP Fertilizer (50kg)', price: 5800, description: 'Di-Ammonium Phosphate. High phosphorus content for root development. NPK 18-46-0.', image: '🌱', category: 'Fertilizers', stock: 100 },
    { id: 'fert2', name: 'CAN Fertilizer (50kg)', price: 4200, description: 'Calcium Ammonium Nitrate. Fast-acting nitrogen source for rapid growth. 26% Nitrogen.', image: '🌿', category: 'Fertilizers', stock: 120 },
    { id: 'fert3', name: 'NPK 17-17-17 (50kg)', price: 5500, description: 'Balanced fertilizer with equal amounts of Nitrogen, Phosphorus and Potassium.', image: '🍃', category: 'Fertilizers', stock: 80 },
    { id: 'fert4', name: 'Urea Fertilizer (50kg)', price: 4500, description: 'High nitrogen fertilizer (46% N) for leaf and stem growth. Quick-release formula.', image: '🌾', category: 'Fertilizers', stock: 150 },
    { id: 'fert5', name: 'NPK 23-23-0 (50kg)', price: 5200, description: 'High nitrogen and phosphorus. Ideal for cereals and vegetables during planting.', image: '🌳', category: 'Fertilizers', stock: 90 },
    { id: 'fert6', name: 'Organic Manure (50kg)', price: 800, description: 'Well-decomposed organic fertilizer. Improves soil structure and fertility naturally.', image: '♻️', category: 'Fertilizers', stock: 200 },
    { id: 'fert7', name: 'Foliar Feed (1L)', price: 1200, description: 'Liquid fertilizer for spraying on leaves. Fast nutrient absorption. Rich in micronutrients.', image: '💧', category: 'Fertilizers', stock: 60 },
    { id: 'fert8', name: 'Booster Fertilizer (25kg)', price: 3500, description: 'NPK 20-10-10 for flowering and fruiting stage. Promotes better yields.', image: '🌺', category: 'Fertilizers', stock: 70 },
    { id: 'fert9', name: 'Compost Accelerator (5kg)', price: 950, description: 'Speeds up composting process. Organic formula enriched with beneficial microbes.', image: '🪴', category: 'Fertilizers', stock: 45 },

    // Coffee Seedlings
    { id: 'coffee1', name: 'SL28 Coffee Seedlings', price: 150, description: 'High-quality SL28 variety. Excellent cup quality, drought resistant. 6-8 months old seedlings ready for planting.', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop', category: 'Coffee Seedlings', stock: 500 },
    { id: 'coffee2', name: 'SL34 Coffee Seedlings', price: 150, description: 'Premium SL34 variety. Superior taste, high yield. 6-8 months old, disease resistant seedlings.', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop', category: 'Coffee Seedlings', stock: 450 },
    { id: 'coffee3', name: 'Ruiru 11 Coffee Seedlings', price: 120, description: 'Disease resistant Ruiru 11. Immune to coffee berry disease and leaf rust. Fast growing variety.', image: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?w=400&h=300&fit=crop', category: 'Coffee Seedlings', stock: 600 },
    { id: 'coffee4', name: 'Batian Coffee Seedlings', price: 180, description: 'Modern Batian variety. High yielding, disease resistant. Matures in 18-24 months. Premium quality beans.', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop', category: 'Coffee Seedlings', stock: 350 },
    { id: 'coffee5', name: 'K7 Coffee Seedlings', price: 140, description: 'Classic K7 variety. Good cup quality, moderate yield. Well adapted to various altitudes. Hardy seedlings.', image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=300&fit=crop', category: 'Coffee Seedlings', stock: 400 },
    { id: 'coffee6', name: 'Blue Mountain Coffee Seedlings', price: 200, description: 'Premium Blue Mountain variety. Exceptional flavor profile. Best grown at high altitudes. Limited stock.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', category: 'Coffee Seedlings', stock: 200 },
    { id: 'coffee7', name: 'Grafted Coffee Seedlings (Mixed)', price: 250, description: 'Pre-grafted mixed varieties. Early bearing (12-18 months). Disease resistant rootstock. High yield potential.', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop', category: 'Coffee Seedlings', stock: 300 }
];

// Save products to localStorage for stock management
if (!localStorage.getItem('productsInventory')) {
    localStorage.setItem('productsInventory', JSON.stringify(allProducts));
}

// ... rest of your functions (searchProducts, displayResults, addToCart, etc.)

function logout() {
    const confirmLogout = confirm('Are you sure you want to logout?');
    if (confirmLogout) {
        localStorage.removeItem('currentUser');
        alert('✅ Logged out successfully!');
        window.location.href = 'login.html';
    }
}