const API_URL = "https://v2.api.noroff.dev/rainy-days";
const ERROR_MESSAGE_DEFAULT = "Soemthing went wrong";
const CURRENCY = "kr";

const containerEl = document.querySelector("#js-products");

if (!containerEl) {
  console.error("JS cannot run!!!");
} else {
  setup();
}

function setup() {
  getProducts();
}

async function getProducts() {
  try {
    const response = await fetch(API_URL);
    const { data, meta } = await response.json();
    data.forEach((item) => {
      const template = productTemplate({
        id: item.id,
        title: item.title,
        imgUrl: item.image.url,
        imgAl: item.image.alt,
        price: item.price,
        description: item.description,
      });

      const newEl = createHTML(template);
      containerEl.append(newEl);
    });
  } catch (error) {
    console.error(ERROR_MESSAGE_DEFAULT, error?.message);
  }
}

function productTemplate({ id, title, imgUrl, imgAl, price, description }) {
  return `
 <article class="product-details">
      <div class="product-image">
        <img src="${imgUrl}" alt="${imgAl}" />
      </div>

      <div class="product-info">
        <h1 class="product-title">${title}</h1>
        <div class="product-rating">
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9733;</span>
          <span>&#9734;</span>
          <span>(123 reviews)</span>
        </div>
        <div class="product-price">${price} ${CURRENCY}</div>
        <div class="product-description">
          <p>
            ${description}
          </p>
        </div>
        <button class="add-to-cart" id="js-add-to-cart-${id}">Add to Cart</button>
      </div>
    </article>
 `;
}

function createHTML(template) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(template, "text/html");
  return parsedDocument.body.firstChild;
}
