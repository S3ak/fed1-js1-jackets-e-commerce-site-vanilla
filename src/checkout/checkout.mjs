import { calcTotal, getItemsFromStorage } from "../cart.mjs";
import { CURRENCY } from "../constants.mjs";
import { clearNode, createHTML } from "../utils.mjs";

const orderSummaryEl = document.querySelector("#js-order-summary");
const totalEl = document.querySelector("#js-total");

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
