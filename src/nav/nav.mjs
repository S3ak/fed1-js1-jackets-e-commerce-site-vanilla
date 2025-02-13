import { clearNode, createHTML } from "../utils.mjs";

const containerEl = document.querySelector("#js-nav-container");
const titleSectionEl = document.querySelector("#js-title-section");

const url = window.location.pathname;

const navItems = [
  { label: "Home", href: "/", isActive: true },
  { label: "About", href: "/about.html", isActive: false },
  { label: "Contact Us", href: "/contact.html", isActive: false },
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

renderNav();

mobileNavEl.querySelector("button").addEventListener("click", onMenuToggle);

window.addEventListener("resize", renderNav);

function renderNav() {
  let navEl = document.createElement("span");
  const isBelowMobileBreakpoint = window.innerWidth < 800;

  clearNode(containerEl);

  if (isBelowMobileBreakpoint) {
    menuToggleEl.addEventListener("click", onMenuToggle);

    titleSectionEl.insertBefore(menuToggleEl, null);
    navEl = mobileNavEl;
  } else {
    // Remove the menu button;
    menuToggleEl.remove();
    navEl = desktopNavEl;
  }

  containerEl.append(navEl);
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
