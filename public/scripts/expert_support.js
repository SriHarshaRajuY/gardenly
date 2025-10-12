// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // Map all the main sections for easy access
    const sections = {
        home: document.getElementById('homeSection'),
        knowledgeBase: document.getElementById('knowledgeBaseSection'),
        ticket: document.getElementById('ticketSection'),
        article: document.getElementById('articleSection'),
        articleList: document.getElementById('articleListSection'),
        messages: document.getElementById('messagesSection')
    };

    // Map navigation links for updating active state
    const navLinks = {
        home: document.getElementById('homeLink'),
        support: document.getElementById('supportLink'),
        knowledgeBase: document.getElementById('knowledgeBaseLink'),
        ticket: document.getElementById('submitTicketLink'),
        messages: document.getElementById('messagesLink')
    };

    // Articles content mapped by article IDs
    const articles = {
        'buy-now-pay-later': { /* Article content for Buy Now Pay Later */ },
        'cancel-refund': { /* Article content for Cancel/Refund */ },
        'order-status': { /* Article content for Order Status */ },
        'damage-product': { /* Article content for Damage/Wrong Product */ },
        'cashback': { /* Article content for Cashback */ },
        'what-is-simpl': { /* Article content for Simpl Payment Gateway */ },
        'pay-later-cod': { /* Article content for Pay Later vs COD */ }
    };

    // Article lists for categories
    const articleLists = {
        'quick-help': [/* List of quick help articles */],
        'payment-gateway': [/* List of payment gateway articles */]
    };

    // Function to show a section and hide all others
    function showSection(sectionName) {
        Object.values(sections).forEach(section => section.classList.remove('active'));
        sections[sectionName].classList.add('active');

        Object.values(navLinks).forEach(link => link.classList.remove('active'));
        if (navLinks[sectionName]) navLinks[sectionName].classList.add('active');
    }

    // Show specific article details
    function showArticle(articleId) {
        const article = articles[articleId];
        if (!article) return;

        const breadcrumb = sections.article.querySelector('.breadcrumb');
        const content = sections.article.querySelector('.article-content');

        // Update breadcrumb navigation
        breadcrumb.innerHTML = `
            <a href="#" data-section="home">Home</a> > 
            <a href="#" data-section="knowledgeBase">Knowledge Base</a> > ${article.title}
        `;

        // Display article content
        content.innerHTML = `
            <h1>${article.title}</h1>
            <p class="modified-date">Modified on ${article.modifiedDate}</p>
            ${article.content}
        `;

        showSection('article'); // Show the article section
    }

    // Show list of articles in a category
    function showArticleList(listId) {
        const list = articleLists[listId];
        if (!list) return;

        const breadcrumb = sections.articleList.querySelector('.breadcrumb');
        const content = sections.articleList.querySelector('.article-list');

        // Update breadcrumb
        breadcrumb.innerHTML = `
            <a href="#" data-section="home">Home</a> > 
            <a href="#" data-section="knowledgeBase">Knowledge Base</a> > ${listId.replace('-', ' ')}
        `;

        // Render article list
        content.innerHTML = `
            <h1>${listId.replace('-', ' ')}</h1>
            <ul>
                ${list.map(item => `<li><a href="#" data-article="${item.id}">${item.title}</a></li>`).join('')}
            </ul>
        `;

        showSection('articleList');
    }

    // Fetch tickets submitted by the current user
    async function fetchUserTickets() {
        try {
            const response = await fetch('/api/user-tickets');
            if (!response.ok) throw new Error('Failed to fetch tickets');
            const tickets = await response.json();

            const tbody = document.getElementById('userTicketsTableBody');

            // Populate tickets table
            tbody.innerHTML = tickets.map(ticket => `
                <tr>
                    <td>${ticket._id}</td>
                    <td>${ticket.subject}</td>
                    <td>${ticket.type}</td>
                    <td>${ticket.status}</td>
                    <td>${ticket.expert_id ? ticket.expert_id.username : 'Unassigned'}</td>
                    <td>${ticket.resolution || 'Pending'}</td>
                    <td><a href="#" data-ticket="${ticket._id}">View</a></td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error fetching user tickets:', error);
            alert('Error fetching your tickets');
        }
    }

    // Show details of a specific ticket
    function showTicketDetails(ticketId) {
        fetch('/api/user-tickets')
            .then(response => response.json())
            .then(tickets => {
                const ticket = tickets.find(t => t._id === ticketId);
                if (ticket) {
                    sections.ticket.innerHTML = `
                        <h1>Ticket Details</h1>
                        <div class="ticket-details">
                            <p><strong>ID:</strong> ${ticket._id}</p>
                            <p><strong>Subject:</strong> ${ticket.subject}</p>
                            <p><strong>Type:</strong> ${ticket.type}</p>
                            <p><strong>Description:</strong> ${ticket.description}</p>
                            <p><strong>Status:</strong> ${ticket.status}</p>
                            <p><strong>Expert:</strong> ${ticket.expert_id ? ticket.expert_id.username : 'Unassigned'}</p>
                            <p><strong>Resolution:</strong> ${ticket.resolution || 'Pending'}</p>
                            ${ticket.attachment ? `<p><strong>Attachment:</strong><br><img src="${ticket.attachment}" alt="Attachment" style="max-width: 100%;"></p>` : ''}
                            <button class="cancel-btn" id="backToMessages">Back to Messages</button>
                        </div>
                    `;

                    // Attach event listener for "Back to Messages" button
                    document.getElementById('backToMessages').addEventListener('click', () => {
                        showSection('messages');
                        fetchUserTickets(); // Refresh messages list
                    });

                    showSection('ticket');
                }
            })
            .catch(error => {
                console.error('Error fetching ticket details:', error);
                alert('Error fetching ticket details');
            });
    }

    // Navigation link click handling
    Object.keys(navLinks).forEach(key => {
        navLinks[key].addEventListener('click', (e) => {
            // Allow default browser navigation for home and support
            if (key === 'home' || key === 'support') return;

            e.preventDefault();
            showSection(key);

            if (key === 'messages') fetchUserTickets();
        });
    });

    // Cards on home page for navigation
    document.getElementById('browseArticlesCard').addEventListener('click', () => showSection('knowledgeBase'));
    document.getElementById('submitTicketCard').addEventListener('click', () => showSection('ticket'));

    // Handle clicks on dynamic elements
    document.addEventListener('click', (e) => {
        if (e.target.matches('[data-article]')) {
            e.preventDefault();
            showArticle(e.target.dataset.article);
        } else if (e.target.matches('[data-list]')) {
            e.preventDefault();
            showArticleList(e.target.dataset.list);
        } else if (e.target.matches('[data-section]')) {
            e.preventDefault();
            showSection(e.target.dataset.section);
        } else if (e.target.matches('[data-ticket]')) {
            e.preventDefault();
            showTicketDetails(e.target.dataset.ticket);
        }
    });

    // Handle feedback buttons
    document.querySelectorAll('.feedback-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            alert(`Feedback recorded: ${e.target.dataset.value}`);
        });
    });

    // Ticket submission form handling
    const ticketForm = document.getElementById('ticketForm');
    ticketForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('requester', document.getElementById('requester').value);
        formData.append('subject', document.getElementById('subject').value);
        formData.append('type', document.getElementById('type').value);
        formData.append('description', document.getElementById('description').value);

        const attachment = document.getElementById('attachment').files[0];
        if (attachment) formData.append('attachment', attachment);

        try {
            const response = await fetch('/submit-ticket', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                ticketForm.reset();
                showSection('home');
            } else {
                alert(result.message || 'Error submitting ticket');
            }
        } catch (error) {
            console.error('Error submitting ticket:', error);
            alert('Server error');
        }
    });

    // Cancel button resets form and returns to home
    ticketForm.querySelector('.cancel-btn').addEventListener('click', () => {
        ticketForm.reset();
        showSection('home');
    });

    // Show home section on initial load
    showSection('home');
});
