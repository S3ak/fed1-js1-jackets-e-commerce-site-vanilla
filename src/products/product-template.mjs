import { CURRENCY } from "../constants.mjs";

/**
 * Generates an HTML template for a product preview.
 *
 * @param {Object} product - The product details.
 * @param {string} product.id - The unique identifier for the product.
 * @param {string} [product.title="Unknown Item"] - The title of the product.
 * @param {string} product.imgUrl - The URL of the product image.
 * @param {string} product.imgAl - The alt text for the product image.
 * @param {number} [product.price=0] - The price of the product.
 * @param {string} [product.description="Missing description"] - The description of the product.
 * @param {number} product.index - The index of the product in the list.
 * @returns {string} The HTML string for the product preview.
 */
export default function productTemplate({
  id,
  title = "Unknown Item",
  imgUrl,
  imgAl,
  price = 0,
  description = "Missing description",
  index,
}) {
  const paramsString = `id=${id}&title=${title}`;
  const searchParams = new URLSearchParams(paramsString);
  const detailsUrl = `/product-details.html?${searchParams.toString()}`;

  return `
    <article class="c-product-preview-details animate__animated animate__fadeInUp animate__delay-${index}s" data-productId="${id}" data-component="productPreviewDetails">
      <div class="c-product-preview-image">
        <a href=${detailsUrl}>
          <img src="${imgUrl}" alt="${imgAl}" />
        </a>  
      </div>

      <div class="c-product-preview-info">
        <h1 class="c-product-preview-title">
          <a href=${detailsUrl}>${title}</a>
        </h1>

        <div class="c-product-preview-rating">
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9734;</span>
          <span>(123 reviews)</span>
        </div>
        <div class="c-product-preview-price">${price} ${CURRENCY}</div>
        <div class="c-product-preview-description">
          <p>
            ${description}
          </p>
        </div>
        <button class="c-add-to-cart" id="js-add-to-cart-${id}">Add to Cart</button>
      </div>
    </article>
 `;
}
