export default function cartItemTemplate({
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
      <button class="c-cart-item_remove" data-btn="remove" id="${id}">Remove</button>

      <div class="c-cart-item_quantity-container">
        <button class="c-cart-item_remove" data-btn="decreaseQuantity" data-id="${id}">-</button>
        
        <p class="c-cart-item_quantity">${quantity}</p>
        
        <button class="c-cart-item_remove" data-btn="increaseQuantity" data-id="${id}">+</button>
      </div>
    </section>
   </div>
  `;
}
