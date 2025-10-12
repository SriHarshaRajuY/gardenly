// Global array to store cart items
let cart = [];

// Asynchronous function to load the cart from the server
async function loadCart() {
    try {
        // Fetch cart data from the API
        const response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        // If response is successful, update the cart with fetched items
        if (response.ok) {
            cart = data.items || [];
        } else {
            // Log error and reset cart if fetch fails
            console.error('Failed to load cart:', data.message);
            cart = [];
        }
        // Render the updated cart
        renderCart();
    } catch (error) {
        // Handle any errors during fetch
        console.error('Error loading cart:', error);
        cart = [];
        renderCart();
    }
}

// Function to render the cart items in the UI
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;

    // Clear existing cart items
    cartItems.innerHTML = "";

    // If cart is empty, display empty cart message
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="/" class="btn">Start Shopping</a>
            </div>
        `;
        const cartTotal = document.getElementById("cart-total");
        if (cartTotal) cartTotal.textContent = "0";
        return;
    }

    // Render each cart item
    cart.forEach((product) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        // Add click event to show product details
        itemDiv.onclick = () => showProductDetails(product);

        itemDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="item-details">
                <div class="item-info">
                    <h3>${product.name}</h3>
                    <p>Price: ₹${product.price.toFixed(2)}</p>
                    <p>Category: ${product.category}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${product.product_id}', -1); event.stopPropagation();">-</button>
                    <span>${product.quantity}</span>
                    <button onclick="updateQuantity('${product.product_id}', 1); event.stopPropagation();">+</button>
                    <button class="remove-btn" onclick="removeItem('${product.product_id}'); event.stopPropagation();">Remove</button>
                </div>
            </div>
        `;
        cartItems.appendChild(itemDiv);
    });

    // Update the total cart value
    updateTotal();
}

// Asynchronous function to update the quantity of a product in the cart
async function updateQuantity(productId, change) {
    // Find the product in the cart
    const product = cart.find((p) => p.product_id === productId);
    if (!product) return;

    // Calculate new quantity, ensuring it's at least 1
    const newQuantity = Math.max(1, product.quantity + change);
    try {
        // Send update request to the server
        const response = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_id: productId, quantity: newQuantity })
        });
        const data = await response.json();
        // If successful, update local cart and re-render
        if (response.ok) {
            product.quantity = newQuantity;
            renderCart();
        } else {
            // Alert user if update fails
            alert(data.message || 'Failed to update quantity');
        }
    } catch (error) {
        // Handle errors during update
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity');
    }
}

