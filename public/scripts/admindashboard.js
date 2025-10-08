document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('.section');
    const menu = document.getElementById('menu');
    const navbar = document.querySelector('.navbar');

    // Navigation Handling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            if (sectionId === 'logout') {
                window.location.href = '/logout';
                return;
            }

            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                menu.classList.remove('fa-times');
            }
        });
    });

    menu.addEventListener('click', () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    });

    // Fetch Overview Data
    async function fetchOverview() {
        try {
            // Fetch all users from the API to count total users
            const usersRes = await fetch('/api/users');
            const users = await usersRes.json();
            document.getElementById('total-users').textContent = users.length;

            // Fetch all products from the API to count total products
            const productsRes = await fetch('/api/products');
            const products = await productsRes.json();
            document.getElementById('total-products').textContent = products.length;

            // Fetch all tickets from the API and filter for open tickets count
            const ticketsRes = await fetch('/api/tickets/all');
            const tickets = await ticketsRes.json();
            const openTickets = tickets.filter(t => t.status === 'Open').length;
            document.getElementById('open-tickets').textContent = openTickets;

            // Fetch all orders from the API and calculate total revenue by summing amounts
            const ordersRes = await fetch('/api/orders');
            const orders = await ordersRes.json();
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0); // Added fallback for amount to prevent NaN
            document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
        } catch (error) {
            console.error('Error fetching overview:', error);
        }
    }

    // Fetch Users
    async function fetchUsers() {
        try {
            // Fetch all users from the API and populate the users table
            const response = await fetch('/api/users');
            const users = await response.json();
            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '';
            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.id || user._id}</td> <!-- Fallback to _id if id not available -->
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>${user.email}</td>
                    <td>${user.mobile}</td>
                    <td>
                        <button onclick="editUser('${user.id || user._id}')">Edit</button> <!-- Use string for safety in onclick -->
                        <button class="delete" onclick="deleteUser('${user.id || user._id}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    // Fetch Products
    async function fetchProducts() {
        try {
            // Fetch all products from the API and populate the products table
            const response = await fetch('/api/products');
            const products = await response.json();
            const tbody = document.getElementById('products-table-body');
            tbody.innerHTML = '';
            products.forEach(product => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${product.id || product._id}</td> <!-- Fallback to _id if id not available -->
                    <td>${product.name}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.quantity}</td>
                    <td>${product.seller_id || 'N/A'}</td> <!-- Fallback if seller_id missing -->
                    <td>
                        <button onclick="editProduct('${product.id || product._id}')">Edit</button> <!-- Use string for safety in onclick -->
                        <button class="delete" onclick="deleteProduct('${product.id || product._id}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Fetch Tickets
    async function fetchTickets() {
        try {
            // Fetch all tickets from the API and populate the tickets table with status dropdown
            const response = await fetch('/api/tickets/all');
            const tickets = await response.json();
            const tbody = document.getElementById('tickets-table-body');
            tbody.innerHTML = '';
            tickets.forEach(ticket => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${ticket.id || ticket._id}</td> <!-- Fallback to _id if id not available -->
                    <td>${ticket.requester}</td>
                    <td>${ticket.subject}</td>
                    <td>${ticket.type}</td>
                    <td>
                        <select onchange="updateTicketStatus('${ticket.id || ticket._id}', this.value)">
                            <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                            <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
                        </select>
                    </td>
                    <td>${ticket.expert_id || 'N/A'}</td> <!-- Fallback if expert_id missing -->
                    <td>
                        <button onclick="viewTicket('${ticket.id || ticket._id}')">View</button> <!-- Use string for safety in onclick -->
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    }

    // Fetch Orders
    async function fetchOrders() {
        try {
            // Fetch all orders from the API and populate the orders table
            const response = await fetch('/api/orders');
            const orders = await response.json();
            const tbody = document.getElementById('orders-table-body');
            tbody.innerHTML = '';
            orders.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${order.id || order._id}</td> <!-- Fallback to _id if id not available -->
                    <td>${order.customer || order.customer_name || 'N/A'}</td> <!-- Fallback to customer_name if customer missing -->
                    <td>${order.product || 'N/A'}</td> <!-- Assuming product is mapped; fallback if missing -->
                    <td>$${parseFloat(order.amount || order.total || 0).toFixed(2)}</td> <!-- Fallback to total if amount missing -->
                    <td>
                        <button class="delete" onclick="deleteOrder('${order.id || order._id}')">Delete</button> <!-- Use string for safety in onclick -->
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            const tbody = document.getElementById('orders-table-body');
            tbody.innerHTML = '<tr><td colspan="5">Failed to load orders</td></tr>';
        }
    }

    // CRUD Functions for Users
    window.editUser = async (id) => {
        const newRole = prompt('Enter new role (Admin, Seller, Buyer, Expert, Delivery Manager):');
        if (newRole && ['Admin', 'Seller', 'Buyer', 'Expert', 'Delivery Manager'].includes(newRole)) {
            try {
                // Update user role via PUT request to the API
                const response = await fetch(`/api/users/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: newRole })
                });
                if (response.ok) {
                    fetchUsers(); // Refresh users table
                    alert('User updated successfully');
                } else {
                    alert('Failed to update user');
                }
            } catch (error) {
                console.error('Error updating user:', error);
            }
        }
    };

    window.deleteUser = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                // Delete user via DELETE request to the API
                const response = await fetch(`/api/users/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchUsers(); // Refresh users table
                    alert('User deleted successfully');
                } else {
                    alert('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    // CRUD Functions for Products
    window.editProduct = async (id) => {
        const newPrice = prompt('Enter new price:');
        const newQuantity = prompt('Enter new quantity:');
        if (newPrice && newQuantity && !isNaN(newPrice) && !isNaN(newQuantity)) { // Added validation for numbers
            try {
                // Update product price and quantity via PUT request to the API
                const response = await fetch(`/api/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ price: parseFloat(newPrice), quantity: parseInt(newQuantity) })
                });
                if (response.ok) {
                    fetchProducts(); // Refresh products table
                    alert('Product updated successfully');
                } else {
                    alert('Failed to update product');
                }
            } catch (error) {
                console.error('Error updating product:', error);
            }
        } else {
            alert('Invalid price or quantity entered');
        }
    };

    window.deleteProduct = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                // Delete product via DELETE request to the API
                const response = await fetch(`/api/products/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchProducts(); // Refresh products table
                    alert('Product deleted successfully');
                } else {
                    alert('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    // CRUD Functions for Tickets
    window.updateTicketStatus = async (id, status) => {
        try {
            // Update ticket status via PUT request to the API
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                fetchTickets(); // Refresh tickets table
                fetchOverview(); // Refresh overview for open tickets count
                alert('Ticket status updated');
            } else {
                alert('Failed to update ticket status');
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    window.viewTicket = (id) => {
        alert(`View details for ticket ID: ${id} (Implement modal here)`);
    };

    // CRUD Functions for Orders
    window.createOrder = async () => {
        const customer_username = prompt('Enter customer username:');
        const product_names = prompt('Enter product names (comma-separated):');
        const amount = prompt('Enter order amount:');
        
        if (customer_username && product_names && amount && !isNaN(amount)) { // Added validation for amount
            try {
                // Create new order via POST request to the API
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ customer_username, product_names, amount: parseFloat(amount) })
                });
                if (response.ok) {
                    fetchOrders(); // Refresh orders table
                    fetchOverview(); // Refresh overview for revenue
                    alert('Order created successfully');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to create order: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error creating order:', error);
                alert('Error creating order');
            }
        } else {
            alert('Invalid input provided');
        }
    };

    window.deleteOrder = async (id) => {
        if (confirm('Are you sure you want to delete this order?')) {
            try {
                // Delete order via DELETE request to the API
                const response = await fetch(`/api/orders/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchOrders(); // Refresh orders table
                    fetchOverview(); // Refresh overview for revenue
                    alert('Order deleted successfully');
                } else {
                    alert('Failed to delete order');
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Error deleting order');
            }
        }
    };

    // Initial Data Fetch
    fetchOverview();
    fetchUsers();
    fetchProducts();
    fetchTickets();
    fetchOrders();
});