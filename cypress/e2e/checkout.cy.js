describe("Checkout", () => {
  it("full checkout experience >>>", function () {
    cy.visit("");
    cy.get("#js-add-to-cart-26").click();
    cy.get("#js-add-to-cart-21").click();
    cy.openCart();
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
    cy.get("#js-add-to-cart-25").click();
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

  it.skip("feat: As a user, I want to view an order-confirmation screen after checking out", () => {});

  it.skip("feat: As a user, I want to view a summary of my cart on the checkout page", () => {});
});

function getItemControllerSelector(n = 1) {
  return `:nth-child(${n}) > .c-cart-item_controls > .c-cart-item_quantity-container`;
}
