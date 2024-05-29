// Get cart icon and dropdown elements
const cartIcon = document.querySelector('.cart-icon');
const cartDropdown = document.querySelector('.cart-dropdown');

// Add event listener to cart icon
cartIcon.addEventListener('click', () => {
  // Toggle cart dropdown visibility
  cartDropdown.classList.toggle('show');
});

// Add event listeners to quantity buttons
document.querySelectorAll('.qty-minus,.qty-plus').forEach((button) => {
  button.addEventListener('click', (e) => {
    const input = e.target.parentNode.querySelector('input');
    const currentValue = parseInt(input.value);
    const newValue = e.target.classList.contains('qty-minus')? currentValue - 1 : currentValue + 1;
    input.value = newValue;
  });
});

// Add event listener to cart remove buttons
document.querySelectorAll('.cart-remove').forEach((button) => {
  button.addEventListener('click', (e) => {
    const cartItem = e.target.parentNode;
    cartItem.remove();
    updateCartCount();
  });
});

// Update cart count function
function updateCartCount() {
  const cartItems = document.querySelectorAll('.cart-item');
  const cartCount = cartItems.length;
  document.querySelector('.cart-count').textContent = cartCount;
}

// Initialize cart count
updateCartCount();