// This file exposes the product arrays to the global scope
// so they can be accessed for search functionality on different pages.

document.addEventListener("DOMContentLoaded", () => {
    // Declare a local variable 'products'.
    // This should hold the array of products specific to the page.
    let products;

    // Check if the 'products' variable is defined
    if (typeof products !== "undefined") {
        // Get the current URL path to determine which product page we're on
        const currentPath = window.location.pathname;

        // Based on the page, assign the products array to a global variable
        // so that it can be accessed anywhere for search/filtering
        if (currentPath.includes("fertilizers")) {
            window.fertilizersProducts = products; // Global variable for fertilizers
        } else if (currentPath.includes("pebbles")) {
            window.pebblesProducts = products; // Global variable for pebbles
        } else if (currentPath.includes("plants")) {
            window.plantsProducts = products; // Global variable for plants
        } else if (currentPath.includes("seeds")) {
            window.seedsProducts = products; // Global variable for seeds
        } else if (currentPath.includes("tools")) {
            window.toolsProducts = products; // Global variable for tools
        }
    }
});
