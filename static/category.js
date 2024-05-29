const addToCartButton = document.querySelector('.add-to-cart');

addToCartButton.addEventListener('click', () => {
    alert('Product added to cart!');
});

// Get references to necessary elements
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.querySelector('.cart-modal');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const checkoutBtn = document.querySelector('.checkout-btn');

let cart = [];

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', (event) => {
    const product = JSON.parse(event.target.dataset.product);
    addToCart(product);
  });
});

// Add product to cart
function addToCart(product) {
  cart.push(product);
  updateCartCount();
  updateCartItems();
  updateCartTotal();
}

// Update cart count in the header
function updateCartCount() {
  cartCount.textContent = cart.length;
}

// Update cart items in the modal
function updateCartItems() {
  cartItems.innerHTML = '';
  cart.forEach((product, index) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <div>${product.name}</div>
      <div>$${product.price}</div>
      <button class="remove-item" data-index="${index}">Remove</button>
    `;
    cartItems.appendChild(cartItem);
  });

  // Add event listener to remove items from the cart
  document.querySelectorAll('.remove-item').forEach((button) => {
    button.addEventListener('click', (event) => {
      const index = parseInt(event.target.dataset.index);
      removeFromCart(index);
    });
  });
}

// Update the total in the cart modal
function updateCartTotal() {
  const total = cart.reduce((acc, product) => acc + product.price, 0);
  cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Remove item from the cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  updateCartItems();
  updateCartTotal();
}

// Toggle the cart modal
cartIcon.addEventListener('click', () => {
  cartModal.classList.toggle('show');
});

checkoutBtn.addEventListener('click', () =>  {
  // Implement checkout functionality here
});