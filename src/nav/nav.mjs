import { clearNode, createHTML } from "../utils.mjs";
import { MEDIA_QUERIES } from "../constants.mjs";

const containerEl = document.querySelector("#js-nav-container");
const titleSectionEl = document.querySelector("#js-title-section");
const navContainerEl = document.querySelector("#js-nav-toggle-container");

const url = window.location.pathname;

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about.html" },
  { label: "Contact Us", href: "/contact.html" },
];

const navTemplate = `
  <nav>
    ${navItems
      .map(({ href, label }) => {
        return `<a href="${href}" class="c-nav-link ${getActive(url, href)}">${label}</a>`;
      })
      .join("")}
  </nav>`;

const desktopTemplate = `
    <section class="c-nav-container c-nav--desktop">
      ${navTemplate}
    </section>`;

const mobileTemplate = `
    <aside id="js-aside-menu" class="c-nav-container c-nav--mobile">
        <button id="js-menu-close">Close</button>
        ${navTemplate}
    </aside>
`;

const menuToggleTemplate = `<button>X</button>`;

const desktopNavEl = createHTML(desktopTemplate);
const mobileNavEl = createHTML(mobileTemplate);
const menuToggleEl = createHTML(menuToggleTemplate);

setup();

function setup() {
  // Check if the containerEl and sortByEl elements exist in the DOM
  if (!containerEl || !titleSectionEl || !navContainerEl) {
    // Log an error message if either element is missing
    console.error("Elements are not avalible");
  } else {
    renderNav();
    navContainerEl.append(menuToggleEl);
    mobileNavEl.querySelector("button").addEventListener("click", onMenuToggle);
    window.addEventListener("resize", renderNav);
  }
}

function renderNav() {
  let navEl = document.createElement("span");

  menuToggleEl.addEventListener("click", onMenuToggle);

  const isBelowMobileBreakpoint = window.innerWidth < MEDIA_QUERIES.s;

  clearNode(containerEl);

  if (isBelowMobileBreakpoint) {
    menuToggleEl.style.display = "flex";
    navEl = mobileNavEl;
  } else {
    // Remove the menu button;
    menuToggleEl.style.display = "none";
    navEl = desktopNavEl;
  }

  containerEl.append(navEl);
}

function getActive(currentUrl, page) {
  if (currentUrl.includes(page)) {
    return "is-active";
  }

  return "";
}

function onMenuToggle() {
  const aside = document.querySelector("#js-aside-menu");
  aside.classList.toggle("is-open");
}
