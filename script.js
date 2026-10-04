/* ---------- SAMPLE PRODUCT DATA ---------- */

const products = [
    {
        id: 1,
        name: "OFFGRID Oversized Tee",
        price: 799,
        category: "tops",
        tag: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Essential Street Tee",
        price: 699,
        category: "tops",
        tag: "NEW DROP",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Urban Layer Hoodie",
        price: 1499,
        category: "tops",
        tag: "LIMITED",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Utility Cargo Pants",
        price: 1799,
        category: "bottoms",
        tag: "NEW DROP",
        image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Relaxed Street Trousers",
        price: 1299,
        category: "bottoms",
        tag: "EVERYDAY",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Everyday Street Cap",
        price: 499,
        category: "accessories",
        tag: "ESSENTIAL",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Classic Crossbody Bag",
        price: 899,
        category: "accessories",
        tag: "NEW",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Minimal Graphic Tee",
        price: 849,
        category: "tops",
        tag: "OFFGRID PICK",
        image: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=700&q=80"
    }
];

/* ---------- CART DATA ---------- */

// The cart exists in memory while the page is open.
let cart = [];

/* ---------- SELECT HTML ELEMENTS ---------- */

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

/* ---------- DISPLAY PRODUCTS ---------- */

function displayProducts(category = "all") {
    // Show every product or only the selected category.
    const filteredProducts = category === "all"
        ? products
        : products.filter(product =>
            product.category === category
        );

    productGrid.innerHTML = "";

    filteredProducts.forEach(product => {
        // Create a card for each product.
        const card = document.createElement("article");
        card.className = "product-card";

        // Build the card safely using DOM elements.
        const imageBox = document.createElement("div");
        imageBox.className = "product-image";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        const tag = document.createElement("span");
        tag.className = "product-tag";
        tag.textContent = product.tag;

        imageBox.append(image, tag);

        const info = document.createElement("div");
        info.className = "product-info";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = "₹" + product.price.toLocaleString("en-IN");

        const actions = document.createElement("div");
        actions.className = "product-actions";

        const sizeSelect = document.createElement("select");
        sizeSelect.setAttribute("aria-label", "Select size for " + product.name);

        ["S", "M", "L", "XL"].forEach(size => {
            const option = document.createElement("option");
            option.value = size;
            option.textContent = size;
            sizeSelect.appendChild(option);
        });

        const addButton = document.createElement("button");
        addButton.className = "add-button";
        addButton.textContent = "ADD TO BAG +";

        // Add the selected product and size to the cart.
        addButton.addEventListener("click", () => {
            addToCart(product.id, sizeSelect.value);
        });

        actions.append(sizeSelect, addButton);
        info.append(name, price, actions);
        card.append(imageBox, info);

        productGrid.appendChild(card);
    });
}

/* ---------- FILTER BUTTONS ---------- */

document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
        // Update the active filter appearance.
        document.querySelectorAll(".filter-btn").forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        // Display products matching the selected filter.
        displayProducts(button.dataset.filter);
    });
});

/* ---------- ADD PRODUCTS TO CART ---------- */

function addToCart(productId, size) {
    const product = products.find(item => item.id === productId);

    // Allow the same product and size to increase its quantity.
    const existingItem = cart.find(item =>
        item.id === productId && item.size === size
    );

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            size: size,
            quantity: 1
        });
    }

    renderCart();

    // Briefly open the bag so the user sees the result.
    cartOverlay.classList.add("open");
}

/* ---------- UPDATE THE CART ---------- */

function renderCart() {
    cartItems.innerHTML = "";

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = "₹" + totalPrice.toLocaleString("en-IN");

    if (cart.length === 0) {
        cartItems.textContent =
            "Your bag is empty. Find your next favourite.";
        return;
    }

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("strong");
        name.textContent = item.name;

        const description = document.createElement("p");
        description.textContent =
            "Size: " + item.size + " · Qty: " + item.quantity;

        const removeButton = document.createElement("button");
        removeButton.className = "remove-item";
        removeButton.textContent = "REMOVE";

        removeButton.addEventListener("click", () => {
            removeFromCart(item.id, item.size);
        });

        details.append(name, description, removeButton);

        const subtotal = document.createElement("strong");
        subtotal.textContent =
            "₹" + (item.price * item.quantity).toLocaleString("en-IN");

        row.append(details, subtotal);
        cartItems.appendChild(row);
    });
}

/* ---------- REMOVE ITEMS ---------- */

function removeFromCart(productId, size) {
    cart = cart.filter(item =>
        !(item.id === productId && item.size === size)
    );

    renderCart();
}

/* ---------- OPEN AND CLOSE CART ---------- */

document.getElementById("cartButton").addEventListener("click", () => {
    cartOverlay.classList.add("open");
});

document.getElementById("closeCart").addEventListener("click", () => {
    cartOverlay.classList.remove("open");
});

// Close the cart when the user clicks outside its panel.
cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("open");
    }
});

/* ---------- MOBILE MENU ---------- */

document.getElementById("menuButton").addEventListener("click", () => {
    document.getElementById("navLinks").classList.toggle("show");
});

// Close the mobile menu after choosing a navigation link.
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navLinks").classList.remove("show");
    });
});

/* ---------- DEMO NEWSLETTER ---------- */

document.getElementById("newsletterForm").addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("emailInput").value.trim();
    const message = document.getElementById("formMessage");

    if (email) {
        message.textContent =
            "Thanks for your interest! This is a demo signup.";
        event.target.reset();
    }
});

/* ---------- DEMO CHECKOUT ---------- */

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your bag is empty. Add a product first!");
        return;
    }

    alert(
        "This is a portfolio demo. No order or payment has been made."
    );
});

/* ---------- INITIALIZE THE WEBSITE ---------- */

// Show products as soon as the page loads.
displayProducts();

// Initialize the cart count and total.
renderCart();