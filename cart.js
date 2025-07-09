// Retrieve cart items from localStorage or initialize as empty array
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
console.log(cartItems);

const cartContainer = document.querySelector(".cart-container");

// Helper to render a single cart product
function cartProductDetails({ imageUrl, title, sellingPrice, quantity }) {
    const totalPrice = sellingPrice * quantity;
    return `
        <div class="cart-product" data-image-url="${imageUrl}">
            <img src="${imageUrl}" alt="" class="cart-product-img">
            <div class="cart-product-details">
                <h3 class="cart-product-name">${title}</h3>
                <p class="cart-product-price">₹${sellingPrice}</p>
                <p class="cart-product-quantity">Quantity: ${quantity}</p>
                <p class="cart-product-total">Total: ₹${totalPrice}</p>
                <button class="cart-product-remove">Remove</button>
                <button class="cart-product-order">Order</button>
            </div>
        </div>
    `;
}

// Render all cart items
function renderCart() {
    cartContainer.innerHTML = "";
    cartItems.forEach((item) => {
        cartContainer.insertAdjacentHTML("beforeend", cartProductDetails(item));
    });
}
renderCart();

// Event delegation for remove buttons
cartContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-product-remove")) {
        const productDiv = e.target.closest(".cart-product");
        const imageUrl = productDiv.getAttribute("data-image-url");
        const index = cartItems.findIndex((item) => item.imageUrl === imageUrl);
        if (index !== -1) {
            cartItems.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cartItems));
            renderCart();
        }
    }
});

cartContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("cart-product-order")) {
        const productDiv = e.target.closest(".cart-product");
        const imageUrl = productDiv.getAttribute("data-image-url");
        const itemIndex = cartItems.findIndex(item => item.imageUrl === imageUrl);

        if (itemIndex !== -1) {
            const orderItems = JSON.parse(localStorage.getItem("orderItem")) || [];
            // Add the ordered item to orderItems
            orderItems.push(cartItems[itemIndex]);
            localStorage.setItem("orderItem", JSON.stringify(orderItems));
            console.log("Order Items:", orderItems);
        }
    }
});