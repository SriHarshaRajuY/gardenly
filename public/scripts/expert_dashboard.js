document.addEventListener('DOMContentLoaded', () => {
    // Sections for showing/hiding content
    const sections = {
        dashboard: document.getElementById('dashboardSection'),
        tickets: document.getElementById('ticketsSection'),
        ticketDetails: document.getElementById('ticketDetailsSection')
    };

    // Navigation links
    const navLinks = {
        dashboard: document.getElementById('dashboardLink'),
        tickets: document.getElementById('ticketsLink')
    };

    // Function to show a specific section and highlight nav link
    function showSection(sectionName) {
        Object.values(sections).forEach(section => section.classList.remove('active'));
        sections[sectionName].classList.add('active');

        Object.values(navLinks).forEach(link => link.classList.remove('active'));
        if (navLinks[sectionName]) navLinks[sectionName].classList.add('active');
    }

    // Fetch all tickets for dashboard and ticket list
    async function fetchTickets() {
        try {
            // FETCH: Get all tickets from server
            const response = await fetch('/api/tickets');
            const tickets = await response.json();
            updateDashboard(tickets);
            updateTicketList(tickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    }

    // Fetch details of a specific ticket
    async function fetchTicketDetails(ticketId) {
        try {
            // FETCH: Get all tickets (then find specific ticket by ID)
            const response = await fetch('/api/tickets');
            const tickets = await response.json();
            const ticket = tickets.find(t => t._id === ticketId);

            if (ticket) {
                document.getElementById('ticketId').textContent = ticket._id;
                document.getElementById('ticketRequester').textContent = ticket.requester;
                document.getElementById('ticketSubject').textContent = ticket.subject;
                document.getElementById('ticketType').textContent = ticket.type;
                document.getElementById('ticketDescription').textContent = ticket.description;
                document.getElementById('ticketStatus').textContent = ticket.status;
                document.getElementById('ticketCreatedAt').textContent = new Date(ticket.created_at).toLocaleString();
                
                const attachmentImage = document.getElementById('attachmentImage');
                if (ticket.attachment) {
                    attachmentImage.src = ticket.attachment;
                    attachmentImage.style.display = 'block';
                } else {
                    attachmentImage.style.display = 'none';
                }

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
                    attachResolutionFormListener(ticketId);
                }

                showSection('ticketDetails');
            }
        } catch (error) {
            console.error('Error fetching ticket details:', error);
            alert('Error fetching ticket details');
        }
    }

    // Update the dashboard metrics
    function updateDashboard(tickets) {
        const activeTickets = tickets.filter(t => t.status === 'Open').length;
        document.getElementById('activeTickets').textContent = activeTickets;

        const today = new Date().toISOString().split('T')[0];
        const resolvedToday = tickets.filter(t => t.status === 'Resolved' && new Date(t.created_at).toISOString().split('T')[0] === today).length;
        document.getElementById('resolvedToday').textContent = resolvedToday;

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

    // Update ticket list table
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

    // Attach listener for resolution form submission
    function attachResolutionFormListener(ticketId) {
        const resolutionForm = document.getElementById('resolutionForm');
        if (resolutionForm) {
            resolutionForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const resolution = document.getElementById('resolution').value;

                try {
                    // FETCH: Send resolution update to server
                    const response = await fetch(`/api/tickets/${ticketId}/resolve`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ resolution })
                    });
                    const result = await response.json();
                    if (response.ok) {
                        alert(result.message);
                        fetchTicketDetails(ticketId); // Refresh ticket details
                    } else {
                        alert(result.message || 'Error submitting resolution');
                    }
                } catch (error) {
                    console.error('Error submitting resolution:', error);
                    alert('Server error');
                }
            });
        }

        const cancelButton = document.getElementById('cancelResolution');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                showSection('tickets');
            });
        }
    }

    // Nav link click handling
    Object.keys(navLinks).forEach(key => {
        navLinks[key].addEventListener('click', (e) => {
            e.preventDefault();
            showSection(key);
            if (key === 'tickets' || key === 'dashboard') fetchTickets();
        });
    });

    // Click handling for ticket "View" links
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-ticket]')) {
            e.preventDefault();
            const ticketId = e.target.dataset.ticket;
            fetchTicketDetails(ticketId);
        }
    });

    // Show dashboard by default and fetch tickets
    showSection('dashboard');
    fetchTickets(); // Initial FETCH to populate dashboard and ticket list
});
