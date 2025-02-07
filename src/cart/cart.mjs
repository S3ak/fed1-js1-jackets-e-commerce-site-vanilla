import { createHTML, clearNode } from "../utils.mjs";
import cartItemTemplate from "./cart.template.mjs";
import { calcTotal, decreaseQuantity } from "./utils.mjs";

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

    renderItems(products, cartItemsEl, totalEl);
  }
}

export function addToCart({ id, imgUrl, price, title }) {
  const products = getItemsFromStorage();

  // Remeber findIndex qill give us -1 if nothing is found.
  const foundProductIndex = products.findIndex((item) => {
    return item.id === id;
  });

  // if the product doesn't already exist in our cart then add it to the cart else change the quantity;
  // NB: -1 is a truthy value
  if (foundProductIndex === -1) {
    products.push({
      id,
      title,
      imgUrl,
      price,
      quantity: 1,
    });
  } else {
    products[foundProductIndex].quantity++;
  }

  updateComponentState(products, cartItemsEl, totalEl);
}

function clearCart() {
  updateComponentState([], cartItemsEl);
}

function removeProductItem(items = [], selectedItemId) {
  const filteredItems = items.filter((i) => i.id !== selectedItemId);
  // TODO: We need to remove the event listeners;

  updateComponentState(filteredItems, cartItemsEl, totalEl);
}

function renderTotal(val = "", el) {
  if (!el) {
    const err = new Error("The HTML DOM element is not present");
    console.error(err);
    return;
  }

  el.textContent = val;
}

export function renderItems(items = [], el, totalEl) {
  clearNode(el);

  items.forEach(({ id, imgUrl, title, price, quantity }) => {
    const subTotal = (price * quantity).toFixed(2);

    const template = cartItemTemplate({
      id,
      imgUrl,
      title,
      price,
      quantity,
      subTotal,
    });

    const productItemEl = createHTML(template);
    const removeBtnEl = productItemEl.querySelector('[data-btn="remove"]');
    const increaseBtnEl = productItemEl.querySelector(
      '[data-btn="increaseQuantity"]',
    );
    const decreaseBtnEl = productItemEl.querySelector(
      '[data-btn="decreaseQuantity"]',
    );

    removeBtnEl.addEventListener("click", (event) => {
      removeProductItem(items, event.target.id);
    });

    increaseBtnEl.addEventListener("click", (event) => {
      increaseQuantity(items, event.target.dataset.id);
    });

    decreaseBtnEl.addEventListener("click", (event) => {
      decreaseQuantity(items, event.target.dataset.id, items);
    });

    el.append(productItemEl);
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

function increaseQuantity(items = [], id) {
  const foundIndex = items.findIndex((item) => item.id === id);
  if (foundIndex === -1) {
    return;
  }

  items[foundIndex].quantity++;

  updateComponentState(items, cartItemsEl, totalEl);
}

export function updateComponentState(state, el, totalEl) {
  setItemsToStorage(state);

  renderItems(state, cartItemsEl, totalEl);
}
