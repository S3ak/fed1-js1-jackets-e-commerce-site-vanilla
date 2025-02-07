import { describe, it, expect, beforeEach, vi } from "vitest";
import { createProductsListEl } from "./index.mjs";
import { clearNode, createHTML } from "./utils.mjs";
import { addToCart } from "./cart/cart.mjs";

vi.mock("./utils.mjs", () => ({
  clearNode: vi.fn(),
  createHTML: vi.fn(),
}));

vi.mock("./cart.mjs", () => ({
  addToCart: vi.fn(),
}));

describe("createProductsListEl", () => {
  let containerEl;

  beforeEach(() => {
    document.body.innerHTML = `<section>
        <section class="c-filters">
          <form>
            <select name="sort-by" id="js-sort-by">
              <option value="asc">Price low-high</option>
              <option value="dec">Price high-low</option>
            </select>
          </form>
        </section>
        <div id="js-products" class="products-list"></div>
      </section>`;
    containerEl = document.querySelector("#js-products");
  });

  it("should clear the container element", () => {
    createProductsListEl([], containerEl);
    expect(clearNode).toHaveBeenCalledWith(containerEl);
  });

  it("should create and append product elements to the container", () => {
    const products = [
      {
        id: "1",
        title: "Product 1",
        image: { url: "img1.jpg", alt: "Image 1" },
        price: 100,
        description: "Description 1",
      },
      {
        id: "2",
        title: "Product 2",
        image: { url: "img2.jpg", alt: "Image 2" },
        price: 200,
        description: "Description 2",
      },
    ];

    createHTML.mockImplementation((template) => {
      const div = document.createElement("div");
      div.innerHTML = template;
      return div.firstElementChild;
    });

    createProductsListEl(products, containerEl);

    expect(containerEl.children.length).toBe(products.length);
    products.forEach((product, index) => {
      const productEl = containerEl.children[index];
      expect(productEl.querySelector("h1 a").textContent).toBe(product.title);
      expect(productEl.querySelector("img").src).toContain(product.image.url);
      expect(productEl.querySelector("img").alt).toBe(product.image.alt);
      expect(
        productEl.querySelector(".c-product-preview-price").textContent,
      ).toContain(product.price);
      expect(
        productEl.querySelector(".c-product-preview-description p").textContent,
      ).toBe(product.description);
    });
  });

  it.skip("should add event listener to the add to cart button", () => {
    const products = [
      {
        id: "1",
        title: "Product 1",
        image: { url: "img1.jpg", alt: "Image 1" },
        price: 100,
        description: "Description 1",
      },
    ];

    createHTML.mockImplementation((template) => {
      const div = document.createElement("div");
      div.innerHTML = template;
      return div.firstElementChild;
    });

    createProductsListEl(products, containerEl);

    const addToCartButton = containerEl.querySelector("button");
    addToCartButton.click();

    expect(addToCart).toHaveBeenCalledWith({
      id: "1",
      title: "Product 1",
      imgUrl: "img1.jpg",
      price: 100,
    });
  });
});
