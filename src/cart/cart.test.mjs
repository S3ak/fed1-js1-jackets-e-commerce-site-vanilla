import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderItems } from "./cart.mjs";
import { clearNode, createHTML } from "../utils.mjs";
import cartItemTemplate from "./cart.template.mjs";
import { calcTotal } from "./utils.mjs";

vi.mock("../utils.mjs", () => ({
  clearNode: vi.fn(),
  createHTML: vi.fn(),
}));

vi.mock("./cart.template.mjs", () => ({
  default: vi.fn(),
}));

vi.mock("./utils.mjs", () => ({
  calcTotal: vi.fn(),
}));

describe("renderItems", () => {
  let cartItemsEl;
  let totalEl;

  beforeEach(() => {
    document.body.innerHTML = `
    <aside class="c-cart" id="js-cart">
      <div class="c-cart-header">
        <h2>Shopping Cart</h2>
        <button class="c-close-cart" id="js-close-cart">&times;</button>
      </div>
      <div class="c-cart-items" id="js-cart-items"></div>
      <div class="c-cart-footer">
        <p>Total: <span id="js-cart-total">0</span></p>

        <button class="c-add-to-cart">Checkout</button>
        <button class="btn" id="js-clear-cart">Clear Cart</button>
      </div>
    </aside>
    `;
    cartItemsEl = document.querySelector("#js-cart-items");
    totalEl = document.querySelector("#js-cart-total");
  });

  it("should clear the cart items element", () => {
    renderItems([], cartItemsEl, totalEl);
    expect(clearNode).toHaveBeenCalledWith(cartItemsEl);
  });

  it("should render items correctly", () => {
    const items = [
      { id: "1", imgUrl: "img1.jpg", title: "Item 1", price: 10, quantity: 2 },
      { id: "2", imgUrl: "img2.jpg", title: "Item 2", price: 20, quantity: 1 },
    ];

    cartItemTemplate.mockImplementation(
      ({ id, imgUrl, title, price, quantity, subTotal }) => `
      <div id="item-${id}">
        <img src="${imgUrl}" alt="${title}">
        <h3>${title}</h3>
        <p>Price: ${price}</p>
        <p>Quantity: ${quantity}</p>
        <p>Subtotal: ${subTotal}</p>
        <button data-btn="remove" id="${id}">Remove</button>
        <button data-btn="increaseQuantity" data-id="${id}">Increase</button>
        <button data-btn="decreaseQuantity" data-id="${id}">Decrease</button>
      </div>
    `,
    );

    createHTML.mockImplementation((template) => {
      const div = document.createElement("div");
      div.innerHTML = template;
      return div.firstElementChild;
    });

    renderItems(items, cartItemsEl, totalEl);

    expect(cartItemsEl.children.length).toBe(2);
    expect(cartItemsEl.innerHTML).toContain("Item 1");
    expect(cartItemsEl.innerHTML).toContain("Item 2");
  });

  it("should calculate and render the total", () => {
    const items = [
      { id: "1", imgUrl: "img1.jpg", title: "Item 1", price: 10, quantity: 2 },
      { id: "2", imgUrl: "img2.jpg", title: "Item 2", price: 20, quantity: 1 },
    ];

    calcTotal.mockReturnValue(40);

    renderItems(items, cartItemsEl, totalEl);

    expect(calcTotal).toHaveBeenCalledWith(items);
    expect(totalEl.textContent).toBe("40");
  });
});
