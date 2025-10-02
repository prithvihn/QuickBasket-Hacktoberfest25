// Cart functionality
let cart = [];
let cartCount = 0;
let productsData = null;

// Load products from JSON
async function loadProducts() {
  try {
    const response = await fetch("../products.json");
    productsData = await response.json();
    renderProducts();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// Render products dynamically
function renderProducts() {
  if (!productsData) return;

  renderProductSection("popularProducts", productsData.popularProducts);
  renderProductSection("dealsProducts", productsData.deals);
}

// Render a specific product section
function renderProductSection(containerId, products) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  products.forEach((product) => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

// Create product card element
function createProductCard(product) {
  const productCard = document.createElement("div");
  productCard.className = "product-card";

  productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">₹${product.price} <span>(₹${product.discount} off)</span></div>
            <p>${product.description}</p>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')">
                    <i class="fas fa-plus"></i> Add to Cart
                </button>
                <button class="wishlist">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;

  return productCard;
}

// Initialize products when page loads
document.addEventListener("DOMContentLoaded", loadProducts);

function openCart() {
  document.getElementById("cartModal").style.display = "flex";
  document.getElementById("paymentSection").style.display = "none";
  document.getElementById("orderSuccess").style.display = "none";
  updateCartDisplay();
}

function closeCart() {
  document.getElementById("cartModal").style.display = "none";
  document.getElementById("userModal").style.display = "none";
}

function addToCart(name, price, image) {
  // Check if product already in cart
  const existingProduct = cart.find((item) => item.name === name);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1,
    });
  }

  cartCount += 1;
  document.querySelector(".cart-count").textContent = cartCount;

  // Show toast notification
  showToast(`${name} added to cart!`);
}

function updateCartDisplay() {
  const cartItems = document.querySelector(".cart-items");
  const cartTotal = document.getElementById("cartTotal");
  const qrAmount = document.getElementById("qrAmount");

  // Clear current display
  cartItems.innerHTML = "";

  // Add items to display
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
  } else {
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
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

  // Update total
  cartTotal.textContent = `₹${total}`;
  qrAmount.textContent = `₹${total}`;

  // Update QR code with new total - demo only
  document.querySelector(
    ".qr-code img"
  ).src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=QuickBasket-Payment-Total-₹${total}`;
}

function changeQuantity(name, change) {
  const product = cart.find((item) => item.name === name);

  if (product) {
    product.quantity += change;

    if (product.quantity <= 0) {
      // Remove product from cart
      cart = cart.filter((item) => item.name !== name);
    }

    // Update cart count
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector(".cart-count").textContent = cartCount;

    // Update display
    updateCartDisplay();
  }
}

function showPaymentSection() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  document.getElementById("paymentSection").style.display = "block";
}

function selectPayment(element) {
  // Remove selected class from all options
  document.querySelectorAll(".payment-option").forEach((opt) => {
    opt.classList.remove("selected");
  });

  // Add selected class to clicked option
  element.classList.add("selected");
}

function placeOrder() {
  // Check if payment method is selected
  const selectedPayment = document.querySelector(".payment-option.selected");
  if (!selectedPayment) {
    showToast("Please select a payment method");
    return;
  }

  // Show processing animation
  document.getElementById("paymentSection").style.display = "none";
  document.getElementById("orderSuccess").style.display = "block";

  // Simulate order processing
  setTimeout(() => {
    // Reset cart after successful order
    cart = [];
    cartCount = 0;
    document.querySelector(".cart-count").textContent = cartCount;
  }, 5000);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  toastMessage.textContent = message;
  toast.classList.add("show");

  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function openUserModal() {
  document.getElementById("userModal").style.display = "flex";
}

function switchTab(tabName) {
  // Hide all forms
  document.querySelectorAll(".user-form").forEach((form) => {
    form.classList.remove("active");
  });

  // Remove active class from all tabs
  document.querySelectorAll(".user-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected form and activate tab
  if (tabName === "login") {
    document.getElementById("loginForm").classList.add("active");
    document.querySelectorAll(".user-tab")[0].classList.add("active");
  } else {
    document.getElementById("signupForm").classList.add("active");
    document.querySelectorAll(".user-tab")[1].classList.add("active");
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const cartModal = document.getElementById("cartModal");
  const userModal = document.getElementById("userModal");

  if (event.target === cartModal) {
    closeCart();
  }

  if (event.target === userModal) {
    userModal.style.display = "none";
  }
};

// Form submission handlers
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    showToast("Login successful!");
    document.getElementById("userModal").style.display = "none";
  });

  document
    .getElementById("signupForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      showToast("Account created successfully!");
      document.getElementById("userModal").style.display = "none";
    });

  // Initialize theme on page load
  initializeTheme();
});

// Dark Mode Toggle Functionality
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  setTheme(newTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Add a subtle feedback animation to the navbar toggle
  const toggleButton = document.querySelector(".theme-toggle-nav");
  if (toggleButton) {
    toggleButton.style.transform = "scale(0.9)";
    setTimeout(() => {
      toggleButton.style.transform = "scale(1)";
    }, 150);
  }
}

function initializeTheme() {
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const theme = savedTheme || (prefersDark ? "dark" : "light");
  setTheme(theme);
}

// Listen for system theme changes
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    // Only auto-switch if user hasn't manually set a preference
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  });
