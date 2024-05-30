const decrementButtons = document.querySelectorAll('.decrement-btn');
        const incrementButtons = document.querySelectorAll('.increment-btn');
        const removeButtons = document.querySelectorAll('.remove-btn');
        const subtotalElement = document.getElementById('subtotal');
        const taxElement = document.getElementById('tax');
        const shippingElement = document.getElementById('shipping');
        const totalElement = document.getElementById('total');

        decrementButtons.forEach((button, index) => {
            button.addEventListener('click', () => updateQuantity(index, -1));
        });

        incrementButtons.forEach((button, index) => {
            button.addEventListener('click', () => updateQuantity(index, 1));
        });

        removeButtons.forEach((button, index) => {
            button.addEventListener('click', () => removeItem(index));
        });

        function updateQuantity(itemIndex, change) {
            const quantityInput = document.querySelectorAll('input[type=number]')[itemIndex];
            let newQuantity = parseInt(quantityInput.value) + change;
            newQuantity = Math.max(1, newQuantity);  // Ensure quantity is at least 1

            quantityInput.value = newQuantity;

            // Send an AJAX request to update the cart on the server
            const formData = new FormData();
            formData.append('update_quantity', 'true');
            formData.append('item_index', itemIndex);
            formData.append('new_quantity', newQuantity);

            fetch("{{ url_for('cart') }}", {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(`Updated quantity for item ${itemIndex} to ${newQuantity}`);
                    // Update total cost, tax, and shipping
                    subtotalElement.textContent = `Ksh ${data.total}`;
                    taxElement.textContent = `Ksh ${data.tax}`;
                    shippingElement.textContent = `Ksh ${data.shipping}`;
                    totalElement.textContent = `Ksh ${data.total + data.tax + data.shipping}`;
                } else {
                    console.error('Failed to update quantity');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
        function removeItem(itemIndex) {
    // Send an AJAX request to remove the item from the cart on the server
    const formData = new FormData();
    formData.append('remove_item', 'true');
    formData.append('item_index', itemIndex);

    fetch("{{ url_for('cart') }}", {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Removed item ${itemIndex} from the cart`);
            // Remove the item from the page
            const cartItems = document.querySelectorAll('.cart-item');
            cartItems[itemIndex].remove();

            // Update the total cost, tax, and shipping
            const removedItemPrice = parseFloat(cartItems[itemIndex].querySelector('.item-price').textContent.replace('Ksh ', ''));
            const removedItemQuantity = parseInt(cartItems[itemIndex].querySelector('input[type=number]').value);
            const subtotalElement = document.getElementById('subtotal');
            const taxElement = document.getElementById('tax');
            const shippingElement = document.getElementById('shipping');
            const totalElement = document.getElementById('total');

            const currentSubtotal = parseFloat(subtotalElement.textContent.replace('Ksh ', ''));
            const currentTax = parseFloat(taxElement.textContent.replace('Ksh ', ''));
            const currentShipping = parseFloat(shippingElement.textContent.replace('Ksh ', ''));
            const currentTotal = parseFloat(totalElement.textContent.replace('Ksh ', ''));

            const newSubtotal = currentSubtotal - (removedItemPrice * removedItemQuantity);
            const newTax = newSubtotal * 0.1; // Assuming a 10% tax rate
            const newShipping = cartItems.length > 1 ? currentShipping : 0; // Set shipping to 0 if cart is empty
            const newTotal = newSubtotal + newTax + newShipping;

            subtotalElement.textContent = `Ksh ${newSubtotal.toFixed(2)}`;
            taxElement.textContent = `Ksh ${newTax.toFixed(2)}`;
            shippingElement.textContent = `Ksh ${newShipping.toFixed(2)}`;
            totalElement.textContent = `Ksh ${newTotal.toFixed(2)}`;
        } else {
            console.error('Failed to remove item');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}