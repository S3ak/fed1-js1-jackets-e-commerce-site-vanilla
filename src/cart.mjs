import { createHTML, clearNode } from "./utils.mjs";

const cartToggleBtnEl = document.querySelector("#js-cart-toggle");
const cartEl = document.querySelector("#js-cart");
const cartCloseBtnEl = document.querySelector("#js-close-cart");
const cartItemsEl = document.querySelector("#js-cart-items");

setup();

function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  if (!cartToggleBtnEl || !cartEl || !cartCloseBtnEl || !cartItemsEl) {
    // Log an error message if either element is missing
    console.error("JS cannot run!!!");
  } else {
    // If both elements exist, call the setup function to initialize the application

    cartToggleBtnEl.addEventListener("click", toggleCartVisibility);
    cartCloseBtnEl.addEventListener("click", toggleCartVisibility);

    const products = getItemsFromStorage();

    renderItems(products);
  }
}

function cartItemTemplate({
  imgUrl = "",
  title = "Unknown",
  price = 0,
  alt = "No Alt provided",
}) {
  return `
   <div class="c-cart-item">
    <section class="c-cart-item_row-first">
    <img src="${imgUrl}" alt="${alt}" />
    <h4>${title}</h4>
    <strong class="c-cart-item_price">${price}</strong>
    </section>

    <section>
      <button class="c-cart-item_remove">Remove</button>
    </section>
   </div>
  `;
}

export function addToCart({ id, imgUrl, price, title }) {
  const products = getItemsFromStorage();

  products.push({
    id,
    title,
    imgUrl,
    price,
  });

  setItemsToStorage(products);

  renderItems(products);
}

function renderItems(items = []) {
  clearNode(cartItemsEl);

  items.forEach(({ imgUrl, title, price }) => {
    const template = cartItemTemplate({
      imgUrl,
      title,
      price,
    });

    const productItemEl = createHTML(template);
    cartItemsEl.append(productItemEl);
  });
}

function getItemsFromStorage() {
  return JSON.parse(window.localStorage.getItem("cart")) ?? [];
}

function setItemsToStorage(items = []) {
  window.localStorage.setItem("cart", JSON.stringify(items));
}

function toggleCartVisibility() {
  cartEl.classList.toggle("is-open");
}
