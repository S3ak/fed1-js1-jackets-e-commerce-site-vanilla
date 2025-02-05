import { createHTML, clearNode } from "./utils.mjs";
import { API_URL, ERROR_MESSAGE_DEFAULT, CURRENCY } from "./constants.mjs";

const containerEl = document.querySelector("#js-products");
const sortByEl = document.querySelector("#js-sort-by");

let products = [];

setup();

function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  if (!containerEl || !sortByEl) {
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
  createProductsListEl(products);
});

async function getProducts() {
  clearNode(containerEl);
  createLoadingSkeleton();

  try {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    products = data;

    sortByPriceDescending();
    createProductsListEl(products);
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

function productTemplate({
  id,
  title = "Unknown Item",
  imgUrl,
  imgAl,
  price = 0,
  description = "Missing description",
  index,
}) {
  return `
    <article class="product-details animate__animated animate__fadeInUp animate__delay-${index}s">
      <div class="product-image">
        <img src="${imgUrl}" alt="${imgAl}" />
      </div>

      <div class="product-info">
        <h1 class="product-title">${title}</h1>
        <div class="product-rating">
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9734;</span>
          <span>(123 reviews)</span>
        </div>
        <div class="product-price">${price} ${CURRENCY}</div>
        <div class="product-description">
          <p>
            ${description}
          </p>
        </div>
        <button class="add-to-cart" id="js-add-to-cart-${id}">Add to Cart</button>
      </div>
    </article>
 `;
}

function productSkeletonTemplate() {
  return `
  <article class="product-details">
    <div class="product-image">
      <div class="skeleton skeleton-image"></div>
    </div>
    <div class="product-info">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-rating"></div>
      <div class="skeleton skeleton-price"></div>
      <div class="skeleton skeleton-description"></div>
      <div class="skeleton skeleton-button"></div>
    </div>
  </article>
 `;
}

function createLoadingSkeleton(count = 3) {
  [...Array(count)].forEach(() => {
    const template = productSkeletonTemplate();
    const newEl = createHTML(template);
    containerEl.append(newEl);
  });
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
function createProductsListEl(list = products) {
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
    containerEl.append(newEl);
  });
}

function sortByPriceDescending() {
  products.sort((a, b) => {
    return a.price - b.price;
  });
}

function sortByPriceAscending() {
  products.sort((a, b) => {
    return b.price - a.price;
  });
}
