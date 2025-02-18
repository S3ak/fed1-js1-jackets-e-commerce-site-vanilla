import { setup as setupPosts } from "./posts/index.mjs";

/**
 * @typedef {Object} ProductDetails
 * @property {string} id - Unique identifer.
 * @property {string} title - The name of the product.
 * @property {number} price - The sell price of a product.
 * @property {string} description - The description of the product.
 * @property {Object} image - The image object.
 * @property {string} image.url - The URL of the primary image.
 * @property {string} image.alt - The alt text for the primary image.
 */

const initialState = {
  posts: [],
  comments: [],
  users: [],
};

setup(initialState);

// Every page should have a custom startup event that we can choose to run certain javascript.
async function setup(initialState) {
  console.log("TODO: Manage global state", initialState);
  await setupPosts();
}
