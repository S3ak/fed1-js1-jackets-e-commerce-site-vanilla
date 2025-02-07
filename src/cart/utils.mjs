/**
 * Calculates the total price of items in the cart.
 *
 * @param {Array} items - An array of items, where each item is an object with `quantity` and `price` properties.
 * @param {number} items[].quantity - The quantity of the item.
 * @param {number} items[].price - The price of a single unit of the item.
 * @returns {string} The total price of all items in the cart, formatted as a string with two decimal places.
 */
export function calcTotal(products = []) {
  let newTotal = 0;

  if (products.length > 0) {
    newTotal = products.reduce(
      // We need to calc the total number of products including their qauntities. NB; BODMAS
      (total, product) => product.quantity * product.price + total,
      0,
    );
  }

  return newTotal.toFixed(2);
}

/**
 * Decreases the quantity of an item in the cart. If the quantity reaches zero, the item is removed from the cart.
 *
 * @param {Array} items - The array of cart items.
 * @param {string|number} id - The ID of the item to decrease the quantity of.
 * @param {Function} updateComponentStateCB - Callback function to update the component state with the new items array.
 */
export function decreaseQuantity(items = [], id, updateComponentStateCB) {
  let newItems = [];

  const foundIndex = items.findIndex((item) => item.id === id);

  if (foundIndex === -1) {
    return;
  }

  items[foundIndex].quantity--;

  if (items[foundIndex].quantity <= 0) {
    newItems = items.filter((i) => i.id !== items[foundIndex].id);
  } else {
    newItems = items;
  }

  updateComponentStateCB(newItems);
}
