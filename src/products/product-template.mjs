import { CURRENCY } from "../constants.mjs";

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
