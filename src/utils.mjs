/**
 * This is to create DOM elementss safely:
 * @link https://mollify.noroff.dev/content/feu1/javascript-1/module-4/create-html?nav=
 *
 */
export function createHTML(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, "text/html");
  return parsedDocument.body.firstChild;
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export function clearNode(el) {
  removeAllChildNodes(el);
}

/**
 * Retrieves DOM elements based on an array of IDs from a specified container.
 *
 * @param {string[]} ids - An array of string IDs to query within the container. The order matters.
 * @param {HTMLElement} container - The container element to search within. You should default to Document. We can avoid testing complications by passing this in as a element. This ensures that its' a pure function
 * @returns {HTMLElement[]} An array of DOM elements corresponding to the provided IDs. The order matters.
 * @throws {Error} Throws an error if any of the IDs are not strings.
 * @author S3ak
 * @description We need a function to check that all the DOM elements that will be maniupulated by our javascript are present. This is a rudementry dependency check. The reason we have this code is to make testing the code easier to debug;
 */
export const getDOMElements = (ids = [], container = document) => {
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === "string")) {
    throw new Error("All IDs must be strings");
  }

  let DOMElements = [];

  ids.forEach((id) => {
    DOMElements.push(container.querySelector(`${id}`));
  });

  if (DOMElements.length === 0) {
    console.error(
      new Error(
        "Please check the HTML for missing DOM HTML element with the id='js-*'",
      ),
    );

    return false;
  }

  return DOMElements;
};

/**
 * Checks if all provided elements are valid HTMLElements and if the array is not empty.
 *
 * @param {HTMLElement[]} elements - An array of HTMLElements to check.
 * @returns {boolean} - Returns true if the array is not empty and all elements are valid HTMLElements.
 * @throws {Error} - Throws an error if any element in the array is not a valid HTMLElement.
 */
export const areDOMElementPresent = (elements = []) => {
  if (
    !Array.isArray(elements) ||
    !elements.every((el) => el instanceof HTMLElement)
  ) {
    throw new Error("All elements must be valid HTMLElements");
  }

  return elements.length > 0;
};

/**
 * Stores a value in the local storage with the specified key.
 *
 * @param {string} key - The key under which the value will be stored.
 * @param {*} value - The value to be stored in local storage.
 */
export function setLocalItem(key = "", value) {
  window.localStorage.setItem(key, value);
}

/**
 * Retrieves an item from the local storage and parses it as JSON.
 *
 * @param {string} [key=""] - The key of the item to retrieve from local storage.
 * @returns {any} The parsed JSON object from local storage, or null if the key does not exist.
 */
export function getLocalItem(key = "") {
  return JSON.parse(window.localStorage.getItem(key));
}
