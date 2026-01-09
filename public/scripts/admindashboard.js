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

    menu.addEventListener('click', () => {
        menu.classList.toggle('fa-times');
        navbar.classList.toggle('active');
    });

    // =======================
    // Fetch Overview Data
    // =======================
    async function fetchOverview() {
        try {
            console.log('Fetching overview data...');

            const usersRes = await fetch('/api/users');
            if (!usersRes.ok) throw new Error(`Failed to fetch users: ${usersRes.status}`);
            const users = await usersRes.json();
            document.getElementById('total-users').textContent = users.length;

            const productsRes = await fetch('/api/products');
            if (!productsRes.ok) throw new Error(`Failed to fetch products: ${productsRes.status}`);
            const products = await productsRes.json();
            document.getElementById('total-products').textContent = products.length;

            const ticketsRes = await fetch('/api/tickets/all');
            if (!ticketsRes.ok) throw new Error(`Failed to fetch tickets: ${ticketsRes.status}`);
            const tickets = await ticketsRes.json();
            const openTickets = tickets.filter(t => t.status === 'Open').length;
            document.getElementById('open-tickets').textContent = openTickets;

            const ordersRes = await fetch('/api/orders');
            if (!ordersRes.ok) throw new Error(`Failed to fetch orders: ${ordersRes.status}`);
            const orders = await ordersRes.json();
            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.amount || order.total || 0), 0);
            document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;

        } catch (error) {
            console.error('Error fetching overview:', error);
            document.getElementById('open-tickets').textContent = '0';
            document.getElementById('total-revenue').textContent = '$0.00';
        }
    }

    // =======================
    // Fetch Users
    // =======================
    async function fetchUsers() {
        try {
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
        } catch (error) {
            console.error('Error fetching users:', error);
            const tbody = document.getElementById('users-table-body');
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:red;">Failed to load users</td></tr>';
        }
    }

    // =======================
    // Fetch Products
    // =======================
    async function fetchProducts() {
        try {
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
        } catch (error) {
            console.error('Error fetching products:', error);
            const tbody = document.getElementById('products-table-body');
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:red;">Failed to load products</td></tr>';
        }
    }

    // =======================
    // Fetch Tickets
    // =======================
    async function fetchTickets() {
        try {
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
        } catch (error) {
            console.error('Error fetching tickets:', error);
            const tbody = document.getElementById('tickets-table-body');
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:red;">Failed to load tickets</td></tr>';
        }
    }

    // =======================
    // Fetch Orders
    // =======================
    async function fetchOrders() {
        try {
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
        } catch (error) {
            console.error('Error fetching orders:', error);
            const tbody = document.getElementById('orders-table-body');
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:red;">Failed to load orders</td></tr>';
        }
    }

    // =======================
    // Initialize Dashboard
    // =======================
    async function initializeDashboard() {
        try {
            await Promise.all([
                fetchOverview(),
                fetchUsers(),
                fetchProducts(), 
                fetchTickets(),
                fetchOrders()
            ]);
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    }

    initializeDashboard();
    setInterval(fetchOverview, 30000); // Auto-refresh overview every 30 seconds
});
