// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('dagwoodCart')) || [];

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    
    // Add click listeners to all Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-primary');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get item details from parent elements
            const menuItem = this.closest('.menu-item');
            const name = menuItem.querySelector('h3').textContent;
            const price = parseFloat(menuItem.querySelector('.price').textContent.replace('$', ''));
            
            // Add item to cart
            addToCart(name, price);
        });
    });
    
    // Update cart count on page load
    updateCartCount();
});

// Add to cart function
function addToCart(name, price) {
    console.log('Adding to cart:', name, price);
    
    // Add item to cart array
    cart.push({
        name: name,
        price: price,
        quantity: 1
    });
    
    // Save to localStorage
    localStorage.setItem('dagwoodCart', JSON.stringify(cart));
    
    // Update display
    updateCartCount();
    
    // Show success message
    alert('Added to cart: ' + name);
}

// Update cart count display
function updateCartCount() {
    console.log('Updating cart count. Cart has ' + cart.length + ' items');
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function renderCartItems() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }

    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Size: ${item.size}</p>
                <p>Extras: ${item.extras.join(', ') || 'None'}</p>
                <div class="cart-item-actions">
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <button onclick="removeItem(${index})" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity > 0 && newQuantity <= 10) {
        item.quantity = newQuantity;
        localStorage.setItem('dagwoodCart', JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('dagwoodCart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function showCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.classList.remove('hidden');
    checkoutForm.scrollIntoView({ behavior: 'smooth' });
}

function submitOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const orderData = {
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address')
        },
        paymentMethod: formData.get('payment'),
        items: cart,
        total: parseFloat(document.getElementById('total').textContent.slice(1))
    };

    // Here you would typically send the order to a server
    console.log('Order submitted:', orderData);

    // Clear cart and show success message
    cart = [];
    localStorage.setItem('dagwoodCart', JSON.stringify(cart));
    alert('Order placed successfully! Thank you for your purchase.');
    window.location.href = 'index.html';
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
}); 