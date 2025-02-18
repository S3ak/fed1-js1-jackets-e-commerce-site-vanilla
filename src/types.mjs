/**
 * @typedef {Object} Comment
 * @property {string} id - Unique identifier.
 * @property {string} title - The name of the product.
 * @property {number} price - The sell price of a product.
 * @property {string} description - The description of the product.
 * @property {Object} image - The image object.
 * @property {string} image.url - The URL of the primary image.
 * @property {string} image.alt - The alt text for the primary image.
 */

/**
 * @typedef {Object} PostsResponse
 * @property {number} limit - The limit of posts.
 * @property {Post[]} posts - The array of posts.
 * @property {number} skip - The number of posts to skip.
 * @property {number} total - The total number of posts.
 */

/**
 * @typedef {Object} Post
 * @property {string} body - The body of the post.
 * @property {number} id - The unique identifier of the post.
 * @property {Reactions} reactions - The reactions to the post.
 * @property {string[]} tags - The tags associated with the post.
 * @property {string} title - The title of the post.
 * @property {number} userId - The unique identifier of the user who created the post.
 * @property {number} views - The number of views of the post.
 */

/**
 * @typedef {Object} Reactions
 * @property {number} dislikes - The number of dislikes.
 * @property {number} likes - The number of likes.
 */