// Asynchronous function to remove an item from the cart
async function removeItem(productId) {
    try {
        // Send delete request to the server
        const response = await fetch(`/api/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        // If successful, update local cart and re-render
        if (response.ok) {
            cart = cart.filter((p) => p.product_id !== productId);
            renderCart();
        } else {
            // Alert user if removal fails
            alert(data.message || 'Failed to remove item');
        }
    } catch (error) {
        // Handle errors during removal
        console.error('Error removing item:', error);
        alert('Failed to remove item');
    }
}

// Asynchronous function to clear the entire cart
async function clearCart() {
    try {
        // Send clear request to the server
        const response = await fetch('/api/cart/clear', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        // If successful, reset local cart and re-render
        if (response.ok) {
            cart = [];
            renderCart();
        } else {
            // Alert user if clear fails
            alert(data.message || 'Failed to clear cart');
        }
    } catch (error) {
        // Handle errors during clear
        console.error('Error clearing cart:', error);
        alert('Failed to clear cart');
    }
}

// Function to calculate and update the total cart value
function updateTotal() {
    const cartTotal = document.getElementById("cart-total");
    if (!cartTotal) return;

    // Calculate total by summing up price * quantity for each item
    const total = cart.reduce((sum, product) => {
        const price = parseFloat(product.price);
        const quantity = parseInt(product.quantity) || 1;
        if (isNaN(price) || isNaN(quantity)) {
            console.warn(`Invalid price or quantity for product: ${product.name}`);
            return sum;
        }
        return sum + price * quantity;
    }, 0);

    // Display the total with two decimal places
    cartTotal.textContent = total.toFixed(2);
}

// Function to display product details in a modal
function showProductDetails(product) {
    const modal = document.getElementById("product-modal");
    if (!modal) return;

    // Populate modal with product information
    document.getElementById("modal-title").textContent = product.name;
    document.getElementById("modal-image").src = product.image;
    document.getElementById("modal-description").textContent = product.description || "No description available";
    document.getElementById("modal-price").textContent = product.price.toFixed(2);
    document.getElementById("modal-rating").textContent = product.rating || "N/A";
    document.getElementById("modal-category").textContent = product.category || "N/A";
    modal.style.display = "block";
}

// Function to close the product details modal
function closeModal() {
    const modal = document.getElementById("product-modal");
    if (modal) modal.style.display = "none";
}

// Function to toggle the visibility of the checkout form
function toggleCheckoutForm() {
    const checkoutForm = document.getElementById("checkout-form");
    if (!checkoutForm) return;

    // Check if cart is empty before showing form
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    // Clear any error messages
    document.querySelectorAll('.error').forEach(error => error.textContent = '');
    // Toggle form display
    checkoutForm.style.display = checkoutForm.style.display === "none" ? "block" : "none";
}

// Function to validate the checkout form inputs
function validateForm(customerName, address, phoneNumber, email, paymentMethod) {
    let isValid = true;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear existing error messages
    document.querySelectorAll('.error').forEach(error => error.textContent = '');

    // Validate customer name
    if (!customerName.trim()) {
        document.getElementById('customer-name-error').textContent = 'Full name is required';
        isValid = false;
    }

    // Validate address
    if (!address.trim()) {
        document.getElementById('address-error').textContent = 'Delivery address is required';
        isValid = false;
    }

    // Validate phone number
    if (!phoneRegex.test(phoneNumber)) {
        document.getElementById('phone-number-error').textContent = 'Phone number must be exactly 10 digits';
        isValid = false;
    }

    // Validate email
    if (!emailRegex.test(email)) {
        document.getElementById('email-error').textContent = 'Invalid email format';
        isValid = false;
    }

    // Validate payment method
    if (!paymentMethod) {
        document.getElementById('payment-method-error').textContent = 'Please select a payment method';
        isValid = false;
    }

    return isValid;
}

// Asynchronous function to submit the order
async function submitOrder() {
    // Retrieve form values
    const customerName = document.getElementById("customer-name").value.trim();
    const address = document.getElementById("address").value.trim();
    const phoneNumber = document.getElementById("phone-number").value.trim();
    const email = document.getElementById("email").value.trim();
    const paymentMethod = document.getElementById("payment-method").value;
    const comments = document.getElementById("comments").value.trim();

    // Validate form before submission
    if (!validateForm(customerName, address, phoneNumber, email, paymentMethod)) {
        return;
    }

    try {
        // Send order data to the server
        const response = await fetch('/api/delivery/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customer_name: customerName,
                address: address,
                phone_number: phoneNumber,
                email: email,
                payment_method: paymentMethod,
                comments: comments || null,
                items: cart
            })
        });
        const data = await response.json();
        // If successful, alert user, clear cart and form
        if (response.ok) {
            alert(`Order placed successfully! Order ID: ${data.orderId}`);
            cart = [];
            renderCart();
            toggleCheckoutForm();
            document.getElementById("customer-name").value = "";
            document.getElementById("address").value = "";
            document.getElementById("phone-number").value = "";
            document.getElementById("email").value = "";
            document.getElementById("payment-method").value = "";
            document.getElementById("comments").value = "";
        } else {
            // Alert if order placement fails
            alert(data.message || 'Failed to place order');
        }
    } catch (error) {
        // Handle errors during order submission
        console.error('Error placing order:', error);
        alert('Failed to place order');
    }
}

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
    // Load cart on page load
    loadCart();

    // Add event listener to clear cart button
    const clearCartBtn = document.getElementById("clear-cart-btn");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", clearCart);
    }

    // Add event listener to checkout button
    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", toggleCheckoutForm);
    }

    // Add event listener to submit order button
    const submitOrderBtn = document.getElementById("submit-order-btn");
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener("click", submitOrder);
    }

    // Add event listener to cancel checkout button
    const cancelCheckoutBtn = document.getElementById("cancel-checkout-btn");
    if (cancelCheckoutBtn) {
        cancelCheckoutBtn.addEventListener("click", () => {
            document.getElementById("customer-name").value = "";
            document.getElementById("address").value = "";
            document.getElementById("phone-number").value = "";
            document.getElementById("email").value = "";
            document.getElementById("payment-method").value = "";
            document.getElementById("comments").value = "";
            document.querySelectorAll('.error').forEach(error => error.textContent = '');
            toggleCheckoutForm();
        });
    }
});