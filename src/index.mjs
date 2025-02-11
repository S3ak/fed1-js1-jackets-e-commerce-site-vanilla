import { createHTML, clearNode, getLocalItem } from "./utils.mjs";
import { API_URL, ERROR_MESSAGE_DEFAULT } from "./constants.mjs";
import { addToCart } from "./cart.mjs";
import { createLoadingSkeleton } from "./home/product-skeleton-template.mjs";
import productTemplate from "./products/product-template.mjs";

const containerEl = document.querySelector("#js-products");
const sortByEl = document.querySelector("#js-sort-by");
const searchInputNode = document.querySelector("#search");

/**
 * @typedef {Object} ProductDetails
 * @property {string} title - The name of the product.
 * @property {number} price - The sell price of a product.
 * @property {string} description - The description of the product.
 * @property {Object} image - The image object.
 * @property {string} image.url - The URL of the primary image.
 * @property {string} image.alt - The alt text for the primary image.
 */

// This is not optimum because we should have the products live in a service that can sync over mutliple HTML pages and
let products = [];

setup();

// Eveyr page should have a custom startup event that we can choose to run certain javascript.
function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  // FIXME: This should be a function that accepts all DOM element that contain an ID with the predix JS
  if (!containerEl || !sortByEl || !searchInputNode) {
    // Log an error message if either element is missing
    console.error("JS cannot run!!!");
  } else {
    // If both elements exist, call the setup function to initialize the application
    getProducts();
  }
}

/**
 * Event listener for the 'change' event on the sortByEl element.
 * This function sorts the product list based on the selected value.
 *
 * @param {Event} event - The change event triggered by the sortByEl element.
 *
 * The function checks the value of the event target:
 * - If the value is "asc", it calls sortByPriceDescending() to sort the product list by price in descending order.
 * - If the value is "dec", it calls sortByPriceAscending() to sort the product list by price in ascending order.
 *
 * After sorting, it calls createProductsListEl(products) to rerender the sorted product list.
 */
sortByEl.addEventListener("change", (event) => {
  const val = event.target.value;

  // Sort productlist by price - low to high
  if (val === "asc") {
    sortByPriceDescending();
    // Sort productlist by price - high to low
  } else if (val === "dec") {
    sortByPriceAscending();
  }

  // NOTE: we need to rerender our sorted list now;
  renderProductsListEl(products);
});

async function getProducts() {
  clearNode(containerEl);
  createLoadingSkeleton(containerEl);

  try {
    const response = await fetch(API_URL);
    const { data: products } = await response.json();
    window.localStorage.setItem("products", JSON.stringify(products));

    sortByPriceDescending();
    renderProductsListEl(products);
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

/**
 * Creates and appends a list of product elements to the container element.
 *
 * @param {Array} [list=products] - The list of products to display. Each product should be an object with the following properties:
 * @param {string} list[].id - The unique identifier for the product.
 * @param {string} list[].title - The title of the product.
 * @param {Object} list[].image - The image object for the product.
 * @param {string} list[].image.url - The URL of the product image.
 * @param {string} list[].image.alt - The alt text for the product image.
 * @param {number} list[].price - The price of the product.
 * @param {string} list[].description - The description of the product.
 */
function renderProductsListEl(list = []) {
  clearNode(containerEl);

  list.forEach(({ id, title, image, price, description }) => {
    const template = productTemplate({
      id,
      title,
      imgUrl: image.url,
      imgAl: image.alt,
      price,
      description,
    });

    const newEl = createHTML(template);
    // FIXME: Use data attribute
    const btn = newEl.querySelector("button");

    btn.addEventListener("click", () => {
      addToCart({
        id,
        title,
        imgUrl: image.url,
        price,
      });
    });

    containerEl.append(newEl);
  });
}

function sortByPriceDescending(list = products) {
  list.sort((a, b) => a.price - b.price);
}

function sortByPriceAscending(list = products) {
  list.sort((a, b) => b.price - a.price);
}

searchInputNode.addEventListener("input", (event) => {
  const products = getLocalItem("products");

  handleSearch(event.target.value, products);
});

/**
 * Filters a list of products based on a search term and renders the filtered list.
 *
 * @param {string} [searchTerm=""] - The term to search for in the product titles.
 * @param {Array<ProductDetails>} [list=[]] - The list of products to search through.
 */
function handleSearch(searchTerm = "", list = []) {
  const filteredProducts = list.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  renderProductsListEl(filteredProducts);
}
