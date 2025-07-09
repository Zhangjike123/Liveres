// menu.js

// Initial states
const initialCategories = {
  best_seller: [],
  trending: [],
  main_course: [],
  beverages: [],
};
const initialSearch = { title: [] };
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Create HTML for a menu item
const createMenuItem = (item) => `
  <div class="menu-card">
    <img src="${
      item.imageUrl ?? "https://placehold.co/200x100?text=Food+Item"
    }" alt="${item.title}" />
    <div class="menu-card-content">
      <h4>${item.title}</h4>
      <p>${item.description}</p>
      <span class="price">
        ${
          item.actualPrice
            ? `<strike>$${item.actualPrice.toFixed(2)}</strike>`
            : ""
        }
        $${item.sellingPrice.toFixed(2)}
      </span>
    </div>
    <button class="cta-button">Add to Cart</button>
  </div>
`;

const createProductDetails = (item) => {
  // Generate star rating HTML dynamically based on item.rating (max 5 stars)
  const maxStars = 5;
  const rating = Math.round(item.rating ?? 0);
  let starsHtml = "";
  for (let i = 1; i <= maxStars; i++) {
    if (i <= rating) {
      starsHtml += `<i class="fas fa-star icon-checked"></i>`;
    } else {
      starsHtml += `<i class="far fa-star icon-unchecked"></i>`;
    }
  }

  return `
   
      <div class="product-info">
        <div>
          <h1 class="product-name">${item.title}</h1>
          <p class="product-rating" id="productRating">
            ${starsHtml}
            <span>(${item.rating ? item.rating.toFixed(1) : "0.0"})</span>
          </p>
        </div>
        <p class="product-description">
          ${item.description}
        </p>
        <div class="product-cta">
          <p class="product-price">$${
            item.sellingPrice ? item.sellingPrice.toFixed(2) : "0.00"
          }</p>
          <div>
            <button class="add-to-cart">Add to Cart</button>
            <button class="add-to-cart">Order it</button>
          </div>
        </div>
      </div>
    
  `;
};




// Renders product details when a menu item title (h4) is clicked
function setupProductInfoHandler(items) {
  document.addEventListener("click", function (e) {
    if (e.target && e.target.matches(".menu-card-content h4")) {
      const clickedTitle = e.target.textContent;
      // If multiple items have the same title, this will always pick the first match
      const product = items.find((item) => item.title === clickedTitle);
      if (!product) return;

      const productInfoContainer = document.querySelector(
        ".product-info-container"
      );
      if (productInfoContainer) {
        productInfoContainer.innerHTML = createProductDetails(product);
      }
    }
  });
}



function setupAddcartinfoHandler(items) {
  // Array to store cart items


  document.addEventListener("click", function (e) {
    if (
      e.target &&
      e.target.classList.contains("add-to-cart") &&
      e.target.closest(".product-info-container")
    ) {
      // Find the product name from the .product-name element
      const productNameElem = e.target
        .closest(".product-info")
        ?.querySelector(".product-name");
      if (!productNameElem) return;
      const productName = productNameElem.textContent;
      const product = items.find((item) => item.title === productName);
      if (!product) return;

      // Add product to cart array (avoid duplicates, increase quantity if exists)
      const existing = cart.find((item) => item.title === product.title);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      // Store updated cart in localStorage
      localStorage.setItem("cart", JSON.stringify(cart));
      // Optionally, update UI or show a message
      // alert("Added to cart!");
        updateCartCount();
    }
  
  });
}

function setupAddtocartfromMenu(items) {
  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("cta-button")) {
      const card = e.target.closest(".menu-card");
      const title = card.querySelector("h4").textContent;
      const product = items.find((item) => item.title === title);
      if (!product) return;

      const existing = cart.find((item) => item.title === product.title);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
     
    }
  }); 
}

console.log("I am length of cart",cart.length);

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Updates the cart‑count badge text
function updateCartCount() {
  const cart = getCart();
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = cart.length;
  }
}
async function LoadPorductInfo() {
  const items = await fetchData();
  setupProductInfoHandler(items);
  setupAddcartinfoHandler(items);
  setupAddtocartfromMenu(items);
}

// Render helper (for categories and search)
const renderItems = (items, containerId) => {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`No container found with id="${containerId}"`);
    return;
  }
  container.innerHTML = items.map(createMenuItem).join("");
};

// Fetch and populate functions
async function fetchData() {
  const res = await fetch("./foodItem.json");
  const json = await res.json();
  if (!Array.isArray(json.foodItems)) {
    console.error("No 'foodItems' array in JSON");
    return [];
  }
  return json.foodItems;
}

async function loadMenuItems() {
  const items = await fetchData();

  const categories = items.reduce(
    (acc, item) => {
      if (item.best_seller) acc.best_seller.push(item);
      if (item.trending) acc.trending.push(item);
      if (item.category === "Main Course") acc.main_course.push(item);
      if (item.category === "Beverages") acc.beverages.push(item);
      return acc;
    },
    { ...initialCategories }
  );

  renderItems(categories.best_seller, "best-seller");
  renderItems(categories.trending, "trending");
  renderItems(categories.main_course, "main_course");

  const BeveragesButton = document.querySelector(".beverage-button");

  BeveragesButton.addEventListener("click", () => {
    renderItems(categories.beverages, "title");
  });

  const MainCourseButton = document.querySelector(".maincourse-button");

  MainCourseButton.addEventListener("click", () => {
    renderItems(categories.main_course, "title");
  });

  const AllButton = document.querySelector(".all-button");

  AllButton.addEventListener("click", () => {
    renderItems(items, "title");
  });
  console.log("Main Course", categories.main_course);
}

async function searchMenuItems(query) {
  const items = (await fetchData()).filter((item) =>
    item.title?.toLowerCase().includes(query.toLowerCase())
  );
  renderItems(items, "title");
  console.log("Search results:", items);
}



// Debounce utility function
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Debounced search listener
function setupSearch() {
  const input = document.querySelector(".search-input");
  if (!input) return;

  const debounced = debounce((e) => {
    const q = e.target.value.trim();
    if (q) searchMenuItems(q);
  }, 500);

  input.addEventListener("input", debounced);
}

// Initialize on DOM ready
function init() {
  loadMenuItems();
  setupSearch();
  LoadPorductInfo();
}

// Only attach event listener if running in a browser environment
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", init);
}
