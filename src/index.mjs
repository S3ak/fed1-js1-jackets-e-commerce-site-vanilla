import { createHTML, clearNode, getLocalItem, setLocalItem } from "./utils.mjs";
import { API_URL, ERROR_MESSAGE_DEFAULT } from "./constants.mjs";
import { addToCart } from "./cart.mjs";
import { createLoadingSkeleton } from "./home/product-skeleton-template.mjs";
import productTemplate from "./products/product-template.mjs";

const containerEl = document.querySelector("#js-products");
const sortByEl = document.querySelector("#js-sort-by");
const searchInputNode = document.querySelector("#search");

const PRODUCTS_KEY = "products";

/**
 * @typedef {Object} ProductDetails
 * @property {string} id - Unique identifer.
 * @property {string} title - The name of the product.
 * @property {number} price - The sell price of a product.
 * @property {string} description - The description of the product.
 * @property {Object} image - The image object.
 * @property {string} image.url - The URL of the primary image.
 * @property {string} image.alt - The alt text for the primary image.
 */

setup();

// Eveyr page should have a custom startup event that we can choose to run certain javascript.
async function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  // FIXME: This should be a function that accepts all DOM element that contain an ID with the predix JS
  if (!containerEl || !sortByEl || !searchInputNode) {
    // Log an error message if either element is missing
    console.error("JS cannot run!!!");
  } else {
    // If both elements exist, call the setup function to initialize the application
    createLoadingSkeleton(containerEl);

    const { products } = await fetchProductsFromAPI();
    const sortedProducts = sortByPrice(products);

    renderProductsListEl(sortedProducts);
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
  /** @type {Array<ProductDetails>} */
  const products = getLocalItem(PRODUCTS_KEY);

  const sortedProducts = sortByPrice(val, products);

  // NOTE: we need to rerender our sorted list now;
  renderProductsListEl(sortedProducts);
});

searchInputNode.addEventListener("input", (event) => {
  // FIXME: this should come from the service products.items;
  const products = getLocalItem(PRODUCTS_KEY);

  handleSearch(event.target.value, products);
});

/**
 * Creates and appends a list of product elements to the container element.
 *
 * @param {Array<ProductDetails>} [list=[]] - The list of products to display. Each product should be an object with the following properties:
 */
function renderProductsListEl(list = []) {
  // TODO: Make this a pure function
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

async function fetchProductsFromAPI(url = API_URL) {
  /** @type {Array<ProductDetails>} */
  let products = [];
  let error = null;

  try {
    const response = await fetch(url);
    const { data } = await response.json();
    products = data;
    setLocalItem(PRODUCTS_KEY, products);
  } catch (err) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
    error = err;
  }

  return {
    products,
    error,
  };
}

/**
 * Sorts an array of objects by their price property in descending order.
 *
 * @param {Array<ProductDetails>} list - The array of objects to be sorted. Each object should have a `price` property.
 * @param {"asc" | "desc"} direction - The array of objects to be sorted. Each object should have a `price` property.
 * @returns {Array<ProductDetails>} The sorted array with objects ordered by price in descending order.
 */
function sortByPrice(list = [], direction = "asc") {
  let sortedList = [];

  if (direction === "asc") {
    sortedList = list.sort((a, b) => b.price - a.price);
  } else {
    sortedList = list.sort((a, b) => a.price - b.price);
  }

  return sortedList;
}
