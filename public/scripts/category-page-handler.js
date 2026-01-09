// This file handles showing the specific product when navigating from search results

document.addEventListener("DOMContentLoaded", () => {
    // Dynamically import the products array and showProductDetail function
    // from a separate module named 'product-utils.js'
    import("./product-utils.js")
      .then((module) => {
        // Destructure products array and showProductDetail function from the module
        const products = module.products
        const showProductDetail = module.showProductDetail
  
        // Parse the URL parameters to get the productId (e.g., ?productId=123)
        const urlParams = new URLSearchParams(window.location.search)
        const productId = urlParams.get("productId")
  
        if (productId) {
          // Find the product in the products array that matches the productId
          const product = products.find((p) => p.id === productId)
  
          if (product) {
            // Display the product details on the page
            showProductDetail(productId)
  
            // Scroll smoothly to the product detail section if it exists
            const productDetail = document.getElementById("product-detail")
            if (productDetail) {
              setTimeout(() => {
                productDetail.scrollIntoView({ behavior: "smooth" })
              }, 100) // Delay slightly to ensure the element is rendered
            }
          }
        }
      })
      .catch((error) => {
        // Log an error if importing the module fails
        console.error("Error importing product-utils.js:", error)
      })
})
