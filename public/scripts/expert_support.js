// Wait until the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const sections = {
        home: document.getElementById('homeSection'),
        knowledgeBase: document.getElementById('knowledgeBaseSection'),
        ticket: document.getElementById('ticketSection'),
        article: document.getElementById('articleSection'),
        articleList: document.getElementById('articleListSection'),
        messages: document.getElementById('messagesSection')
    };

    const navLinks = {
        home: document.getElementById('homeLink'),
        support: document.getElementById('supportLink'),
        knowledgeBase: document.getElementById('knowledgeBaseLink'),
        ticket: document.getElementById('submitTicketLink'),
        messages: document.getElementById('messagesLink')
    };

    const articles = {
        'buy-now-pay-later': {
            title: 'What is "Buy Now Pay Later" Payment Mode',
            modifiedDate: 'Fri, 2 Jun, 2023 at 9:50 AM',
            content: `
                <div class="article-content">
                    <p>1. Pay Later is one of the payment modes of the Simpl payment gateway, in which you can checkout with 1 tap and pays later.</p>
                    <p>2. All your purchases (done by Simpl-Pay Later on any website) get added to one convenient bill, which you can pay in one go, after every 15 days.</p>
                    <p>3. Also, you can choose to pay for your transactions even before your bill is generated, with the help of UPI, Credit, or Debit Cards.</p>
                    <p>You can do so by logging into your account via Simpl App or Website (<a href="https://getsimpl.com/signin" target="_blank">https://getsimpl.com/signin</a>).</p>
                    <p>*By using the Simpl payment gateway (any mode), you will get 30% or Rs. 70 OFF (whichever is the minimum) on your order.</p>
                </div>
            `
        },
        'cancel-refund': {
            title: 'Cancel/Replace/Refund/Return',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:31 PM',
            content: `
                <div class="article-content">
                    <p>Once the order has been confirmed, it cannot be canceled, refunded, replaced, or returned.</p>
                    <p>*We do not have a refund policy if you refuse the delivery.</p>
                    <p>Please refer to the <a href="#" class="policy-link">Refund Policy</a> for more details.</p>
                </div>
            `
        },
        'order-status': {
            title: 'Order Status',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:13 PM',
            content: `
                <div class="article-content">
                    <p>You can check the status of your order by logging into your account and visiting the 'My Orders' section.</p>
                    <p>Order statuses include: Pending, Processing, Shipped, and Delivered.</p>
                    <div class="status-info">
                        <h3>Order Status Guide:</h3>
                        <ul>
                            <li><strong>Pending:</strong> Order received, awaiting processing</li>
                            <li><strong>Processing:</strong> Order is being prepared for shipment</li>
                            <li><strong>Shipped:</strong> Order has been dispatched</li>
                            <li><strong>Delivered:</strong> Order has been successfully delivered</li>
                        </ul>
                    </div>
                </div>
            `
        },
        'damage-product': {
            title: 'Damage/Wrong Product Received',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:33 PM',
            content: `
                <div class="article-content">
                    <p>If you received a damaged or wrong product, please submit a ticket with details and photos of the issue.</p>
                    <p>Our support team will review and provide a resolution within 48 hours.</p>
                    <div class="action-steps">
                        <h3>What to do:</h3>
                        <ol>
                            <li>Take clear photos of the damaged product or wrong item received</li>
                            <li>Submit a support ticket with detailed description</li>
                            <li>Include photos as attachments</li>
                            <li>Our team will contact you within 24-48 hours</li>
                        </ol>
                    </div>
                </div>
            `
        },
        'cashback': {
            title: 'Cashback Voucher/Cashback Coupon',
            modifiedDate: 'Fri, 10 Jun, 2022 at 4:38 PM',
            content: `
                <div class="article-content">
                    <p>Cashback vouchers can be applied at checkout for eligible orders.</p>
                    <p>Check the terms and conditions of each voucher for validity and usage details.</p>
                    <div class="voucher-info">
                        <h3>How to use vouchers:</h3>
                        <ul>
                            <li>Apply voucher code during checkout process</li>
                            <li>Check minimum order value requirements</li>
                            <li>Verify validity period before use</li>
                            <li>Only one voucher can be used per order</li>
                        </ul>
                    </div>
                </div>
            `
        },
        'what-is-simpl': {
            title: 'What is Simpl',
            modifiedDate: 'Fri, 2 Jun, 2023 at 9:45 AM',
            content: `
                <div class="article-content">
                    <p>Simpl is a payment gateway that allows you to pay for your purchases later.</p>
                    <p>It offers a seamless checkout experience with flexible payment options.</p>
                    <div class="simpl-benefits">
                        <h3>Benefits of using Simpl:</h3>
                        <ul>
                            <li>One-tap checkout experience</li>
                            <li>Pay later convenience</li>
                            <li>Single bill for all purchases</li>
                            <li>Secure payment processing</li>
                        </ul>
                    </div>
                </div>
            `
        },
        'pay-later-cod': {
            title: 'Is Pay Later and COD the same?',
            modifiedDate: 'Fri, 2 Jun, 2023 at 9:55 AM',
            content: `
                <div class="article-content">
                    <p>No, Pay Later and Cash on Delivery (COD) are not the same.</p>
                    <p>Pay Later allows you to settle your bill after 15 days via Simpl, while COD requires payment at the time of delivery.</p>
                    <div class="comparison-table">
                        <h3>Key Differences:</h3>
                        <table>
                            <tr>
                                <th>Feature</th>
                                <th>Pay Later</th>
                                <th>COD</th>
                            </tr>
                            <tr>
                                <td>Payment Time</td>
                                <td>After 15 days</td>
                                <td>At delivery</td>
                            </tr>
                            <tr>
                                <td>Payment Method</td>
                                <td>Simpl account</td>
                                <td>Cash/Card at door</td>
                            </tr>
                            <tr>
                                <td>Credit Check</td>
                                <td>Required</td>
                                <td>Not required</td>
                            </tr>
                        </table>
                    </div>
                </div>
            `
        }
    };

    const articleLists = {
        'quick-help': [
            { id: 'order-status', title: 'Order Status' },
            { id: 'cancel-refund', title: 'Cancel/Replace/Refund/Return' },
            { id: 'damage-product', title: 'Damage/Wrong Product Received' },
            { id: 'cashback', title: 'Cashback Voucher/Cashback Coupon' }
        ],
        'payment-gateway': [
            { id: 'what-is-simpl', title: 'What is Simpl' },
            { id: 'buy-now-pay-later', title: 'What is "Buy Now Pay Later" Payment Mode' },
            { id: 'pay-later-cod', title: 'Is Pay Later and COD the same?' }
        ]
    };

    // Initialize the application
    function initializeApp() {
        console.log('Initializing Expert Support System...');
        
        // Validate all required sections exist
        Object.keys(sections).forEach(sectionKey => {
            if (!sections[sectionKey]) {
                console.error(`Missing section: ${sectionKey}`);
            }
        });

        setupEventListeners();
        showSection('home');
        console.log('Expert Support System initialized successfully');
    }

    function setupEventListeners() {
        // Navigation event listeners
        Object.keys(navLinks).forEach(key => {
            if (navLinks[key]) {
                navLinks[key].addEventListener('click', e => {
                    if (key === 'home' || key === 'support') return;
                    e.preventDefault();
                    showSection(key);
                    if (key === 'messages') {
                        fetchUserTickets();
                    }
                });
            }
        });

        // Card click handlers
        const browseArticlesCard = document.getElementById('browseArticlesCard');
        const submitTicketCard = document.getElementById('submitTicketCard');
        
        if (browseArticlesCard) {
            browseArticlesCard.addEventListener('click', () => showSection('knowledgeBase'));
        }
        
        if (submitTicketCard) {
            submitTicketCard.addEventListener('click', () => showSection('ticket'));
        }

        // Dynamic content handlers
        document.addEventListener('click', e => {
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

        // Feedback buttons
        document.querySelectorAll('.feedback-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const feedbackValue = e.target.dataset.value;
                recordFeedback(feedbackValue);
            });
        });

        // Ticket form handling
        const ticketForm = document.getElementById('ticketForm');
        if (ticketForm) {
            setupTicketForm(ticketForm);
        }
    }

    function showSection(sectionName) {
        console.log(`Showing section: ${sectionName}`);
        
        // Hide all sections
        Object.values(sections).forEach(section => {
            if (section) {
                section.classList.remove('active');
            }
        });

        // Show target section
        if (sections[sectionName]) {
            sections[sectionName].classList.add('active');
        } else {
            console.error(`Section not found: ${sectionName}`);
            showSection('home'); // Fallback to home
            return;
        }

        // Update navigation
        Object.values(navLinks).forEach(link => {
            if (link) {
                link.classList.remove('active');
            }
        });

        if (navLinks[sectionName]) {
            navLinks[sectionName].classList.add('active');
        }

        // Section-specific initialization
        switch(sectionName) {
            case 'messages':
                fetchUserTickets();
                break;
            case 'knowledgeBase':
                initializeKnowledgeBase();
                break;
        }
    }

    function initializeKnowledgeBase() {
        console.log('Initializing knowledge base...');
        // Any knowledge base specific initialization can go here
    }

    function showArticle(articleId) {
        console.log(`Showing article: ${articleId}`);
        
        const article = articles[articleId];
        if (!article) {
            console.error(`Article not found: ${articleId}`);
            alert('Article not found');
            return;
        }

        const breadcrumb = sections.article?.querySelector('.breadcrumb');
        const content = sections.article?.querySelector('.article-content');

        if (!breadcrumb || !content) {
            console.error('Article section elements not found');
            return;
        }

        breadcrumb.innerHTML = `
            <a href="#" data-section="home">Home</a> > 
            <a href="#" data-section="knowledgeBase">Knowledge Base</a> > ${article.title}
        `;
        
        content.innerHTML = `
            <h1>${article.title}</h1>
            <p class="modified-date">Modified on ${article.modifiedDate}</p>
            ${article.content}
            <div class="article-actions">
                <button class="feedback-btn" data-value="helpful">Helpful</button>
                <button class="feedback-btn" data-value="not-helpful">Not Helpful</button>
                <button class="back-btn" onclick="showSection('knowledgeBase')">Back to Knowledge Base</button>
            </div>
        `;
        
        showSection('article');
    }

    function showArticleList(listId) {
        console.log(`Showing article list: ${listId}`);
        
        const list = articleLists[listId];
        if (!list) {
            console.error(`Article list not found: ${listId}`);
            alert('Category not found');
            return;
        }

        const breadcrumb = sections.articleList?.querySelector('.breadcrumb');
        const content = sections.articleList?.querySelector('.article-list');

        if (!breadcrumb || !content) {
            console.error('Article list section elements not found');
            return;
        }

        const categoryName = listId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        breadcrumb.innerHTML = `
            <a href="#" data-section="home">Home</a> > 
            <a href="#" data-section="knowledgeBase">Knowledge Base</a> > ${categoryName}
        `;
        
        content.innerHTML = `
            <h1>${categoryName}</h1>
            <div class="article-list-container">
                <ul class="article-items">
                    ${list.map(item => `
                        <li class="article-item">
                            <a href="#" data-article="${item.id}" class="article-link">
                                <i class="fas fa-file-alt"></i>
                                ${item.title}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="back-container">
                <button class="back-btn" onclick="showSection('knowledgeBase')">
                    <i class="fas fa-arrow-left"></i> Back to Knowledge Base
                </button>
            </div>
        `;
        
        showSection('articleList');
    }

    // FIXED: Fetch user tickets with enhanced error handling
    async function fetchUserTickets() {
        console.log('Fetching user tickets...');
        
        const tbody = document.getElementById('userTicketsTableBody');
        if (!tbody) {
            console.error('Tickets table body not found');
            return;
        }

        // Show loading state
        tbody.innerHTML = '<tr><td colspan="7" class="loading-message">Loading tickets...</td></tr>';

        try {
            const response = await fetch('/api/user-tickets');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const tickets = await response.json();
            console.log(`Loaded ${tickets.length} tickets`);

            if (tickets.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="no-data-message">No tickets found</td></tr>';
                return;
            }

            tbody.innerHTML = tickets.map(ticket => `
                <tr class="ticket-row ${ticket.status.toLowerCase()}">
                    <td class="ticket-id">${ticket._id || 'N/A'}</td>
                    <td class="ticket-subject">${ticket.subject || 'No subject'}</td>
                    <td class="ticket-type">${ticket.type || 'General'}</td>
                    <td class="ticket-status">
                        <span class="status-badge status-${ticket.status.toLowerCase()}">
                            ${ticket.status || 'Unknown'}
                        </span>
                    </td>
                    <td class="ticket-expert">${ticket.expert_id ? ticket.expert_id.username : 'Unassigned'}</td>
                    <td class="ticket-resolution">${ticket.resolution || 'Pending'}</td>
                    <td class="ticket-actions">
                        <a href="#" data-ticket="${ticket._id}" class="view-ticket-btn">
                            <i class="fas fa-eye"></i> View
                        </a>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Error fetching user tickets:', error);
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        Failed to load tickets. Please try again later.
                    </td>
                </tr>
            `;
        }
    }

    // FIXED: Show ticket details with comprehensive error handling
    async function showTicketDetails(ticketId) {
        console.log(`Fetching ticket details for: ${ticketId}`);
        
        // Enhanced validation
        if (!ticketId || ticketId === 'all' || ticketId === 'undefined') {
            console.error('Invalid ticket ID:', ticketId);
            showError('Invalid ticket ID provided');
            return;
        }
        
        // MongoDB ObjectId validation (24 hex characters)
        if (!/^[0-9a-fA-F]{24}$/.test(ticketId)) {
            console.error('Invalid ticket ID format:', ticketId);
            showError('Invalid ticket ID format');
            return;
        }

        try {
            // Show loading state
            if (sections.ticket) {
                sections.ticket.innerHTML = `
                    <div class="loading-container">
                        <h1>Loading Ticket Details</h1>
                        <div class="loading-spinner"></div>
                        <p>Please wait while we fetch the ticket information...</p>
                    </div>
                `;
            }

            const response = await fetch(`/api/tickets/${ticketId}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const ticket = await response.json();
            
            if (!ticket) {
                throw new Error('Ticket not found');
            }

            renderTicketDetails(ticket);

        } catch (error) {
            console.error('Error fetching ticket details:', error);
            showError(`Failed to load ticket details: ${error.message}`);
        }
    }

    function renderTicketDetails(ticket) {
        if (!sections.ticket) {
            console.error('Ticket section not found');
            return;
        }

        const attachmentHtml = ticket.attachment ? `
            <div class="attachment-section">
                <h3>Attachment:</h3>
                <div class="attachment-container">
                    <img src="${ticket.attachment}" 
                         alt="Ticket Attachment" 
                         class="attachment-image"
                         onerror="this.style.display='none'">
                    <a href="${ticket.attachment}" 
                       download="ticket-attachment-${ticket._id}" 
                       class="download-btn">
                       <i class="fas fa-download"></i> Download Attachment
                    </a>
                </div>
            </div>
        ` : '<p class="no-attachment">No attachments</p>';

        const resolvedAtHtml = ticket.resolved_at ? `
            <p><strong>Resolved at:</strong> ${new Date(ticket.resolved_at).toLocaleString()}</p>
        ` : '';

        sections.ticket.innerHTML = `
            <div class="ticket-details-container">
                <h1>Ticket Details</h1>
                <div class="ticket-details-card">
                    <div class="detail-group">
                        <label>Ticket ID:</label>
                        <span class="ticket-id">${ticket._id}</span>
                    </div>
                    <div class="detail-group">
                        <label>Subject:</label>
                        <span class="ticket-subject">${ticket.subject || 'No subject'}</span>
                    </div>
                    <div class="detail-group">
                        <label>Type:</label>
                        <span class="ticket-type">${ticket.type || 'General'}</span>
                    </div>
                    <div class="detail-group">
                        <label>Status:</label>
                        <span class="status-badge status-${ticket.status?.toLowerCase() || 'unknown'}">
                            ${ticket.status || 'Unknown'}
                        </span>
                    </div>
                    <div class="detail-group">
                        <label>Requester:</label>
                        <span class="ticket-requester">${ticket.requester || 'Unknown'}</span>
                    </div>
                    <div class="detail-group full-width">
                        <label>Description:</label>
                        <div class="ticket-description">${ticket.description || 'No description provided'}</div>
                    </div>
                    <div class="detail-group">
                        <label>Assigned Expert:</label>
                        <span class="ticket-expert">${ticket.expert_id ? ticket.expert_id.username : 'Unassigned'}</span>
                    </div>
                    <div class="detail-group full-width">
                        <label>Resolution:</label>
                        <div class="ticket-resolution">${ticket.resolution || 'No resolution provided yet'}</div>
                    </div>
                    ${resolvedAtHtml}
                    ${attachmentHtml}
                    <div class="ticket-actions">
                        <button class="back-btn" id="backToMessages">
                            <i class="fas fa-arrow-left"></i> Back to Tickets
                        </button>
                        <button class="print-btn" onclick="window.print()">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add back button event listener
        const backButton = document.getElementById('backToMessages');
        if (backButton) {
            backButton.addEventListener('click', () => {
                showSection('messages');
                fetchUserTickets();
            });
        }

        showSection('ticket');
    }

    function setupTicketForm(ticketForm) {
        ticketForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitTicketForm(ticketForm);
        });

        const cancelButton = ticketForm.querySelector('.cancel-btn');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                ticketForm.reset();
                showSection('home');
            });
        }
    }

    async function submitTicketForm(ticketForm) {
        const submitButton = ticketForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitButton.disabled = true;

        try {
            const formData = new FormData();
            formData.append('requester', document.getElementById('requester')?.value || '');
            formData.append('subject', document.getElementById('subject')?.value || '');
            formData.append('type', document.getElementById('type')?.value || 'general');
            formData.append('description', document.getElementById('description')?.value || '');

            const attachment = document.getElementById('attachment')?.files[0];
            if (attachment) {
                // Validate file size (5MB limit)
                if (attachment.size > 5 * 1024 * 1024) {
                    throw new Error('File size must be less than 5MB');
                }
                formData.append('attachment', attachment);
            }

            // Validate required fields
            if (!formData.get('subject') || !formData.get('description')) {
                throw new Error('Subject and description are required');
            }

            const response = await fetch('/submit-ticket', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                showSuccess(result.message || 'Ticket submitted successfully!');
                ticketForm.reset();
                showSection('home');
            } else {
                throw new Error(result.message || 'Error submitting ticket');
            }

        } catch (error) {
            console.error('Error submitting ticket:', error);
            showError(error.message || 'Failed to submit ticket. Please try again.');
        } finally {
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    function recordFeedback(feedbackValue) {
        console.log(`Recording feedback: ${feedbackValue}`);
        // Here you would typically send this to your analytics or backend
        showSuccess(`Thank you for your feedback! (${feedbackValue})`);
        
        // Optional: Send to backend
        // fetch('/api/feedback', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ feedback: feedbackValue })
        // });
    }

    function showSuccess(message) {
        alert(`✅ ${message}`);
    }

    function showError(message) {
        alert(`❌ ${message}`);
    }

    // Make functions globally available for HTML onclick handlers
    window.showSection = showSection;
    window.showArticle = showArticle;
    window.showTicketDetails = showTicketDetails;

    // Initialize the application
    initializeApp();
});