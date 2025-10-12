
// Wait for the entire DOM content to load before executing the script
document.addEventListener("DOMContentLoaded", () => {
    // Get references to all necessary DOM elements
    const productForm = document.getElementById("seller-product-form");
    const topSales = document.getElementById("seller-top-sales");
    const recentSales = document.getElementById("seller-recent-sales");
    const productModal = document.getElementById("seller-product-modal");
    const overlay = document.getElementById("seller-overlay");
    const modalImg = document.getElementById("seller-modal-img");
    const modalTitle = document.getElementById("seller-modal-title");
    const modalPrice = document.getElementById("seller-modal-price");
    const modalQuantity = document.getElementById("seller-modal-quantity");
    const modalSold = document.getElementById("seller-modal-sold");
    const modalDescription = document.getElementById("seller-modal-description");
    const closeBtn = document.querySelector(".seller-close");

    let products = [];         // Array to store all products
    let isSubmitting = false;  // Flag to prevent multiple form submissions

    // ------------------- FETCHING DATA FROM SERVER -------------------

    // Fetch top-selling products
    async function fetchTopSales() {
        try {
            const response = await fetch('/api/top-sales'); // GET top sales data
            if (!response.ok) throw new Error('Failed to fetch top sales');
            return await response.json(); // Parse response as JSON
        } catch (error) {
            console.error('Error loading top sales:', error);
            return [];
        }
    }

    // Fetch recently sold products
    async function fetchRecentSales() {
        try {
            const response = await fetch('/api/recent-sales'); // GET recent sales data
            if (!response.ok) throw new Error('Failed to fetch recent sales');
            return await response.json(); // Parse response as JSON
        } catch (error) {
            console.error('Error loading recent sales:', error);
            return [];
        }
    }

    // ------------------- PRODUCT CARD CREATION -------------------

    // Create a product card element dynamically
    function createProductCard(product) {
        const productDiv = document.createElement("div");
        productDiv.className = "product-card";
        productDiv.setAttribute('data-product-id', product.id);

        // Card HTML structure
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price}</p>
            <p class="quantity">Quantity: ${product.quantity}</p>
            <p class="sold">Sold: ${product.sold}</p>
            <button class="view-details-btn">View Details</button>
            <button class="seller-edit-btn">Edit</button>
            <button class="seller-delete-btn">Delete</button>
        `;

        // Attach event listeners to each button
        productDiv.querySelector(".view-details-btn").addEventListener("click", () => showProductDetails(product));
        productDiv.querySelector(".seller-edit-btn").addEventListener("click", () => editProduct(product));
        productDiv.querySelector(".seller-delete-btn").addEventListener("click", () => deleteProduct(product));

        return productDiv;
    }

    // ------------------- PRODUCT MODAL HANDLING -------------------

    // Show product details in a modal
    function showProductDetails(product) {
        modalImg.src = product.image;
        modalTitle.textContent = product.name;
        modalPrice.textContent = `Price: ${product.price}`;
        modalQuantity.textContent = `Quantity: ${product.quantity}`;
        modalSold.textContent = `Sold: ${product.sold}`;
        modalDescription.textContent = product.description || "No description available";
        
        productModal.classList.add('active'); // Display modal
        overlay.classList.add('active');      // Show overlay background
    }

    // ------------------- EDIT PRODUCT -------------------

    async function editProduct(product) {
        // Prompt user for new details
        const newName = prompt("Enter new product name:", product.name);
        const newDescription = prompt("Enter new description:", product.description || "");
        const newCategory = prompt("Enter new category:", product.category || "");
        const newPrice = prompt("Enter new price (e.g., 10.99):", product.price.replace('$', ''));
        const newQuantity = prompt("Enter new quantity:", product.quantity);

        // Validate input
        if (newName && newDescription !== null && newCategory && newPrice && newQuantity) {
            const priceNum = parseFloat(newPrice);
            const quantityNum = parseInt(newQuantity);
            if (isNaN(priceNum) || priceNum <= 0) {
                alert('Price must be a positive number.');
                return;
            }
            if (isNaN(quantityNum) || quantityNum < 0) {
                alert('Quantity must be a non-negative integer.');
                return;
            }

            try {
                // PUT request to update product details
                const response = await fetch(`/api/products/${product.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: newName,
                        description: newDescription,
                        category: newCategory,
                        price: priceNum,
                        quantity: quantityNum
                    })
                });

                const rawResponse = await response.text();
                console.log('Edit response:', rawResponse);

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = JSON.parse(rawResponse);
                    } catch {
                        throw new Error('Server returned an unexpected response: ' + rawResponse);
                    }
                    throw new Error(errorData.message || 'Failed to update product');
                }

                await renderProducts(); // Refresh products after update
                alert('Product updated successfully!');
            } catch (error) {
                console.error('Error updating product:', error);
                alert(error.message || 'Failed to update product. Please try again.');
            }
        } else {
            alert('All fields are required.');
        }
    }

    // ------------------- DELETE PRODUCT -------------------

    async function deleteProduct(product) {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                // DELETE request to remove product
                const response = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
                const rawResponse = await response.text();
                console.log('Delete response:', rawResponse);

                if (!response.ok) {
                    let errorData;
                    try {
                        errorData = JSON.parse(rawResponse);
                    } catch {
                        throw new Error('Server returned an unexpected response: ' + rawResponse);
                    }
                    throw new Error(errorData.message || 'Failed to delete product');
                }

                // Update local product list and re-render
                products = products.filter(p => p.id !== product.id);
                await renderProducts();
                alert('Product deleted successfully!');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert(error.message || 'Failed to delete product. Please try again.');
            }
        }
    }

    // ------------------- RENDER PRODUCTS -------------------

    async function renderProducts() {
        topSales.innerHTML = "";
        recentSales.innerHTML = "";

        try {
            // GET all seller products
            const response = await fetch('/api/seller/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            products = await response.json();

            // Clear old product sections
            document.querySelectorAll('.product-list').forEach(list => list.innerHTML = "");

            // Group products by category
            const productsByCategory = products.reduce((acc, product) => {
                const category = product.category || 'Uncategorized';
                if (!acc[category]) acc[category] = [];
                acc[category].push(product);
                return acc;
            }, {});

            const sellerProducts = document.querySelector('.seller-products');

            // Ensure heading exists
            if (!sellerProducts.querySelector('h2')) {
                sellerProducts.innerHTML = '<h2>Your Products</h2>';
            }

            // Display empty state if no products
            if (Object.keys(productsByCategory).length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.textContent = 'No products found. Add a product to get started!';
                sellerProducts.appendChild(emptyMessage);
            } else {
                const emptyMessage = sellerProducts.querySelector('p');
                if (emptyMessage) emptyMessage.remove();

                // Render each category and its products
                Object.keys(productsByCategory).forEach(category => {
                    const categoryId = category.toLowerCase().replace(/\s+/g, '-');
                    let categorySection = Array.from(document.querySelectorAll('.category-section h3'))
                        .find(h3 => h3.textContent.toLowerCase() === category.toLowerCase())?.parentElement;

                    if (!categorySection) {
                        categorySection = document.createElement('div');
                        categorySection.className = 'category-section';
                        categorySection.innerHTML = `
                            <h3>${category}</h3>
                            <div class="product-list" id="seller-product-list-${categoryId}"></div>
                        `;
                        sellerProducts.appendChild(categorySection);
                    }

                    const categoryList = categorySection.querySelector(`#seller-product-list-${categoryId}`);
                    productsByCategory[category].forEach(product => {
                        const productCard = createProductCard(product);
                        categoryList.appendChild(productCard);
                    });
                });
            }

            // Render top and recent sales sections
            const topProducts = await fetchTopSales();
            topProducts.forEach(product => topSales.appendChild(createProductCard(product)));

            const recentProducts = await fetchRecentSales();
            recentProducts.forEach(product => recentSales.appendChild(createProductCard(product)));
        } catch (error) {
            console.error('Error rendering products:', error);
            alert('Failed to load products. Please refresh the page.');
        }
    }

    // ------------------- IMAGE COMPRESSION -------------------

    async function compressImage(file, maxWidth = 800, quality = 0.7) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const scale = Math.min(maxWidth / img.width, 1);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    resolve(canvas.toDataURL('image/jpeg', quality)); // Return compressed image
                };
            };
            reader.readAsDataURL(file);
        });
    }

    // ------------------- PRODUCT FORM SUBMISSION -------------------

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent double submission
        isSubmitting = true;

        // Extract values from form fields
        const name = document.getElementById('seller-product-name').value.trim();
        const description = document.getElementById('seller-product-description').value.trim();
        const category = document.getElementById('seller-product-category').value.trim();
        const price = document.getElementById('seller-product-price').value;
        const quantity = document.getElementById('seller-product-quantity').value;
        const imageFile = document.getElementById('seller-product-image').files[0];

        // Input validations
        if (!name) { alert('Please enter a product name'); isSubmitting = false; return; }
        if (!imageFile) { alert('Please select a product image'); isSubmitting = false; return; }
        if (imageFile.size > 5 * 1024 * 1024) { alert('Image file too large'); isSubmitting = false; return; }
        if (!category) { alert('Please enter a category'); isSubmitting = false; return; }

        const priceNum = parseFloat(price);
        const quantityNum = parseInt(quantity);
        if (!price || isNaN(priceNum) || priceNum <= 0) { alert('Invalid price'); isSubmitting = false; return; }
        if (!quantity || isNaN(quantityNum) || quantityNum <= 0) { alert('Invalid quantity'); isSubmitting = false; return; }

        // Compress product image before uploading
        let compressedImage;
        try {
            compressedImage = await compressImage(imageFile);
        } catch (error) {
            console.error('Error compressing image:', error);
            alert('Failed to compress image');
            isSubmitting = false;
            return;
        }

        // Prepare form data for server
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('price', priceNum);
        formData.append('quantity', quantityNum);

        // Convert DataURL to Blob for upload
        const blob = await fetch(compressedImage).then(res => res.blob());
        formData.append('image', blob, imageFile.name);

        try {
            // POST new product to server
            const response = await fetch('/addproduct', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log('Server response:', result);
            
            if (result.success) {
                e.target.reset();
                await renderProducts();
                alert('Product added successfully!');
            } else {
                alert(result.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        } finally {
            isSubmitting = false;
        }
    });

    // ------------------- EVENT LISTENERS FOR MODAL -------------------

    closeBtn.addEventListener("click", () => {
        productModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener("click", () => {
        productModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Initial page load — fetch and render all products
    renderProducts();
});
