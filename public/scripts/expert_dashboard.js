
document.addEventListener('DOMContentLoaded', () => {

    // Map section IDs to variables for easy access
    const sections = {
        dashboard: document.getElementById('dashboardSection'),
        tickets: document.getElementById('ticketsSection'),
        ticketDetails: document.getElementById('ticketDetailsSection')
    };

    // Map navigation link IDs for updating active state
    const navLinks = {
        dashboard: document.getElementById('dashboardLink'),
        tickets: document.getElementById('ticketsLink')
    };

    // Function to show a specific section and hide the others
    function showSection(sectionName) {
        // Remove 'active' class from all sections
        Object.values(sections).forEach(section => section.classList.remove('active'));
        // Add 'active' class to the selected section
        sections[sectionName].classList.add('active');

        // Update active state of navigation links
        Object.values(navLinks).forEach(link => link.classList.remove('active'));
        if (navLinks[sectionName]) navLinks[sectionName].classList.add('active');
    }

    // Fetch all tickets from the server
    async function fetchTickets() {
        try {
            const response = await fetch('/api/tickets');
            const tickets = await response.json();
            updateDashboard(tickets);     // Update dashboard metrics
            updateTicketList(tickets);    // Update ticket table
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    }

    // Fetch details of a single ticket by its ID
    async function fetchTicketDetails(ticketId) {
        try {
            const response = await fetch('/api/tickets');
            const tickets = await response.json();
            const ticket = tickets.find(t => t._id === ticketId);
            if (ticket) {
                // Populate ticket details section
                document.getElementById('ticketId').textContent = ticket._id;
                document.getElementById('ticketRequester').textContent = ticket.requester;
                document.getElementById('ticketSubject').textContent = ticket.subject;
                document.getElementById('ticketType').textContent = ticket.type;
                document.getElementById('ticketDescription').textContent = ticket.description;
                document.getElementById('ticketStatus').textContent = ticket.status;
                document.getElementById('ticketCreatedAt').textContent = new Date(ticket.created_at).toLocaleString();
                
                // Handle ticket attachment image display
                const attachmentImage = document.getElementById('attachmentImage');
                if (ticket.attachment) {
                    attachmentImage.src = ticket.attachment;
                    attachmentImage.style.display = 'block';
                } else {
                    attachmentImage.style.display = 'none';
                }

                // Handle resolution form or display resolved message
                const resolutionFormContainer = document.getElementById('resolutionFormContainer');
                if (ticket.status === 'Resolved') {
                    resolutionFormContainer.innerHTML = `<p><strong>Resolution:</strong> ${ticket.resolution}</p>`;
                } else {
                    resolutionFormContainer.innerHTML = `
                        <h2>Provide Resolution</h2>
                        <form id="resolutionForm">
                            <div class="form-group">
                                <label for="resolution">Resolution *</label>
                                <textarea id="resolution" required></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="cancel-btn" id="cancelResolution">Cancel</button>
                                <button type="submit" class="submit-btn">Send</button>
                            </div>
                        </form>
                    `;
                    attachResolutionFormListener(ticketId); // Attach form submission listener
                }

                // Show the ticket details section
                showSection('ticketDetails');
            }
        } catch (error) {
            console.error('Error fetching ticket details:', error);
            alert('Error fetching ticket details');
        }
    }

    // Update dashboard metrics and recent tickets table
    function updateDashboard(tickets) {
        // Count of active/open tickets
        const activeTickets = tickets.filter(t => t.status === 'Open').length;
        document.getElementById('activeTickets').textContent = activeTickets;

        // Count of tickets resolved today
        const today = new Date().toISOString().split('T')[0];
        const resolvedToday = tickets.filter(t => t.status === 'Resolved' && new Date(t.created_at).toISOString().split('T')[0] === today).length;
        document.getElementById('resolvedToday').textContent = resolvedToday;

        // Populate recent tickets table (showing 5 most recent)
        const recentTicketsBody = document.getElementById('recentTicketsBody');
        recentTicketsBody.innerHTML = tickets.slice(0, 5).map(ticket => `
            <tr>
                <td>${ticket._id}</td>
                <td>${ticket.requester}</td>
                <td>${ticket.subject}</td>
                <td>${ticket.status}</td>
                <td><a href="#" data-ticket="${ticket._id}">View</a></td>
            </tr>
        `).join('');
    }

    // Populate the main ticket list table
    function updateTicketList(tickets) {
        const tbody = document.getElementById('ticketTableBody');
        tbody.innerHTML = tickets.map(ticket => `
            <tr>
                <td>${ticket._id}</td>
                <td>${ticket.requester}</td>
                <td>${ticket.subject}</td>
                <td>${ticket.type}</td>
                <td>${ticket.status}</td>
                <td><a href="#" data-ticket="${ticket._id}">View</a></td>
            </tr>
        `).join('');
    }

    // Attach event listener to resolution form and cancel button
    function attachResolutionFormListener(ticketId) {
        const resolutionForm = document.getElementById('resolutionForm');
        if (resolutionForm) {
            resolutionForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const resolution = document.getElementById('resolution').value;

                try {
                    const response = await fetch(`/api/tickets/${ticketId}/resolve`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ resolution })
                    });
                    const result = await response.json();
                    if (response.ok) {
                        alert(result.message);
                        fetchTicketDetails(ticketId); // Refresh ticket details after submission
                    } else {
                        alert(result.message || 'Error submitting resolution');
                    }
                } catch (error) {
                    console.error('Error submitting resolution:', error);
                    alert('Server error');
                }
            });
        }

        // Attach event listener for cancel button to go back to ticket list
        const cancelButton = document.getElementById('cancelResolution');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                showSection('tickets');
            });
        }
    }

    // Attach click events to navigation links to switch sections
    Object.keys(navLinks).forEach(key => {
        navLinks[key].addEventListener('click', (e) => {
            e.preventDefault();
            showSection(key);
            if (key === 'tickets' || key === 'dashboard') fetchTickets();
        });
    });

    // Attach click events for "View" links in ticket tables
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-ticket]')) {
            e.preventDefault();
            const ticketId = e.target.dataset.ticket;
            fetchTicketDetails(ticketId);
        }
    });

    // Show dashboard on initial load
    showSection('dashboard');
    fetchTickets(); // Fetch tickets on initial load
});
