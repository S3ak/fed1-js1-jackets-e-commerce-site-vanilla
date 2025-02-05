import { CURRENCY, ERROR_MESSAGE_DEFAULT, API_URL } from "./constants.mjs";
import { clearNode, createHTML } from "./utils.mjs";

const containerEl = document.querySelector("#js-product-details");

setup();

function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  if (!containerEl) {
    // Log an error message if either element is missing
    console.error("JS cannot run!!!");
  } else {
    // If both elements exist, call the setup function to initialize the application

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

    fetchProductDetails(id);
  }
}

async function fetchProductDetails(productId) {
  try {
    if (!productId) {
      throw new Error("No Product Id was supplied");
    }

    const response = await fetch(`${API_URL}/${productId}`);
    const { data } = await response.json();
    const { image, title, price, description } = data;

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
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

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
