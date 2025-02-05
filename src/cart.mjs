import { createHTML, clearNode } from "./utils.mjs";

const cartToggleBtnEl = document.querySelector("#js-cart-toggle");
const cartEl = document.querySelector("#js-cart");
const cartCloseBtnEl = document.querySelector("#js-close-cart");
const cartItemsEl = document.querySelector("#js-cart-items");

let productListCart = [];

setup();

function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  if (!cartToggleBtnEl || !cartEl || !cartCloseBtnEl) {
    // Log an error message if either element is missing
    console.error("JS cannot run!!!");
  } else {
    // If both elements exist, call the setup function to initialize the application

    cartToggleBtnEl.addEventListener("click", toggleCartVisibility);
    cartCloseBtnEl.addEventListener("click", toggleCartVisibility);
    const oldCartItems = JSON.parse(window.localStorage.getItem("cart")) ?? [];
    productListCart = oldCartItems;

    renderItems();
  }
}

function toggleCartVisibility() {
  cartEl.classList.toggle("is-open");
}

export function addToCart({ id = "", imgUrl, price, title }) {
  console.log("Working", id, imgUrl, price, title);
  productListCart.push({
    title,
    imgUrl,
    price,
  });

  window.localStorage.setItem("cart", JSON.stringify(productListCart));

  clearNode(cartItemsEl);

  renderItems();
}

function cartItemTemplate({ imgUrl = "", title = "Unknown", price = 0 }) {
  return `
   <div class="c-cart-item">
    <img src=${imgUrl} alt="" />
    <h4>${title}</h4>
    <strong class="c-cart-item_price">${price}</strong>
   </div>
  `;
}

function renderItems() {
  const newProductListCart =
    JSON.parse(window.localStorage.getItem("cart")) ?? [];

  newProductListCart.forEach((item) => {
    const template = cartItemTemplate({
      imgUrl: item.imgUrl,
      title: item.title,
      price: item.price,
    });

    const productItemEl = createHTML(template);
    cartItemsEl.append(productItemEl);
  });
}
