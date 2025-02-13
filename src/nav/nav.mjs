import { clearNode, createHTML } from "../utils.mjs";

const containerEl = document.querySelector("#js-nav-container");
const headerEl = document.querySelector("header");
const cartEl = document.querySelector("#js-cart-toggle");
const titleSectionEl = document.querySelector("#js-title-section");

const url = window.location.pathname;

const navTemplate = `<a href="/" class="c-nav-link ${getActive(url, "/")}">Products</a>
          <a href="/about.html" class="c-nav-link ${getActive(url, "/about.html")}">About</a>
          <a href="/contact.html" class="c-nav-link ${getActive(url, "/contact.html")}">Contact</a>`;

const desktopTemplate = `
    <nav class="c-nav-container c-nav--desktop">
        ${navTemplate}
    </nav>`;

const mobileTemplate = `
    <aside id="js-aside-menu" class="c-nav-container c-nav--mobile">
        <button id="js-menu-close">Close</button>
        <nav>
            ${desktopTemplate}
        </nav>
    </aside>
`;

const menuToggle = `<button>X</button>`;

const desktopNavEl = createHTML(desktopTemplate);
const mobileNavEl = createHTML(mobileTemplate);
const menuToggleEl = createHTML(menuToggle);

renderNav();

mobileNavEl.querySelector("button").addEventListener("click", onMenuToggle);

window.addEventListener("resize", () => {
  renderNav();
});

function renderNav() {
  if (window.innerWidth < 800) {
    clearNode(containerEl);

    menuToggleEl.addEventListener("click", onMenuToggle);

    titleSectionEl.insertBefore(menuToggleEl, null);
    containerEl.append(mobileNavEl);
  } else {
    // Remove the menu button;
    clearNode(containerEl);

    menuToggleEl.remove();
    containerEl.append(desktopNavEl);
  }
}

function getActive(currentUrl, page) {
  if (currentUrl === page) {
    return "is-active";
  }

  return "";
}

function onMenuToggle() {
  const aside = document.querySelector("#js-aside-menu");
  aside.classList.toggle("is-open");
}
