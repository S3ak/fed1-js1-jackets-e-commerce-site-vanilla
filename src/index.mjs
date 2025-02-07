import { createHTML, clearNode } from "./utils.mjs";
import {
  API_URL,
  ERROR_MESSAGE_DEFAULT,
  CURRENCY,
  ERROR_MESSAGE_DOM_EL,
} from "./constants.mjs";
import { addToCart } from "./cart/cart.mjs";

const containerEl = document.querySelector("#js-products");
const sortByEl = document.querySelector("#js-sort-by");

let products = [];

setup();

function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  if (!containerEl || !sortByEl) {
    // Log an error message if either element is missing
    console.error(ERROR_MESSAGE_DOM_EL);
  } else {
    // If both elements exist, call the setup function to initialize the application
    getProducts();

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
      createProductsListEl(products, containerEl);
    });
  }
}

export async function getProducts() {
  clearNode(containerEl);
  createLoadingSkeleton();

  try {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    products = data;

    sortByPriceDescending();
    createProductsListEl(products, containerEl);
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
  const detailsUrl = `/product-details.html?id=${id}`;
  return `
    <article class="c-product-preview-details animate__animated animate__fadeInUp animate__delay-${index}s">
      <div class="c-product-preview-image">
        <a href=${detailsUrl}>
          <img src="${imgUrl}" alt="${imgAl}" />
        </a>  
      </div>

      <div class="c-product-preview-info">
        <h1 class="c-product-preview-title">
          <a href=${detailsUrl}>${title}</a>
        </h1>

        <div class="c-product-preview-rating">
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9734;</span>
          <span>(123 reviews)</span>
        </div>
        <div class="c-product-preview-price">${price} ${CURRENCY}</div>
        <div class="c-product-preview-description">
          <p>${description}</p>
        </div>
        <button class="c-add-to-cart" id="js-add-to-cart-${id}">Add to Cart</button>
      </div>
    </article>
 `;
}

function productSkeletonTemplate() {
  return `
  <article class="c-product-preview-details">
    <div class="c-product-preview-image">
      <div class="skeleton skeleton-image"></div>
    </div>
    <div class="c-product-preview-info">
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
export function createProductsListEl(list = [], el) {
  if (!el) {
    console.error(ERROR_MESSAGE_DOM_EL);
    return;
  }

  clearNode(el);

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

    el.append(newEl);
  });
}

export function sortByPriceDescending(list = products) {
  list.sort((a, b) => a.price - b.price);
}

export function sortByPriceAscending(list = products) {
  list.sort((a, b) => b.price - a.price);
}
