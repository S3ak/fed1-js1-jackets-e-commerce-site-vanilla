import { calcTotal, getItemsFromStorage } from "../cart.mjs";
import { CURRENCY } from "../constants.mjs";
import { clearNode, createHTML, setLocalItem } from "../utils.mjs";

const orderSummaryEl = document.querySelector("#js-order-summary");
const totalEl = document.querySelector("#js-total");
/** @type {HTMLFormElement} */
const checkoutFormEl = document.forms.checkout;

setup();

async function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  // FIXME: This should be a function that accepts all DOM element that contain an ID with the predix JS
  if (!orderSummaryEl || !totalEl || !checkoutFormEl) {
    // Log an error message if either element is missing
    console.warn("JS cannot run!!!");
  } else {
    // NOTE firt we get products in the cart from local localstorage and then we render them and we get the total

    /** @type {Array<ProductDetails>} - The list of products to display. Each product should be an object with the following properties: */
    const cartProducts = getItemsFromStorage();
    renderCartProducts(cartProducts);
    const total = calcTotal(cartProducts);

    totalEl.textContent = `${CURRENCY} ${total}`;

    checkoutFormEl.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(checkoutFormEl);
      const name = formData.get("name");
      const address = formData.get("address");
      const city = formData.get("city");
      const zip = formData.get("zip");
      const payment = formData.get("payment");
      const cardNumber = formData.get("cardNumber");
      const cardName = formData.get("card-name");
      const expiry = formData.get("expiry");
      const cvv = formData.get("cvv");

      try {
        const response = await sendToAPI({
          name: name,
          address: address,
          city: city,
          zip: zip,
          payment: payment,
          cardNumber: cardNumber,
          cardName: cardName,
          expiry: expiry,
          cvv: cvv,
        });

        setLocalItem("shippingInfo", {
          name,
          address,
          city,
          zip,
        });
        console.log(response);
      } catch (error) {
        console.error(error?.message);
      }

      window.location = "/order-confirmation.html";
    });
  }
}

/**
 * Renders the list of cart products into the order summary element.
 *
 * @param {Array<ProductDetails>} [list=[]] - The list of cart products to render.
 */
function renderCartProducts(list = []) {
  clearNode(orderSummaryEl);

  list.forEach((cartProduct) => {
    const cartProductTemplate = createCartProductTemplate(cartProduct);
    const cartProductEl = createHTML(cartProductTemplate);
    orderSummaryEl.append(cartProductEl);
  });
}

function createCartProductTemplate({ title, price, quantity }) {
  return `
		<div class="product">
			<p>${title}</p>
			<p>${CURRENCY} ${price} x ${quantity}</p>
		</div>
`;
}

/**
 * @typedef {Object} AddProductResponse
 * @property {string} id - Unique identifer.
 */

/**
 * Sends the provided payload to the API.
 *
 * @param {Object} detailsPayload - The payload to be sent to the API.
 * @returns {Promise<AddProductResponse|string>} The response from the API as a JSON object, or "Success" if an error occurs.
 * @throws {Error} If the fetch operation fails.
 */
async function sendToAPI(detailsPayload) {
  try {
    const res = await fetch("https://dummyjson.com/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(detailsPayload),
    });
    const json = await res.json();

    return json;
  } catch (error) {
    console.error(error?.message);
  }
  return "Success";
}
