describe("Checkout", () => {});

it("full-checkout", function () {
  cy.visit("");
  cy.get("#js-add-to-cart-b4eaa52e-2efe-4075-9772-e0c6d7ba04bb").click();
  cy.get("#js-add-to-cart-97e77845-a485-4301-827f-51b673d4230f").click();
  cy.get("#js-cart-count").click();
  cy.get(
    `${getItemControllerSelector(1)} > [data-btn="increaseQuantity"]`,
  ).click();
  cy.get(
    `${getItemControllerSelector(1)} > [data-btn="increaseQuantity"]`,
  ).click();
  cy.get(
    `${getItemControllerSelector(2)} > [data-btn="increaseQuantity"]`,
  ).click();
  cy.get(
    `${getItemControllerSelector(2)} > [data-btn="increaseQuantity"]`,
  ).click();
  cy.get(
    `${getItemControllerSelector(2)} > [data-btn="decreaseQuantity"]`,
  ).click();
  cy.get(
    `${getItemControllerSelector(1)} > [data-btn="decreaseQuantity"]`,
  ).click();
  cy.get(
    `${getItemControllerSelector(2)} > [data-btn="increaseQuantity"]`,
  ).click();
  cy.get(
    `${getItemControllerSelector(2)} > [data-btn="increaseQuantity"]`,
  ).click();
  cy.get("#js-add-to-cart-ff94a6eb-524b-4a56-b326-92fd13ee0918").click();
  cy.get("#\\39 7e77845-a485-4301-827f-51b673d4230f").click();
  cy.contains("Checkout").click();
  cy.url().should("include", "checkout");
  cy.get("#name").type("Test user");
  cy.get("#address").type("St. Hanshaguen 2");
  cy.get("#city").type("Oslo");
  cy.get("#zip").type("2192");
  cy.get(":nth-child(11) > input").type("credit-card");
  cy.get("#js-checkout-form > :nth-child(11)").click();
  cy.get(":nth-child(11) > input").check();
  cy.get("#cardNumber").type("7865784617893");
  cy.get("#card-name").type("NM Test");
  cy.get("#cvv").type("215");
  cy.get('[type="submit"]').click();
  cy.get("body").click();
  cy.get("form").submit();
  cy.url().should("include", "order-confirmation");
  cy.contains("Thank You for Your Order!");
  cy.contains("Continue Shopping").click();
});

function getItemControllerSelector(n = 1) {
  return `:nth-child(${n}) > .c-cart-item_controls > .c-cart-item_quantity-container`;
}
