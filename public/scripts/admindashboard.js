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

    // Fetch Overview Data - FIXED VERSION
    async function fetchOverview() {
        try {
            console.log('Fetching overview data...');
            
            // Fetch all users from the API to count total users
            const usersRes = await fetch('/api/users');
            if (!usersRes.ok) throw new Error(`Failed to fetch users: ${usersRes.status}`);
            const users = await usersRes.json();
            document.getElementById('total-users').textContent = users.length;
            console.log('Users loaded:', users.length);

            // Fetch all products from the API to count total products
            const productsRes = await fetch('/api/products');
            if (!productsRes.ok) throw new Error(`Failed to fetch products: ${productsRes.status}`);
            const products = await productsRes.json();
            document.getElementById('total-products').textContent = products.length;
            console.log('Products loaded:', products.length);

            // FIXED: Fetch all tickets from the correct API endpoint
            const ticketsRes = await fetch('/api/tickets/all');
            if (!ticketsRes.ok) throw new Error(`Failed to fetch tickets: ${ticketsRes.status}`);
            const tickets = await ticketsRes.json();
            const openTickets = tickets.filter(t => t.status === 'Open').length;
            document.getElementById('open-tickets').textContent = openTickets;
            console.log('Tickets loaded:', tickets.length, 'Open tickets:', openTickets);

            // Fetch all orders from the API and calculate total revenue
            const ordersRes = await fetch('/api/orders');
            if (!ordersRes.ok) throw new Error(`Failed to fetch orders: ${ordersRes.status}`);
            const orders = await ordersRes.json();
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.amount || order.total || 0), 0);
            document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
            console.log('Orders loaded:', orders.length, 'Total revenue:', totalRevenue);

        } catch (error) {
            console.error('Error fetching overview:', error);
            // Set default values on error
            document.getElementById('open-tickets').textContent = '0';
            document.getElementById('total-revenue').textContent = '$0.00';
        }
    }

    // Fetch Users - FIXED VERSION
    async function fetchUsers() {
        try {
            console.log('Fetching users...');
            const response = await fetch('/api/users');
            if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
            
            const users = await response.json();
            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '';
            
            users.forEach(user => {
                const userId = user.id || user._id;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${userId}</td>
                    <td>${user.username || 'N/A'}</td>
                    <td>${user.role || 'N/A'}</td>
                    <td>${user.email || 'N/A'}</td>
                    <td>${user.mobile || 'N/A'}</td>
                    <td>
                        <button onclick="editUser('${userId}')">Edit</button>
                        <button class="delete" onclick="deleteUser('${userId}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            console.log('Users table populated with', users.length, 'users');
        } catch (error) {
            console.error('Error fetching users:', error);
            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Failed to load users</td></tr>';
        }
    }

    // Fetch Products - FIXED VERSION
    async function fetchProducts() {
        try {
            console.log('Fetching products...');
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
            
            const products = await response.json();
            const tbody = document.getElementById('products-table-body');
            tbody.innerHTML = '';
            
            products.forEach(product => {
                const productId = product.id || product._id;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${productId}</td>
                    <td>${product.name || 'N/A'}</td>
                    <td>$${(product.price || 0).toFixed(2)}</td>
                    <td>${product.quantity || 0}</td>
                    <td>${product.seller_id || 'N/A'}</td>
                    <td>
                        <button onclick="editProduct('${productId}')">Edit</button>
                        <button class="delete" onclick="deleteProduct('${productId}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            console.log('Products table populated with', products.length, 'products');
        } catch (error) {
            console.error('Error fetching products:', error);
            const tbody = document.getElementById('products-table-body');
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Failed to load products</td></tr>';
        }
    }

    // Fetch Tickets - FIXED VERSION
    async function fetchTickets() {
        try {
            console.log('Fetching tickets...');
            const response = await fetch('/api/tickets/all');
            if (!response.ok) throw new Error(`Failed to fetch tickets: ${response.status}`);
            
            const tickets = await response.json();
            const tbody = document.getElementById('tickets-table-body');
            tbody.innerHTML = '';
            
            tickets.forEach(ticket => {
                const ticketId = ticket.id || ticket._id;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${ticketId}</td>
                    <td>${ticket.requester || 'N/A'}</td>
                    <td>${ticket.subject || 'N/A'}</td>
                    <td>${ticket.type || 'N/A'}</td>
                    <td>
                        <select onchange="updateTicketStatus('${ticketId}', this.value)">
                            <option value="Open" ${ticket.status === 'Open' ? 'selected' : ''}>Open</option>
                            <option value="In Progress" ${ticket.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Closed" ${ticket.status === 'Closed' ? 'selected' : ''}>Closed</option>
                            <option value="Resolved" ${ticket.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                        </select>
                    </td>
                    <td>${ticket.expert_id || 'N/A'}</td>
                    <td>
                        <button onclick="viewTicket('${ticketId}')">View</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            console.log('Tickets table populated with', tickets.length, 'tickets');
        } catch (error) {
            console.error('Error fetching tickets:', error);
            const tbody = document.getElementById('tickets-table-body');
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: red;">Failed to load tickets</td></tr>';
        }
    }

    // Fetch Orders - FIXED VERSION
    async function fetchOrders() {
        try {
            console.log('Fetching orders...');
            const response = await fetch('/api/orders');
            if (!response.ok) throw new Error(`Failed to fetch orders: ${response.status}`);
            
            const orders = await response.json();
            const tbody = document.getElementById('orders-table-body');
            tbody.innerHTML = '';
            
            orders.forEach(order => {
                const orderId = order.id || order._id || order.order_id;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${orderId}</td>
                    <td>${order.customer || order.customer_name || 'N/A'}</td>
                    <td>${order.product || 'N/A'}</td>
                    <td>$${parseFloat(order.amount || order.total || 0).toFixed(2)}</td>
                    <td>
                        <button class="delete" onclick="deleteOrder('${orderId}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            console.log('Orders table populated with', orders.length, 'orders');
        } catch (error) {
            console.error('Error fetching orders:', error);
            const tbody = document.getElementById('orders-table-body');
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Failed to load orders</td></tr>';
        }
    }

    // CRUD Functions for Users - FIXED VERSION
    window.editUser = async (id) => {
        const newRole = prompt('Enter new role (Admin, Seller, Buyer, Expert, Delivery Manager):');
        if (newRole && ['Admin', 'Seller', 'Buyer', 'Expert', 'Delivery Manager'].includes(newRole)) {
            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: newRole })
                });
                
                if (response.ok) {
                    await fetchUsers(); // Refresh users table
                    await fetchOverview(); // Refresh overview
                    alert('User updated successfully');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to update user: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error updating user:', error);
                alert('Error updating user: ' + error.message);
            }
        } else {
            alert('Invalid role selected');
        }
    };

    window.deleteUser = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    await fetchUsers(); // Refresh users table
                    await fetchOverview(); // Refresh overview
                    alert('User deleted successfully');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to delete user: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Error deleting user: ' + error.message);
            }
        }
    };

    // CRUD Functions for Products - FIXED VERSION
    window.editProduct = async (id) => {
        const newPrice = prompt('Enter new price:');
        const newQuantity = prompt('Enter new quantity:');
        
        if (newPrice && newQuantity && !isNaN(newPrice) && !isNaN(newQuantity)) {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        price: parseFloat(newPrice), 
                        quantity: parseInt(newQuantity) 
                    })
                });
                
                if (response.ok) {
                    await fetchProducts(); // Refresh products table
                    await fetchOverview(); // Refresh overview
                    alert('Product updated successfully');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to update product: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error updating product:', error);
                alert('Error updating product: ' + error.message);
            }
        } else {
            alert('Invalid price or quantity entered');
        }
    };

    window.deleteProduct = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`/api/products/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    await fetchProducts(); // Refresh products table
                    await fetchOverview(); // Refresh overview
                    alert('Product deleted successfully');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to delete product: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product: ' + error.message);
            }
        }
    };

    // CRUD Functions for Tickets - FIXED VERSION
    window.updateTicketStatus = async (id, status) => {
        try {
            const response = await fetch(`/api/tickets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            
            if (response.ok) {
                await fetchTickets(); // Refresh tickets table
                await fetchOverview(); // Refresh overview for open tickets count
                alert('Ticket status updated successfully');
            } else {
                const errorData = await response.json();
                alert(`Failed to update ticket status: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
            alert('Error updating ticket: ' + error.message);
        }
    };

    window.viewTicket = async (id) => {
        try {
            const response = await fetch(`/api/tickets/${id}`);
            if (response.ok) {
                const ticket = await response.json();
                // Show ticket details in a modal or alert
                const ticketDetails = `
Ticket ID: ${ticket._id}
Requester: ${ticket.requester}
Subject: ${ticket.subject}
Type: ${ticket.type}
Status: ${ticket.status}
Description: ${ticket.description}
Expert: ${ticket.expert_id || 'Unassigned'}
Resolution: ${ticket.resolution || 'None'}
Created: ${new Date(ticket.created_at).toLocaleString()}
                `;
                alert(ticketDetails);
            } else {
                alert('Failed to fetch ticket details');
            }
        } catch (error) {
            console.error('Error viewing ticket:', error);
            alert('Error viewing ticket details');
        }
    };

    // CRUD Functions for Orders - FIXED VERSION
    window.createOrder = async () => {
        const customer_username = prompt('Enter customer username:');
        const product_names = prompt('Enter product names (comma-separated):');
        const amount = prompt('Enter order amount:');
        
        if (customer_username && product_names && amount && !isNaN(amount)) {
            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        customer_username, 
                        product_names, 
                        amount: parseFloat(amount) 
                    })
                });
                
                if (response.ok) {
                    await fetchOrders(); // Refresh orders table
                    await fetchOverview(); // Refresh overview for revenue
                    alert('Order created successfully');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to create order: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error creating order:', error);
                alert('Error creating order: ' + error.message);
            }
        } else {
            alert('Invalid input provided');
        }
    };

    window.deleteOrder = async (id) => {
        if (confirm('Are you sure you want to delete this order?')) {
            try {
                const response = await fetch(`/api/orders/${id}`, {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    await fetchOrders(); // Refresh orders table
                    await fetchOverview(); // Refresh overview for revenue
                    alert('Order deleted successfully');
                } else {
                    const errorData = await response.json();
                    alert(`Failed to delete order: ${errorData.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Error deleting order: ' + error.message);
            }
        }
    };

    // Refresh data when switching to different sections
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionId = link.getAttribute('href').substring(1);
            if (sectionId === 'logout') return;
            
            // Refresh data for the section being viewed
            setTimeout(() => {
                switch(sectionId) {
                    case 'overview':
                        fetchOverview();
                        break;
                    case 'users':
                        fetchUsers();
                        break;
                    case 'products':
                        fetchProducts();
                        break;
                    case 'tickets':
                        fetchTickets();
                        break;
                    case 'orders':
                        fetchOrders();
                        break;
                }
            }, 100);
        });
    });

    // Initial Data Fetch with error handling
    async function initializeDashboard() {
        try {
            console.log('Initializing admin dashboard...');
            await Promise.all([
                fetchOverview(),
                fetchUsers(),
                fetchProducts(), 
                fetchTickets(),
                fetchOrders()
            ]);
            console.log('Admin dashboard initialized successfully');
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    }

    // Start the dashboard
    initializeDashboard();

    // Auto-refresh overview every 30 seconds
    setInterval(fetchOverview, 30000);
});