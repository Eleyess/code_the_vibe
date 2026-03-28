// Product Gallery with Light/Dark Mode Toggle
class ProductGallery {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // Apply saved theme
        this.applyTheme(this.currentTheme);
        
        // Add theme toggle event listener
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Add click handlers for product buttons
        this.initProductInteractions();
        
        // Add animation on scroll
        this.initScrollAnimations();
        
        console.log('🚀 Product Gallery initialized!');
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            this.themeToggle.textContent = '☀️';
        } else {
            document.documentElement.removeAttribute('data-theme');
            this.themeToggle.textContent = '🌙';
        }
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        
        // Add ripple effect feedback
        this.addRippleEffect(this.themeToggle);
    }

    initProductInteractions() {
        // Handle "Add to Cart" buttons
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = button.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent;
                this.showNotification(`🛒 ${productTitle} added to cart!`);
                this.addRippleEffect(button);
            });
        });

        // Handle "Quick View" buttons
        const quickViewButtons = document.querySelectorAll('.quick-view');
        quickViewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const productCard = button.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent;
                this.showNotification(`🔍 Quick view: ${productTitle}`);
                this.addRippleEffect(button);
            });
        });

        // Handle card clicks (optional)
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('click', () => {
                const productTitle = card.querySelector('.product-title').textContent;
                console.log(`Product clicked: ${productTitle}`);
                // You can redirect to product page here
                // window.location.href = `/product/${productId}`;
            });
        });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${this.currentTheme === 'dark' ? '#333' : '#fff'};
            color: ${this.currentTheme === 'dark' ? '#fff' : '#333'};
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    addRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255,255,255,0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${rect.left + rect.width / 2 - size / 2}px`;
        ripple.style.top = `${rect.top + rect.height / 2 - size / 2}px`;
        
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    initScrollAnimations() {
        // Add animation class to elements when they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all product cards
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => observer.observe(card));
    }
}

// Add custom animations to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    button {
        position: relative;
        overflow: hidden;
    }
    
    /* Smooth theme transition */
    * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    /* Loading state for images */
    img {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    img[src] {
        opacity: 1;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 10px;
    }
    
    ::-webkit-scrollbar-track {
        background: var(--bg-primary);
    }
    
    ::-webkit-scrollbar-thumb {
        background: #007bff;
        border-radius: 5px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: #0056b3;
    }
`;

document.head.appendChild(styleSheet);

// Initialize the gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductGallery();
});