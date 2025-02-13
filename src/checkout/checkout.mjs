import { calcTotal, getItemsFromStorage } from "../cart.mjs";
import { CURRENCY } from "../constants.mjs";
import { clearNode, createHTML, setLocalItem } from "../utils.mjs";

const orderSummaryEl = document.querySelector("#js-order-summary");
const totalEl = document.querySelector("#js-total");
/** @type {HTMLFormElement} */
const checkoutFormEl = document.forms.checkout;

// NOTE firt we get products in the cart from local localstorage and then we render them and we get the total

/** @type {Array<ProductDetails>} - The list of products to display. Each product should be an object with the following properties: */
const cartProducts = getItemsFromStorage();
renderCartProducts(cartProducts);
const total = calcTotal(cartProducts);

totalEl.textContent = `${CURRENCY} ${total}`;

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

if (checkoutFormEl) {
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

async function sendToAPI(details) {
  console.log("FORM details", details);
  alert(JSON.stringify(details));
  return "Success";
}
