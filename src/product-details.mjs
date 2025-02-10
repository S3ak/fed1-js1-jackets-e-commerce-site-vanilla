import { CURRENCY, ERROR_MESSAGE_DEFAULT, API_URL } from "./constants.mjs";
import {
  areDOMElementPresent,
  clearNode,
  createHTML,
  getDOMElements,
} from "./utils.mjs";

const DOMElements = getDOMElements(["#js-product-details"]);
const [containerEl] = DOMElements;

setup();

/**
 * Initializes the product details setup process.
 *
 * This function checks for the presence of necessary DOM elements and extracts
 * the 'id' parameter from the URL's query string to render the product details.
 * If the required DOM elements are not found, it logs an error message.
 *
 * @function setup
 * @throws Will log an error message if the required DOM elements are not found.
 */
function setup() {
  try {
    // Check if the containerEl and sortByEl elements exist in the DOM

    if (!areDOMElementPresent(DOMElements)) {
      return;
    }

    /**
     * Extracts the 'id' parameter from the URL's query string.
     * @url https://mollify.noroff.dev/content/feu1/javascript-1/module-5/api-advanced/url-parameters?nav=
     */
    const parameterString = window.location.search;

    /**
     * Creates a URLSearchParams object to work with the query parameters.
     */
    const searchParameters = new URLSearchParams(parameterString);

    /**
     * Retrieves the value of the 'id' parameter from the query string above.
     * @type {string | null}
     */
    const id = searchParameters.get("id");

    renderProductDetails(id, containerEl);
  } catch (error) {
    // Log an error message if either element is missing
    console.error(
      "Could'nt find DOM elements. Please check the HTML",
      error?.message,
    );
  }
}

/**
 * @typedef {Object} ProductDetails
 * @property {string} title - The name of the product.
 * @property {number} price - The sell price of a product.
 * @property {string} description - The description of the product.
 * @property {Object} image - The image object.
 * @property {string} image.url - The URL of the primary image.
 * @property {string} image.alt - The alt text for the primary image.
 */

/**
 * Fetches product details from the API.
 *
 * @param {string} [productId=""] - The ID of the product to fetch details for.
 * @returns {Promise<ProductDetails>} - The product details data.
 * @throws {Error} If no product ID is supplied or if the fetch operation fails.
 */
async function fetchProductDetails(productId = "") {
  try {
    if (!productId) {
      throw new Error("No Product Id was supplied");
    }

    const response = await fetch(`${API_URL}/${productId}`);
    const { data } = await response.json();

    return data;
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

/**
 * Renders the product details into the specified container element.
 *
 * @param {string} productId - The ID of the product to fetch details for.
 * @param {HTMLElement} containerEl - The container element where the product details will be rendered.
 * @returns {Promise<void>} A promise that resolves when the product details have been rendered.
 */
async function renderProductDetails(productId, containerEl) {
  const { image, title, price, description } =
    await fetchProductDetails(productId);

  const template = detailsTemplate({
    primaryImgUrl: image.url,
    alt: image.alt,
    title,
    price,
    description,
  });

  const detailsEl = createHTML(template);
  clearNode(containerEl);
  containerEl.appendChild(detailsEl);
}

/**
 * Generates an HTML template for product details.
 *
 * @param {Object} options - The product details options.
 * @param {string} [options.primaryImgUrl="https://placehold.co/400x500"] - The URL of the primary image.
 * @param {string} [options.title="Unknown Product"] - The title of the product.
 * @param {number} [options.price=0] - The price of the product.
 * @param {string} [options.description="This product doesn't have a discription"] - The description of the product.
 * @param {string} [options.alt="No Description present"] - The alt text for the primary image.
 * @returns {string} The HTML template for the product details.
 */
function detailsTemplate({
  primaryImgUrl = "https://placehold.co/400x500",
  title = "Unknown Product",
  price = 0,
  description = "This product doesn't have a discription",
  alt = "No Description present",
}) {
  return `
    <article>
      <div class="product-images">
        <img
          src=${primaryImgUrl}
          alt=${alt}
          class="main-image"
        />
      </div>

      <div class="product-info">
        <h2>${title}</h2>
        <p class="price">${price} ${CURRENCY}</p>
        <p class="description">${description}</p>

        <form class="purchase-options">
          <label for="size">Size:</label>
          <select id="size" name="size">
            <option value="s">Small</option>
            <option value="m">Medium</option>
            <option value="l">Large</option>
            <option value="xl">XL</option>
          </select>

          <label for="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value="1"
          />

          <button type="submit" class="add-to-cart">Add to Cart</button>
        </form>
      </div>
    </article>
  `;
}
