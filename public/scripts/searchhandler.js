// ============================================================
// 🔍 Product Search Functionality (with categories + live search)
// ============================================================

// Function to collect all products from different categories
function getAllProducts() {
    // Create an empty array to store all products together
    const allProducts = [];

    // ✅ Add "New Products" if they exist in the global window object
    if (typeof window.newProducts !== "undefined") {
        window.newProducts.forEach((product) => {
            allProducts.push({
                ...product,          // Copy all product properties
                category: "new"      // Add a category label
            });
        });
    }

    // ✅ Add "Best Products" if they exist in the global window object
    if (typeof window.bestProducts !== "undefined") {
        window.bestProducts.forEach((product) => {
            allProducts.push({
                ...product,          // Copy all product properties
                category: "best"     // Add a category label
            });
        });
    }

    // Return the combined product list
    return allProducts;
}

// ============================================================
// 🔎 Function to search products by name or description
// ============================================================

function searchProducts(query) {
    // If query is empty, return no results
    if (!query || query.trim() === "") return [];

    // Convert to lowercase for case-insensitive search
    query = query.toLowerCase().trim();

    // Get all products combined from all categories
    const allProducts = getAllProducts();

    // Filter products that match the query in name or description
    return allProducts.filter((product) => {
        return (
            product.name.toLowerCase().includes(query) ||
            (product.description && product.description.toLowerCase().includes(query))
        );
    });
}

// ============================================================
// 🧾 Function to display the search results on screen
// ============================================================

function displaySearchResults(results) {
    // Get the container where search results will be shown
    const searchResultsContainer = document.getElementById("search-results");

    // If the results container doesn't exist, create it dynamically
    if (!searchResultsContainer) {
        const container = document.createElement("div");
        container.id = "search-results";
        container.className = "search-results-container";
        document.querySelector(".search-container").appendChild(container);

        // 🛑 Hide results when user clicks outside the search box
        document.addEventListener("click", (e) => {
            if (!e.target.closest(".search-container")) {
                hideSearchResults();
            }
        });
    }

    // Reference to (newly created or existing) results container
    const resultsContainer = document.getElementById("search-results");

    // Clear any previous search results
    resultsContainer.innerHTML = "";

    // If no results found, show a message
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
        resultsContainer.style.display = "block";
        return;
    }

    // Create an unordered list (<ul>) to hold result items
    const resultsList = document.createElement("ul");
    resultsList.className = "results-list";

    // Loop through each matched product and create a result item
    results.forEach((product) => {
        const listItem = document.createElement("li");
        listItem.className = "result-item";

        // Add product image, name, and price to each result item
        listItem.innerHTML = `
            <div class="result-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="result-info">
                <h4>${product.name}</h4>
                <p class="result-price">₹${product.price}</p>
            </div>
        `;

        // 🖱️ On clicking a product, show its details and hide the results
        listItem.addEventListener("click", () => {
            showProductDetail(product.id); // function defined elsewhere
            hideSearchResults();
        });

        // Add item to the results list
        resultsList.appendChild(listItem);
    });

    // Append the full list to the container and display it
    resultsContainer.appendChild(resultsList);
    resultsContainer.style.display = "block";
}

// ============================================================
// 🫥 Function to hide search results
// ============================================================

function hideSearchResults() {
    const resultsContainer = document.getElementById("search-results");
    if (resultsContainer) {
        resultsContainer.style.display = "none";
    }
}

// ============================================================
// ⚙️ Initialize search functionality when DOM is loaded
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // Get the search input field and search icon
    const searchInput = document.getElementById("search-input");
    const searchIcon = document.querySelector(".search-icon");

    if (searchInput) {
        // 🕒 Debounce Timer (waits before triggering search)
        let debounceTimer;

        // Search while typing, but with 300ms delay
        searchInput.addEventListener("input", (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = e.target.value;
                if (query.trim() !== "") {
                    const results = searchProducts(query);
                    displaySearchResults(results);
                } else {
                    hideSearchResults();
                }
            }, 300); // delay 300ms for smooth performance
        });

        // 🔘 Search when pressing Enter key
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                const query = e.target.value;
                if (query.trim() !== "") {
                    const results = searchProducts(query);
                    displaySearchResults(results);
                }
            }
        });

        // 🖱️ Search when clicking on the search icon
        if (searchIcon) {
            searchIcon.addEventListener("click", () => {
                const query = searchInput.value;
                if (query.trim() !== "") {
                    const results = searchProducts(query);
                    displaySearchResults(results);
                }
            });
        }
    }
});
