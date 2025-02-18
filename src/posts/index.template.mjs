import { API_IMAGES } from "../constants.mjs";

/**
 * Generates an HTML template for a users post preview.
 *
 * @param {import("../types.mjs").Post} product - The product details.
 * @param {string} product.id - The unique identifier for the product.
 */
export default function createPostPreviewTemplate(
  {
    id = "",
    title = "Unknown Item",
    userId = "",
    body = "Nothing to see here...",
    views = 0,
  },
  index,
) {
  const paramsString = `id=${id}&userId=${userId}`;
  const searchParams = new URLSearchParams(paramsString);
  const detailsUrl = `/post.html?${searchParams.toString()}`;
  const imgUrl = `${API_IMAGES}/150`;
  const imgAl = "A blank grey block";

  return `
    <article class="c-product-preview-details animate__animated animate__fadeInUp animate__delay-${index}s" data-productId="${id}" data-component="productPreviewDetails">
      <a href=${detailsUrl} class="c-post-preview-image">
        <img src="${imgUrl}" alt="${imgAl}" />
      </a>  

      <section class="c-product-preview-info">
        <h1 class="c-product-preview-title">
          <a href=${detailsUrl}>${title}</a>
        </h1>

        <div class="c-product-preview-price">${views}</div>
        <div class="c-product-preview-description">
          <p>
            ${body}
          </p>
        </div>
      </section>
    </article>
 `;
}
