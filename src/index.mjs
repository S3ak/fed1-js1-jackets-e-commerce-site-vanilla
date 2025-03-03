import { createHTML, clearNode, getLocalItem, setLocalItem } from "./utils.mjs";
import { API_URL, ERROR_MESSAGE_DEFAULT, MEDIA_QUERIES } from "./constants.mjs";
import { addToCart } from "./cart.mjs";
import { createLoadingSkeleton } from "./home/product-skeleton-template.mjs";
import productTemplate from "./products/product-template.mjs";

const containerEl = document.querySelector("#js-products");
const titleEl = document.querySelector("#js-title-section");
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

// Every page should have a custom startup event that we can choose to run certain javascript.
async function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  // FIXME: This should be a function that accepts all DOM element that contain an ID with the predix JS
  if (!containerEl || !sortByEl || !searchInputNode || !titleEl) {
    // Log an error message if either element is missing
    console.error("Missing HTML elements");
  } else {
    // If both elements exist, call the setup function to initialize the application
    createLoadingSkeleton(containerEl);

    const { products } = await fetchProductsFromAPI();
    const sortedProducts = sortByPrice(products);

    renderProductsListEl(sortedProducts);

    containerEl.addEventListener("click", onProductClick);

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
      const direction = event.target.value;
      /** @type {Array<ProductDetails>} */
      const products = getLocalItem(PRODUCTS_KEY);

      const sortedProducts = sortByPrice(products, direction);

      // NOTE: we need to rerender our sorted list now;
      renderProductsListEl(sortedProducts);
    });

    searchInputNode.addEventListener("input", (event) => {
      // FIXME: this should come from the service products.items;
      const products = getLocalItem(PRODUCTS_KEY);

      handleSearch(event.target.value, products);
    });

    window.addEventListener("resize", setTitle);
  }
}

/**
 * Creates and appends a list of product elements to the container element.
 *
 * @param {Array<ProductDetails>} [list=[]] - The list of products to display. Each product should be an object with the following properties:
 */
function renderProductsListEl(list = []) {
  // TODO: Make this a pure function
  clearNode(containerEl);

  list.forEach(({ id, title, price, description, thumbnail }, index) => {
    const template = productTemplate({
      id,
      title,
      imgUrl: thumbnail,
      imgAl: title,
      price,
      description,
      index,
    });

    const newEl = createHTML(template);
    // We dont' add the event listener to the product "add to cart" button because we will have one listener on the list container element

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
    const { products: data } = await response.json();
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
    sortedList = list.toSorted((a, b) => a.price - b.price);
  } else {
    sortedList = list.toSorted((a, b) => b.price - a.price);
  }

  return sortedList;
}

/**
 * Handles the click event on a product item.
 *
 * This function determines if the clicked element is a button or an image within a product item.
 * If a button is clicked, it adds the corresponding product to the cart.
 * If an image is clicked, it logs a message to navigate to the product details page.
 *
 * @param {Event} event - The click event object.
 */
function onProductClick(event) {
  const target = event.target;
  /** @type {HTMLElement | undefined} */
  const container = target.closest("[data-component='productPreviewDetails']");
  const productId = container?.dataset?.productid;

  if (target.tagName === "BUTTON" && container) {
    /** @type {Array<ProductDetails>} */
    const products = getLocalItem(PRODUCTS_KEY);
    const foundProduct = products.find((p) => p.id === Number(productId));

    if (foundProduct) {
      addToCart({
        id: foundProduct.id,
        title: foundProduct.title,
        imgUrl: foundProduct.thumbnail,
        price: foundProduct.price,
      });
    }
  } else if (target.tagName === "IMG" && container) {
    // The anchor tag will navigate the user. AS long as we dont use e.preventDefault();
    console.log(`Navigate to product details for product ID: ${productId}`);
  }
}

function setTitle() {
  const h1El = titleEl.querySelector("h1");
  const isBelowMobileBreakpoint = window.innerWidth < MEDIA_QUERIES.s;

  h1El.textContent = "ODD";

  if (!isBelowMobileBreakpoint) {
    h1El.textContent = "Outer Dimensional Drip";
  }
}
