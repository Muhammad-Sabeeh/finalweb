// Get item details from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('id');

// Menu Items Data (this should match the data in script.js)
const menuItems = [
    {
        id: 1,
        name: "Classic Dagwood Sandwich",
        description: "Multiple layers of meats, cheeses, and vegetables",
        price: 12.99,
        image: "images/classic-dagwood.jpg",
        category: "Signature"
    },
    {
        id: 2,
        name: "Vegetarian Delight",
        description: "Fresh vegetables, hummus, and avocado",
        price: 10.99,
        image: "images/veggie-delight.jpg",
        category: "Vegetarian"
    },
    {
        id: 3,
        name: "Spicy Italian",
        description: "Italian meats with provolone and peppers",
        price: 11.99,
        image: "images/spicy-italian.jpg",
        category: "Signature"
    },
    {
        id: 4,
        name: "Mediterranean Wrap",
        description: "Falafel, tzatziki, and fresh vegetables",
        price: 9.99,
        image: "images/mediterranean.jpg",
        category: "Wraps"
    },
    {
        id: 5,
        name: "Chef's Special",
        description: "Daily special creation by our chef",
        price: 13.99,
        image: "images/chef-special.jpg",
        category: "Specials"
    },
    {
        id: 6,
        name: "Garden Fresh Salad",
        description: "Mixed greens with seasonal vegetables",
        price: 8.99,
        image: "images/garden-salad.jpg",
        category: "Salads"
    }
];

// Get current item
const currentItem = menuItems.find(item => item.id === parseInt(itemId));

// Initialize page
function initializePage() {
    if (!currentItem) {
        window.location.href = 'index.html';
        return;
    }

    // Update page title
    document.title = `${currentItem.name} - Foodie Moodie`;

    // Update item details
    document.getElementById('item-img').src = currentItem.image;
    document.getElementById('item-img').alt = currentItem.name;
    document.getElementById('item-name').textContent = currentItem.name;
    document.getElementById('item-description').textContent = currentItem.description;
    document.getElementById('item-price').textContent = `$${currentItem.price.toFixed(2)}`;
    document.getElementById('item-category').textContent = currentItem.category;

    // Load related items
    loadRelatedItems();
}

// Load related items (same category, excluding current item)
function loadRelatedItems() {
    const relatedItems = menuItems.filter(item => 
        item.category === currentItem.category && item.id !== currentItem.id
    );

    const relatedGrid = document.querySelector('.related-grid');
    relatedGrid.innerHTML = relatedItems.map(item => `
        <div class="menu-item" onclick="window.location.href='menu-item.html?id=${item.id}'">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <span class="price">$${item.price.toFixed(2)}</span>
            </div>
        </div>
    `).join('');
}

// Quantity controls
function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput.value < 10) {
        quantityInput.value = parseInt(quantityInput.value) + 1;//parseInt kisi string ko integer mein convert karta hai.
    }
}

// Add to cart functionality
function addToCart() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const size = document.querySelector('input[name="size"]:checked').value;
    const extras = Array.from(document.querySelectorAll('input[name="extra"]:checked'))
        .map(input => input.value);

    // Calculate total price including extras and size
    let totalPrice = currentItem.price;
    if (size === 'large') totalPrice += 2.00;
    extras.forEach(extra => {
        if (extra === 'cheese') totalPrice += 1.00;
        if (extra === 'meat') totalPrice += 2.50;
        if (extra === 'veggies') totalPrice += 1.00;
    });

    const cartItem = {
        id: currentItem.id,
        name: currentItem.name,
        price: totalPrice,
        quantity: quantity,
        size: size,
        extras: extras,
        image: currentItem.image
    };

    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === cartItem.id && 
        item.size === cartItem.size && 
        JSON.stringify(item.extras) === JSON.stringify(cartItem.extras)
    );

    if (existingItemIndex !== -1) {
        // Update quantity if total doesn't exceed 10
        const newQuantity = cart[existingItemIndex].quantity + quantity;
        if (newQuantity <= 10) {
            cart[existingItemIndex].quantity = newQuantity;
        } else {
            alert('Maximum quantity of 10 items reached for this item');
            return;
        }
    } else {
        cart.push(cartItem);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Show success message
    alert('Item added to cart!');
}

// Buy now functionality
function buyNow() {
    addToCart();
    window.location.href = 'cart.html';
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    updateCartCount();
}); 