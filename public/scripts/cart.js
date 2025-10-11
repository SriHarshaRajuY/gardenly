// Fix typo in payment method field ID
// - Improve error handling and validation

let cart = [];

async function loadCart() {
    try {
        const response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            cart = data.items || [];
        } else {
            console.error('Failed to load cart:', data.message);
            cart = [];
        }
        renderCart();
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    if (!cartItems) return;

    cartItems.innerHTML = "";

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

    cart.forEach((product) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
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

    updateTotal();
}

async function updateQuantity(productId, change) {
    const product = cart.find((p) => p.product_id === productId);
    if (!product) return;

    const newQuantity = Math.max(1, product.quantity + change);
    try {
        const response = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ product_id: productId, quantity: newQuantity })
        });
        const data = await response.json();
        if (response.ok) {
            product.quantity = newQuantity;
            renderCart();
        } else {
            alert(data.message || 'Failed to update quantity');
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        alert('Failed to update quantity');
    }
}

async function removeItem(productId) {
    try {
        const response = await fetch(`/api/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            cart = cart.filter((p) => p.product_id !== productId);
            renderCart();
        } else {
            alert(data.message || 'Failed to remove item');
        }
    } catch (error) {
        console.error('Error removing item:', error);
        alert('Failed to remove item');
    }
}

async function clearCart() {
    try {
        const response = await fetch('/api/cart/clear', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (response.ok) {
            cart = [];
            renderCart();
        } else {
            alert(data.message || 'Failed to clear cart');
        }
    } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Failed to clear cart');
    }
}

function updateTotal() {
    const cartTotal = document.getElementById("cart-total");
    if (!cartTotal) return;

    const total = cart.reduce((sum, product) => {
        const price = parseFloat(product.price);
        const quantity = parseInt(product.quantity) || 1;
        if (isNaN(price) || isNaN(quantity)) {
            console.warn(`Invalid price or quantity for product: ${product.name}`);
            return sum;
        }
        return sum + price * quantity;
    }, 0);

    cartTotal.textContent = total.toFixed(2);
}

function showProductDetails(product) {
    const modal = document.getElementById("product-modal");
    if (!modal) return;

    document.getElementById("modal-title").textContent = product.name;
    document.getElementById("modal-image").src = product.image;
    document.getElementById("modal-description").textContent = product.description || "No description available";
    document.getElementById("modal-price").textContent = product.price.toFixed(2);
    document.getElementById("modal-rating").textContent = product.rating || "N/A";
    document.getElementById("modal-category").textContent = product.category || "N/A";
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById("product-modal");
    if (modal) modal.style.display = "none";
}

function toggleCheckoutForm() {
    const checkoutForm = document.getElementById("checkout-form");
    if (!checkoutForm) return;

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    document.querySelectorAll('.error').forEach(error => error.textContent = '');
    checkoutForm.style.display = checkoutForm.style.display === "none" ? "block" : "none";
}

function validateForm(customerName, address, phoneNumber, email, paymentMethod) {
    let isValid = true;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    document.querySelectorAll('.error').forEach(error => error.textContent = '');

    if (!customerName.trim()) {
        document.getElementById('customer-name-error').textContent = 'Full name is required';
        isValid = false;
    }

    if (!address.trim()) {
        document.getElementById('address-error').textContent = 'Delivery address is required';
        isValid = false;
    }

    if (!phoneRegex.test(phoneNumber)) {
        document.getElementById('phone-number-error').textContent = 'Phone number must be exactly 10 digits';
        isValid = false;
    }

    if (!emailRegex.test(email)) {
        document.getElementById('email-error').textContent = 'Invalid email format';
        isValid = false;
    }

    if (!paymentMethod) {
        document.getElementById('payment-method-error').textContent = 'Please select a payment method';
        isValid = false;
    }

    return isValid;
}

async function submitOrder() {
    const customerName = document.getElementById("customer-name").value.trim();
    const address = document.getElementById("address").value.trim();
    const phoneNumber = document.getElementById("phone-number").value.trim();
    const email = document.getElementById("email").value.trim();
    const paymentMethod = document.getElementById("payment-method").value;
    const comments = document.getElementById("comments").value.trim();

    if (!validateForm(customerName, address, phoneNumber, email, paymentMethod)) {
        return;
    }

    try {
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
            alert(data.message || 'Failed to place order');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();

    const clearCartBtn = document.getElementById("clear-cart-btn");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", clearCart);
    }

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", toggleCheckoutForm);
    }

    const submitOrderBtn = document.getElementById("submit-order-btn");
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener("click", submitOrder);
    }

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