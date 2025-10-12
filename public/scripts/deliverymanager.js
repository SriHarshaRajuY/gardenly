// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function () {

    
    let deliveries = [
        { id: 1, orderId: 'ORD123', customer: 'John Doe', address: '123 Main St', status: 'Pending' },
        { id: 2, orderId: 'ORD124', customer: 'Jane Smith', address: '456 Elm St', status: 'Pending' },
        { id: 3, orderId: 'ORD125', customer: 'Alice Johnson', address: '789 Oak St', status: 'Pending' },
        { id: 4, orderId: 'ORD126', customer: 'Bob Brown', address: '321 Pine St', status: 'In Progress' },
        { id: 5, orderId: 'ORD127', customer: 'Charlie Davis', address: '654 Maple St', status: 'In Progress' },
        { id: 6, orderId: 'ORD128', customer: 'Eve White', address: '987 Cedar St', status: 'In Progress' },
        { id: 7, orderId: 'ORD129', customer: 'Frank Green', address: '135 Birch St', status: 'Completed' },
        { id: 8, orderId: 'ORD130', customer: 'Grace Hall', address: '246 Walnut St', status: 'Completed' },
        { id: 9, orderId: 'ORD131', customer: 'Henry King', address: '357 Cherry St', status: 'Completed' }
    ];

    // Function to render all deliveries into their respective status columns
    function renderDeliveries() {
        // Map of delivery statuses to their corresponding container elements
        const statuses = {
            'Pending': document.getElementById('pending-delivery-list'),
            'In Progress': document.getElementById('in-progress-delivery-list'),
            'Completed': document.getElementById('completed-delivery-list')
        };

        // Clear existing content in all status lists
        Object.values(statuses).forEach(list => list.innerHTML = '');

        // Loop through each delivery and create its DOM element
        deliveries.forEach(delivery => {
            const deliveryItem = document.createElement('div');
            deliveryItem.className = 'delivery-item';
            deliveryItem.innerHTML = `
                <div class="delivery-info">
                    <strong>Order ID:</strong> ${delivery.orderId}<br>
                    <strong>Customer:</strong> ${delivery.customer}<br>
                    <strong>Address:</strong> ${delivery.address}<br>
                    <strong>Status:</strong> ${delivery.status}
                </div>
                <div class="delivery-actions">
                    <button class="update-status" data-id="${delivery.id}">Update Status</button>
                    <button class="view-details" data-id="${delivery.id}">View Details</button>
                </div>
            `;
            // Append the delivery item to the appropriate status container
            statuses[delivery.status].appendChild(deliveryItem);
        });

        // Add event listeners to the newly created buttons
        addEventListeners();
    }

    // Function to attach click events to Update Status and View Details buttons
    function addEventListeners() {
        // Attach event to all "Update Status" buttons
        document.querySelectorAll('.update-status').forEach(button => {
            button.addEventListener('click', function () {
                promptDeliveryStatusUpdate(this.getAttribute('data-id'));
            });
        });

        // Attach event to all "View Details" buttons
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function () {
                viewDeliveryDetails(this.getAttribute('data-id'));
            });
        });
    }

    // Function to prompt the user to update the status of a delivery
    function promptDeliveryStatusUpdate(deliveryId) {
        let delivery = deliveries.find(d => d.id == deliveryId);
        if (delivery) {
            // Prompt user to enter a new status
            const newStatus = prompt(`Update status for Order ID: ${delivery.orderId} (Pending, In Progress, Completed):`, delivery.status);
            // Validate input and update status
            if (newStatus && ['Pending', 'In Progress', 'Completed'].includes(newStatus)) {
                delivery.status = newStatus;
                alert(`Status updated for Order ID: ${delivery.orderId}. New Status: ${delivery.status}`);
                renderDeliveries(); // Re-render the delivery lists after update
            } else {
                alert("Invalid status entered. Please enter Pending, In Progress, or Completed.");
            }
        }
    }

    // Function to display the details of a specific delivery
    function viewDeliveryDetails(deliveryId) {
        let delivery = deliveries.find(d => d.id == deliveryId);
        if (delivery) {
            alert(`Order ID: ${delivery.orderId}\nCustomer: ${delivery.customer}\nAddress: ${delivery.address}\nStatus: ${delivery.status}`);
        }
    }

    // Initial render of all deliveries on page load
    renderDeliveries();
});
