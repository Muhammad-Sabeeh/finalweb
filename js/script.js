// Menu Items Data
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

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

// Render Menu Items with links to individual pages
function renderMenuItems() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;

    menuGrid.innerHTML = menuItems.map(item => `
        <div class="menu-item" onclick="window.location.href='menu-item.html?id=${item.id}'">
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="view-details-btn" onclick="event.stopPropagation(); window.location.href='menu-item.html?id=${item.id}'">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = Object.fromEntries(formData);
        
        // Here you would typically send the form data to a server
        console.log('Form submitted:', formObject);
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Menu Category Switching
window.addEventListener('load', function() {
    // Get all buttons and menu grids
    const buttons = document.querySelectorAll('.menu-categories .btn');
    const menuGrids = document.querySelectorAll('.menu-grid');

    // Function to switch category
    function switchCategory(categoryName) {
        // Update buttons
        buttons.forEach(btn => {
            if (btn.getAttribute('data-category') === categoryName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update grids
        menuGrids.forEach(grid => {
            if (grid.classList.contains(`category-${categoryName}`)) {
                grid.style.display = 'grid';
            } else {
                grid.style.display = 'none';
            }
        });
    }

    // Add click handlers
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            switchCategory(category);
        });
    });

    // Show sandwiches by default
    switchCategory('sandwiches');
});

// Test if script is loaded
console.log('Menu script loaded');

// Cart functionality
function addToCart(name, price) {
    console.log('Adding to cart:', name, price);
    
    // Get existing cart or initialize empty array
    let cart = [];
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error('Error parsing cart:', e);
            cart = [];
        }
    }
    
    // Add new item
    cart.push({
        name: name,
        price: price,
        quantity: 1
    });
    
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart saved:', cart);
    
    // Update display
    updateCartCount();
    
    // Show success message
    alert('Added ' + name + ' to cart!');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const savedCart = localStorage.getItem('cart');
        let count = 0;
        if (savedCart) {
            try {
                const cart = JSON.parse(savedCart);
                count = cart.length;
            } catch (e) {
                console.error('Error parsing cart for count:', e);
            }
        }
        cartCount.textContent = count;
        console.log('Updated cart count:', count);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    switchCategory('starters');
});

// Menu category switching
function switchCategory(category) {
    // Hide all categories
    document.querySelectorAll('.menu-grid').forEach(grid => {
        grid.style.display = 'none';
    });
    
    // Show selected category
    const selectedCategory = document.querySelector('.category-' + category);
    if (selectedCategory) {
        selectedCategory.style.display = 'grid';
    }
    
    // Update active state of category titles
    document.querySelectorAll('.category-title').forEach(title => {
        title.classList.remove('active');
        if (title.textContent.toLowerCase() === category) {
            title.classList.add('active');
        }
    });
}

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
}); 