import { products } from "./products.js";

// --- Offer Bar Logic ---
var offerBar = document.querySelector(".offer-bar");
if (offerBar) { // Check if offer bar exists before adding listener
    document.getElementById("offer-close").addEventListener("click",
        function() {
            offerBar.style.display = "none";
        }
    );
}

// --- Side Navbar Logic ---
var sideNavMenu = document.querySelector(".navbar-menu-toggle");
var sideNavbar = document.querySelector(".side-navbar");

if (sideNavMenu && sideNavbar) { // Check if elements exist
    sideNavMenu.addEventListener("click", function() {
        sideNavbar.style.marginLeft = "0px"; // Show side navbar
    });

    document.getElementById("side-navbar-close").addEventListener("click", () => {
        sideNavbar.style.marginLeft = "-60%"; // Hide side navbar
    });
}

// --- Dynamic Product Display & Filtering ---

// Select the actual container where all products will be displayed
var productsContainer = document.querySelector(".products");

// Function to display products
function displayProducts(productsToDisplay) {
    productsContainer.innerHTML = ""; // Clear existing products first (important before adding new ones)

    if (productsToDisplay.length === 0) {
        productsContainer.innerHTML = "<p>No products found for the selected filters.</p>";
        return;
    }

    productsToDisplay.forEach((product) => {
        var createItem = document.createElement("div");
        createItem.classList.add("product-card");

        // Store product tags in a data attribute for easier filtering (more robust than <tags>)
        // We join the array of tags with a space so we can easily search for "summer" or "red"
        // Example: data-tags="new blue summer"
        createItem.setAttribute("data-tags", product.tags.join(' ')); 

        // Corrected innerHTML for product card
        createItem.innerHTML = `
            <img src="${product.src}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
        `;
        productsContainer.append(createItem);
    });
}

// --- Filtering Logic ---
var selectedFilterValues = []; // Stores currently selected filter values from checkboxes

// Select all filter checkboxes
var filterCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');

filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
        const value = e.target.value; // e.g., "summer", "red", "new"

        if (e.target.checked) {
            // Add the value to our list if checked
            selectedFilterValues.push(value);
        } else {
            // Remove the value from our list if unchecked
            selectedFilterValues = selectedFilterValues.filter(item => item !== value);
        }
        updateProductDisplay(); // Call update function after filter change
    });
});

// --- Search Functionality (Optional, but good to have) ---
// If you want the search bar to filter products too, uncomment these lines
var searchInput = document.querySelector(".product-section .navbar-search input[type='search']");
if (searchInput) {
    searchInput.addEventListener("keyup", function() {
        updateProductDisplay();
    });
}


function updateProductDisplay() {
    let currentProducts = products; // Start with all products from your products.js

    // 1. Apply Checkbox Filters
    if (selectedFilterValues.length > 0) {
        currentProducts = currentProducts.filter(product => {
            // Check if ALL selected filter values are present in the product's tags
            // This implements an "AND" logic across selected filters (e.g., must be "summer" AND "red")
            return selectedFilterValues.every(filterTag => product.tags.includes(filterTag));

            // If you want "OR" logic (product must have AT LEAST ONE of the selected tags), use .some() instead:
            // return selectedFilterValues.some(filterTag => product.tags.includes(filterTag));
            // Based on standard e-commerce filtering, 'AND' is usually preferred for multiple selections within the same filter group, but 'OR' for categories.
            // For this example, I've used 'every' for simplicity, assuming you want a product to match all selected filters.
            // If you select "summer" and "red", only products that are both "summer" AND "red" will show.
        });
    }

    // 2. Apply Search Filter (if search input exists and has a value)
    if (searchInput && searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.toLowerCase().trim();
        currentProducts = currentProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );
    }

    displayProducts(currentProducts); // Display the (filtered) products
}

// --- Initial Load ---
// This calls displayProducts() once when the page loads to show all products initially.
document.addEventListener("DOMContentLoaded", updateProductDisplay);