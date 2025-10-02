// Cart functionality
let cart = [];
let cartCount = 0;
let appliedCoupon = null;

// Predefined coupons
const coupons = {
    'NEW50': {
        code: 'NEW50',
        description: 'Flat ₹50 off on all orders',
        type: 'flat',
        value: 50,
        minOrder: 0
    },
    'SALE25': {
        code: 'SALE25',
        description: '25% off on your order',
        type: 'percentage',
        value: 25,
        minOrder: 0
    },
    'FESTIVEDAY': {
        code: 'FESTIVEDAY',
        description: '₹100 off on orders above ₹299',
        type: 'flat',
        value: 100,
        minOrder: 299
    },
    'MEGA40': {
        code: 'MEGA40',
        description: '40% off on orders above ₹500',
        type: 'percentage',
        value: 40,
        minOrder: 500
    }

    //you can add more coupons here
};

function openCart() {
    document.getElementById('cartModal').style.display = 'flex';
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('orderSuccess').style.display = 'none';
    updateCartDisplay();
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
    document.getElementById('userModal').style.display = 'none';
}

function addToCart(name, price, image) {
    // Check if product already in cart
    const existingProduct = cart.find(item => item.name === name);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    cartCount += 1;
    document.querySelector('.cart-count').textContent = cartCount;
    
    // Show toast notification
    showToast(`${name} added to cart!`);
}

function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cartTotal');
    const qrAmount = document.getElementById('qrAmount');
    
    // Clear current display
    cartItems.innerHTML = '';
    
    // Add items to display
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">₹${item.price} x ${item.quantity}</div>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="changeQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
    }
    
    // Calculate discount and final total
    let discount = 0;
    let finalTotal = total;
    
    if (appliedCoupon) {
        if (appliedCoupon.type === 'flat') {
            discount = appliedCoupon.value;
        } else if (appliedCoupon.type === 'percentage') {
            discount = Math.round((total * appliedCoupon.value) / 100);
        }
        finalTotal = Math.max(0, total - discount);
    }
    
    // Update total display
    if (appliedCoupon && discount > 0) {
        cartTotal.innerHTML = `
            <div>
                <div style="text-decoration: line-through; color: #999; font-size: 0.9rem;">₹${total}</div>
                <div style="color: var(--success);">₹${finalTotal} <span style="font-size: 0.8rem;">(₹${discount} off)</span></div>
            </div>
        `;
    } else {
        cartTotal.textContent = `₹${finalTotal}`;
    }
    
    qrAmount.textContent = `₹${finalTotal}`;
    
    // Update QR code with new total - demo only
    document.querySelector('.qr-code img').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QuickBasket-Payment-Total-₹${finalTotal}`;
}

function changeQuantity(name, change) {
    const product = cart.find(item => item.name === name);
    
    if (product) {
        product.quantity += change;
        
        if (product.quantity <= 0) {
            // Remove product from cart
            cart = cart.filter(item => item.name !== name);
        }
        
        // Update cart count
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = cartCount;
        
        // Update display
        updateCartDisplay();
    }
}

function showPaymentSection() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    document.getElementById('paymentSection').style.display = 'block';
    displayAvailableCoupons();
}

function displayAvailableCoupons() {
    const couponsList = document.getElementById('availableCoupons');
    couponsList.innerHTML = '';
    
    Object.values(coupons).forEach(coupon => {
        const couponItem = document.createElement('div');
        couponItem.className = 'coupon-item';
        couponItem.innerHTML = `
            <div class="coupon-info">
                <div class="coupon-code">${coupon.code}</div>
                <div class="coupon-desc">${coupon.description}</div>
                ${coupon.minOrder > 0 ? `<div class="coupon-min">Min order: ₹${coupon.minOrder}</div>` : ''}
            </div>
            <button class="coupon-apply-btn" onclick="applyCouponFromList('${coupon.code}')">Apply</button>
        `;
        couponsList.appendChild(couponItem);
    });
}

function applyCoupon() {
    const couponInput = document.querySelector('.coupon-input input');
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (!couponCode) {
        showCouponMessage('Please enter a coupon code', 'error');
        return;
    }
    
    if (!coupons[couponCode]) {
        showCouponMessage('Invalid coupon code', 'error');
        return;
    }
    
    const coupon = coupons[couponCode];
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (cartTotal < coupon.minOrder) {
        showCouponMessage(`Coupon not eligible for current cart value. Minimum order: ₹${coupon.minOrder}`, 'error');
        return;
    }
    
    appliedCoupon = coupon;
    couponInput.value = '';
    updateCartDisplay();
    updateCouponUI();
    showCouponMessage(`Coupon ${couponCode} applied successfully!`, 'success');
}

function applyCouponFromList(couponCode) {
    const coupon = coupons[couponCode];
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (cartTotal < coupon.minOrder) {
        showCouponMessage(`Coupon not eligible for current cart value. Minimum order: ₹${coupon.minOrder}`, 'error');
        return;
    }
    
    appliedCoupon = coupon;
    updateCartDisplay();
    updateCouponUI();
    showCouponMessage(`Coupon ${couponCode} applied successfully!`, 'success');
}

function removeCoupon() {
    appliedCoupon = null;
    updateCartDisplay();
    updateCouponUI();
    showCouponMessage('Coupon removed', 'success');
}

function updateCouponUI() {
    const appliedCouponDiv = document.getElementById('appliedCoupon');
    
    if (appliedCoupon) {
        appliedCouponDiv.style.display = 'block';
        appliedCouponDiv.innerHTML = `
            <div class="applied-coupon-info">
                <span class="applied-coupon-code">${appliedCoupon.code}</span>
                <span class="applied-coupon-desc">${appliedCoupon.description}</span>
            </div>
            <button class="remove-coupon-btn" onclick="removeCoupon()">Remove</button>
        `;
    } else {
        appliedCouponDiv.style.display = 'none';
    }
}

function showCouponMessage(message, type) {
    const messageDiv = document.getElementById('couponMessage');
    if (!messageDiv) return; // Prevent errors if element doesn't exist
    messageDiv.textContent = message;
    messageDiv.className = `coupon-message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function openUserModal() {
    document.getElementById('userModal').style.display = 'flex';
}

function switchTab(tabName) {
    // Hide all forms
    document.querySelectorAll('.user-form').forEach(form => {
        form.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.user-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected form and activate tab
    if (tabName === 'login') {
        document.getElementById('loginForm').classList.add('active');
        document.querySelectorAll('.user-tab')[0].classList.add('active');
    } else {
        document.getElementById('signupForm').classList.add('active');
        document.querySelectorAll('.user-tab')[1].classList.add('active');
    }
}

function selectPayment(element) {
    // Remove selected class from all options
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    element.classList.add('selected');
}

function placeOrder() {
    // Check if payment method is selected
    const selectedPayment = document.querySelector('.payment-option.selected');
    if (!selectedPayment) {
        showToast('Please select a payment method');
        return;
    }
    
    // Show processing animation
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('orderSuccess').style.display = 'block';
    
    // Simulate order processing
    setTimeout(() => {
        // Reset cart and coupon after successful order
        cart = [];
        cartCount = 0;
        appliedCoupon = null;
        document.querySelector('.cart-count').textContent = cartCount;
    }, 5000);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const userModal = document.getElementById('userModal');
    
    if (event.target === cartModal) {
        closeCart();
    }
    
    if (event.target === userModal) {
        userModal.style.display = 'none';
    }
};

// Form submission handlers
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Login successful!');
    document.getElementById('userModal').style.display = 'none';
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('Account created successfully!');
    document.getElementById('userModal').style.display = 'none';
});
