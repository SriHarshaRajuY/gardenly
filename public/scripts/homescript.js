// -------------------- HOME SLIDER -------------------- //
var swiper = new Swiper(".home-slider", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    loop: true,
});

// -------------------- STAR RATING -------------------- //
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
    if (hasHalfStar) starsHTML += '<i class="fa-solid fa-star-half-stroke"></i>';
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) starsHTML += '<i class="far fa-star"></i>';
    return starsHTML;
}

function createStarRatingSVG(rating) {
    return Array(5).fill('').map((_, index) => {
        let fill = 'none', colorClass = 'text-gray-300';
        if (index < Math.floor(rating)) { fill = 'currentColor'; colorClass = 'text-yellow-400'; }
        else if (index === Math.floor(rating) && rating % 1 !== 0) { fill = 'url(#half-star)'; colorClass = 'text-yellow-400'; }
        return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${colorClass}">
            <defs>
                <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                    <stop offset="50%" stop-color="currentColor"/>
                    <stop offset="50%" stop-color="transparent"/>
                </linearGradient>
            </defs>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>`;
    }).join('');
}

// -------------------- AUTHENTICATION -------------------- //
async function isLoggedIn() {
    try {
        const res = await fetch('/api/check-auth', { credentials: 'include' });
        const data = await res.json();
        return data.isAuthenticated;
    } catch (e) { console.error('Auth error:', e); return false; }
}

// -------------------- PRODUCT DETAIL -------------------- //
function showProductDetail(productId) {
    const productElement = document.querySelector(`.product .box[data-product-id="${productId}"]`);
    if (!productElement) return console.error('Product not found:', productId);

    const product = {
        id: productId,
        name: productElement.querySelector('h3').textContent,
        image: productElement.querySelector('img').src,
        rating: parseFloat(productElement.dataset.rating) || 4.5,
        price: parseFloat(productElement.querySelector('.price').textContent.replace('₹','')),
        description: productElement.dataset.description || 'No description available.',
        inStock: productElement.querySelector('.add-to-cart-btn').textContent === 'Add to Cart',
        available: parseInt(productElement.querySelector('.available span').textContent.split(': ')[1]),
        category: productElement.dataset.category || 'General'
    };

    const detailContent = document.getElementById('product-detail').querySelector('.detail-content');

    detailContent.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div>
            <h1>${product.name}</h1>
            <div class="rating">${createStarRatingSVG(product.rating)}</div>
            <p class="price">₹${product.price.toFixed(2)}</p>
            <p class="description">${product.description}</p>
            <p class="available">Available: ${product.available}</p>
            <button class="add-to-cart-btn" ${!product.inStock ? 'disabled' : ''}>${product.inStock ? 'Add to Cart' : 'Sold Out'}</button>
            ${product.inStock ? `
                <button class="buy-now">Buy Now</button>
                <div class="quantity">
                    <button class="decrement">-</button>
                    <span class="quantity-value">1</span>
                    <button class="increment">+</button>
                </div>` : ''}
        </div>
    `;

    if (product.inStock) {
        const decrementBtn = detailContent.querySelector('.decrement');
        const incrementBtn = detailContent.querySelector('.increment');
        const quantityValue = detailContent.querySelector('.quantity-value');
        const priceElement = detailContent.querySelector('.price');
        const addToCartBtn = detailContent.querySelector('.add-to-cart-btn');
        let quantity = 1;

        const updateQuantityAndPrice = () => {
            quantityValue.textContent = quantity;
            priceElement.textContent = `₹${(product.price*quantity).toFixed(2)}`;
            decrementBtn.disabled = quantity <= 1;
            incrementBtn.disabled = quantity >= product.available;
        };

        incrementBtn.addEventListener('click', () => { if(quantity<product.available){quantity++;updateQuantityAndPrice();} });
        decrementBtn.addEventListener('click', () => { if(quantity>1){quantity--;updateQuantityAndPrice();} });

        addToCartBtn.addEventListener('click', async () => { await handleAddToCart(productId, quantity); });
    }

    document.getElementById('product-detail').classList.add('active');
}

// -------------------- PRODUCT ACTIONS -------------------- //
function handleProductAction(action, productId) {
    switch(action){
        case 'favorite': console.log(`Added ${productId} to favorites`); break;
        case 'share': console.log(`Sharing ${productId}`); break;
        case 'view': console.log(`Viewing ${productId}`); showProductDetail(productId); break;
        case 'cart': console.log(`Adding ${productId} to cart`); handleAddToCart(productId,1); break;
    }
}

// -------------------- ADD TO CART -------------------- //
async function handleAddToCart(productId, quantity){
    if(!await isLoggedIn()){ window.location.href='/login'; return; }

    const productElement = document.querySelector(`.box[data-product-id="${productId}"]`);
    if(!productElement) return alert('Product not found');

    const product = {
        id: productId,
        name: productElement.querySelector('h3').textContent,
        price: parseFloat(productElement.querySelector('.price').textContent.replace('₹','')),
        available: parseInt(productElement.querySelector('.available span').textContent.split(': ')[1]),
        inStock: productElement.querySelector('.add-to-cart-btn').textContent==='Add to Cart'
    };

    if(!product.inStock){ alert('Out of stock'); return; }
    if(quantity>product.available){ alert(`Only ${product.available} available`); return; }

    try {
        const res = await fetch('/api/cart/add',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({product_id:product.id, quantity})
        });
        const data = await res.json();
        if(res.ok){
            const btn = document.querySelector(`[data-product-id="${productId}"] .add-to-cart-btn`) || 
                        document.querySelector('#product-detail .add-to-cart-btn');
            if(btn){
                btn.innerHTML = '<i class="fas fa-check"></i> Added';
                btn.style.backgroundColor='#4CAF50';
                setTimeout(()=>{btn.innerHTML='Add to Cart'; btn.style.backgroundColor='';},2000);
            }
            alert(`${product.name} added to cart!`);
        } else alert(data.message||'Failed to add to cart');
    } catch(e){ console.error('Cart error:', e); alert('Failed to add to cart'); }
}
