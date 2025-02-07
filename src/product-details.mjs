import { CURRENCY, ERROR_MESSAGE_DEFAULT, API_URL } from "./constants.mjs";
import { clearNode, createHTML } from "./utils.mjs";
import { addToCart } from "./cart.mjs";

const containerEl = document.querySelector("#js-product-details");

setup();

function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  if (!containerEl) {
    // Log an error message if either element is missing
    console.error("JS cannot run!!!");
  } else {
    // If both elements exist, call the setup function to initialize the application

    const id = getIdFromUrl();

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
    const { image, title, price, description, id } = data;

    localStorage.setItem("imgUrl", image);

    const template = detailsTemplate({
      id,
      primaryImgUrl: image.url,
      alt: image.alt,
      title,
      price,
      description,
    });

    const detailsEl = createHTML(template);

    const formEl = detailsEl.querySelector("form");

    // @url https://mollify.noroff.dev/content/feu1/javascript-1/module-4/managing-web-forms?nav=#form-data
    formEl.addEventListener("submit", (event) => {
      handleFormSubmit(event);
    });

    clearNode(containerEl);
    containerEl.appendChild(detailsEl);
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

function detailsTemplate({
  id = "",
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

        <form class="purchase-options" name="addToCartForm">
           <input name="id" value="${id}" hidden/>
           <input name="imgUrl" value="${primaryImgUrl}" hidden/>
           <input name="price" value="${price}" hidden/>
           <input name="title" value="${title}" hidden/>
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

function handleFormSubmit(event) {
  // NB: Prevent the form from refreshing the page;
  event.preventDefault();

  const formData = new FormData(event.target);

  addToCart({
    id: getIdFromUrl(),
    imgUrl: formData.get("imgUrl"),
    price: formData.get("price"),
    title: formData.get("title"),
    quantity: Number(formData.get("quantity")),
  });
}

function getIdFromUrl() {
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

  return id;
}
