import { createHTML, clearNode } from "./utils.mjs";

const cartToggleBtnEl = document.querySelector("#js-cart-toggle");
const cartEl = document.querySelector("#js-cart");
const cartCloseBtnEl = document.querySelector("#js-close-cart");
const cartItemsEl = document.querySelector("#js-cart-items");
const clearCartBtnEl = document.querySelector("#js-clear-cart");
const totalEl = document.querySelector("#js-cart-total");

setup();

function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  if (
    !cartToggleBtnEl ||
    !cartEl ||
    !cartCloseBtnEl ||
    !cartItemsEl ||
    !clearCartBtnEl
  ) {
    // Log an error message if either element is missing
    console.error("JS cannot run!!!");
  } else {
    // If both elements exist, call the setup function to initialize the application

    cartToggleBtnEl.addEventListener("click", toggleCartVisibility);
    cartCloseBtnEl.addEventListener("click", toggleCartVisibility);
    clearCartBtnEl.addEventListener("click", clearCart);

    const products = getItemsFromStorage();

    renderItems(products);
  }
}

function cartItemTemplate({
  id,
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
      <button class="c-cart-item_remove" data-btn="remove" id="${id}">Remove</button>
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

function clearCart() {
  setItemsToStorage([]);
  renderItems([]);
}

function removeProductItem(items = [], selectedItemId) {
  const filteredItems = items.filter((i) => i.id !== selectedItemId);

  renderItems(filteredItems);
}

function calcTotal(items = []) {
  const newTotal = items.reduce((total, item) => item.price + total, 0);

  return newTotal.toFixed(2);
}

function renderTotal(val, el) {
  el.textContent = val;
}

function renderItems(items = []) {
  clearNode(cartItemsEl);

  items.forEach(({ id, imgUrl, title, price }) => {
    const template = cartItemTemplate({
      id,
      imgUrl,
      title,
      price,
    });

    const productItemEl = createHTML(template);
    const removeBtnEl = productItemEl.querySelector('[data-btn="remove"]');
    removeBtnEl.addEventListener("click", (event) => {
      removeProductItem(items, event.target.id);
    });

    cartItemsEl.append(productItemEl);
  });

  const total = calcTotal(items);
  renderTotal(total, totalEl);
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
