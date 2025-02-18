import { createHTML } from "../utils";

export default function productSkeletonTemplate() {
  return `
  <article class="c-product-preview-details">
    <div class="c-product-preview-image">
      <div class="skeleton skeleton-image"></div>
    </div>
    <div class="c-product-preview-info">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-rating"></div>
      <div class="skeleton skeleton-price"></div>
      <div class="skeleton skeleton-description"></div>
      <div class="skeleton skeleton-button"></div>
    </div>
  </article>
 `;
}

export function createLoadingSkeleton(containerNode, count = 3) {
  [...Array(count)].forEach(() => {
    const template = productSkeletonTemplate();
    const newEl = createHTML(template);
    containerNode.append(newEl);
  });
}
