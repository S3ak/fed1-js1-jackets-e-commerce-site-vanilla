/**
 * This module handles the functionality of the shopping cart for an e-commerce site.
 * It includes functions to add, remove, and update products in the cart, as well as
 * rendering the cart items and calculating the total price.
 *
 * @module cart
 */

/**
 * @typedef {Object} CartProduct
 * @property {string} product.id - The unique identifier of the product.
 * @property {string} product.imgUrl - The URL of the product image.
 * @property {number} product.price - The price of the product.
 * @property {string} product.title - The title of the product.
 * @property {number} [product.quantity=1] - The quantity of the product to add to the cart.
 */

import { MEDIA_QUERIES } from "./constants.mjs";
import { createHTML, clearNode, isBrowser } from "./utils.mjs";

const cartToggleBtnEl = document.querySelector("#js-cart-toggle");
const cartEl = document.querySelector("#js-cart");
const cartCloseBtnEl = document.querySelector("#js-close-cart");
const cartItemsEl = document.querySelector("#js-cart-items");
const clearCartBtnEl = document.querySelector("#js-clear-cart");
const totalEl = document.querySelector("#js-cart-total");
const cartCounterEl = document.querySelector("#js-cart-count");

setup();

function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  if (
    !cartToggleBtnEl ||
    !cartEl ||
    !cartCloseBtnEl ||
    !cartItemsEl ||
    !clearCartBtnEl ||
    !cartCounterEl ||
    !isBrowser()
  ) {
    // Log an error message if either element is missing
    console.error("Elements are not avalible");
  } else {
    onResizeScreen();
    // If both elements exist, call the setup function to initialize the application

    cartToggleBtnEl.addEventListener("click", toggleCartVisibility);
    cartCloseBtnEl.addEventListener("click", toggleCartVisibility);
    clearCartBtnEl.addEventListener("click", clearCart);

    window.addEventListener("resize", onResizeScreen);

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
  quantity = 1,
  subTotal = price,
}) {
  return `
   <div class="c-cart-item">
    <section class="c-cart-item_row-first">
    
    <a href="/product-details.html?id=${id}">
      <img src="${imgUrl}" alt="${alt}" />
    </a>
    
    <h4>${title}</h4>
    
    <strong class="c-cart-item_price">${price}</strong>
    
    <p class="c-cart-item_quantity-total">(${subTotal})</p>
    
    </section>

    <section class="c-cart-item_controls">
      <button class="c-cart-item_remove" data-btn="remove" data-id="${id}">Remove</button>

      <div class="c-cart-item_quantity-container">
        <button class="c-cart-item_remove" data-btn="decreaseQuantity" data-id="${id}">-</button>
        
        <p class="c-cart-item_quantity">${quantity}</p>
        
        <button class="c-cart-item_remove" data-btn="increaseQuantity" data-id="${id}">+</button>
      </div>
    </section>
   </div>
  `;
}

/**
 * Adds a product to the cart. If the product already exists in the cart, it updates the quantity.
 *
 * @param {CartProduct} CartProduct - The product to add to the cart.
 */
export function addToCart({ id, imgUrl, price, title, quantity = 1 }) {
  const products = getItemsFromStorage();

  // Remeber findIndex qill give us -1 if nothing is found.
  const foundProductIndex = products.findIndex((item) => item.id === id);

  // if the product doesn't already exist in our cart then add it to the cart else change the quantity;
  // NB: -1 is a truthy value
  if (foundProductIndex === -1) {
    products.push({
      id,
      title,
      imgUrl,
      price,
      quantity,
    });
    // NOTE: IF there is a product already in the cart we need to update the existing quantity
  } else {
    products[foundProductIndex].quantity += quantity;
  }

  setItemsToStorage(products);

  renderItems(products);
}

export function clearCart() {
  setItemsToStorage([]);
  renderItems([]);
}

function removeProductItem(items = [], selectedItemId) {
  const filteredItems = items.filter((i) => i.id !== selectedItemId);
  // TODO: We need to remove the event listeners;
  setItemsToStorage(filteredItems);

  renderItems(filteredItems);
}

export function calcTotal(items = []) {
  let newTotal = 0;

  if (items.length > 0) {
    newTotal = items.reduce(
      // We need to calc the total number of products including their qauntities. NB; BODMAS
      (total, item) => item.quantity * item.price + total,
      0,
    );
  } else {
    return 0;
  }

  return newTotal.toFixed(2);
}

function renderTotal(val, el) {
  el.textContent = val;
}

function renderItems(items = []) {
  clearNode(cartItemsEl);

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
      decreaseQuantity(items, event.target.dataset.id);
    });

    cartItemsEl.append(productItemEl);
  });

  const total = calcTotal(items);
  renderCount(items, cartCounterEl);
  renderTotal(total, totalEl);
}

export function getItemsFromStorage() {
  return JSON.parse(window.localStorage.getItem("cart")) ?? [];
}

export function setItemsToStorage(items = []) {
  window.localStorage.setItem("cart", JSON.stringify(items));
}

function toggleCartVisibility() {
  cartEl.classList.toggle("is-open");
}

function increaseQuantity(items = [], id) {
  const foundIndex = items.findIndex((item) => item.id === Number(id));
  if (foundIndex === -1) {
    return;
  }

  items[foundIndex].quantity++;
  setItemsToStorage(items);

  renderItems(items);
}

function decreaseQuantity(items = [], id) {
  const foundIndex = items.findIndex((item) => item.id === Number(id));
  let newItems = [];

  if (foundIndex === -1) {
    return;
  }

  items[foundIndex].quantity--;

  if (items[foundIndex].quantity <= 0) {
    newItems = items.filter((i) => i.id !== items[foundIndex].id);
  } else {
    newItems = items;
  }

  setItemsToStorage(newItems);

  renderItems(newItems);
}

/**
 * Updates the text content of a given HTML element with the total quantity of items.
 *
 * @param {Array<CartProduct>} [items=[]] - An array of item objects, each containing a `quantity` property.
 * @param {HTMLElement} [el=document.createElement()] - The HTML element whose text content will be updated.
 */
function renderCount(items = [], el = document.createElement()) {
  const newCount = items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  el.textContent = newCount;
}

/**
 * Handles the screen resize event and toggles the cart element's visibility
 * based on the window's width.
 *
 * If the window's width is desktop size or more, the cart element will be open
 */
function onResizeScreen() {
  const isBelowMobileBreakpoint = window.innerWidth < MEDIA_QUERIES.l;

  if (!isBelowMobileBreakpoint) {
    cartEl.classList.add("is-open");
  }
}
