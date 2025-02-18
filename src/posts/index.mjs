import {
  createHTML,
  clearNode,
  getLocalItem,
  setLocalItem,
} from "../utils.mjs";
import { ERROR_MESSAGE_DEFAULT, API_POSTS } from "../constants.mjs";
import { createLoadingSkeleton } from "../home/product-skeleton-template.mjs";
import createPostPreviewTemplate from "./index.template.mjs";

const containerEl = document.querySelector("#js-posts");
const searchInputNode = document.querySelector("#search");

const CACHED_POSTS_KEY = "posts";

setup();

// Every page should have a custom startup event that we can choose to run certain javascript.
export async function setup() {
  // Check if the containerEl and elements exist in the DOM
  // FIXME: This should be a function that accepts all DOM element that contain an ID with the predix JS
  if (!containerEl || !searchInputNode) {
    // Log an error message if either element is missing
    console.error("JS cannot run!!!");
  } else {
    // If both elements exist, call the setup function to initialize the application
    createLoadingSkeleton(containerEl);

    const { posts } = await fetchPostsFromAPI(API_POSTS);

    renderPostsListEl(posts);

    searchInputNode.addEventListener("input", (event) => {
      // FIXME: this should come from the service products.items;
      const cachedPosts = getLocalItem(CACHED_POSTS_KEY);

      handleSearch(event.target.value, cachedPosts);
    });
  }
}

/**
 * Creates and appends a list of product elements to the container element.
 *
 * @param {Array<import("../types.mjs").Post>} [list=[]] - The list of products to display. Each product should be an object with the following properties:
 */
function renderPostsListEl(list = []) {
  // TODO: Make this a pure function
  clearNode(containerEl);

  list.forEach((post, index) => {
    const template = createPostPreviewTemplate(post, index);

    const newEl = createHTML(template);
    // We dont' add the event listener to the product "add to cart" button because we will have one listener on the list container element

    containerEl.append(newEl);
  });
}

/**
 * Filters a list of products based on a search term and renders the filtered list.
 *
 * @param {string} [searchTerm=""] - The term to search for in the product titles.
 * @param {Array<ProductDetails>} [list=[]] - The list of products to search through.
 */
function handleSearch(searchTerm = "", list = []) {
  const filteredProducts = list.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

  renderPostsListEl(filteredProducts);
}

async function fetchPostsFromAPI(url = API_POSTS) {
  /** @type {Array<import("../types.mjs").Post>} */
  let newPosts = [];
  let error = null;

  try {
    const response = await fetch(url);
    /** @type {import("../types.mjs").PostsResponse} */
    const { posts } = await response.json();
    newPosts = posts;
    setLocalItem(CACHED_POSTS_KEY, posts);
  } catch (err) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
    error = err;
  }

  return {
    posts: newPosts,
    error,
  };
}
