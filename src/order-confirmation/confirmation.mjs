import { setItemsToStorage } from "../cart.mjs";
import { getLocalItem } from "../utils.mjs";

const body = document.querySelector("body");
const nameEl = document.querySelector("#js-name");
const addressEl = document.querySelector("#js-address");

body.addEventListener("click", (event) => {
  const target = event.target;

  if (target.href.includes("http")) {
    setItemsToStorage([]);
  }
});

const shippingInfo = getLocalItem("shippingInfo");

nameEl.textContent = shippingInfo.name;
addressEl.textContent = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zip}`;
