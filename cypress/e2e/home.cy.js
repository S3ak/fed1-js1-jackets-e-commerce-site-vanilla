describe("Home", () => {
  it("feat: As a user, I want to view a list of products on the homepage.", () => {
    cy.visit("");
    cy.get("#js-products").children().should("have.length", 12);
    cy.get("#js-products").find(".c-product-preview-image");
    cy.contains("Rainy Days Thunderbolt Jacket").should("exist");
    cy.contains(
      "The Women's Rainy Days Thunderbolt jacket is a sleek and stylish waterproof jacket perfect for any outdoor adventure.",
    ).should("exist");
    cy.contains("139.99 kr").should("exist");
  });

  it("feat: As a user, I want to add a product to my basket.", () => {
    cy.visit("");
    cy.get("#js-cart-count").contains("0");
    cy.contains("Add to Cart").first().click();
    cy.get("#js-cart-count").contains("1");
    cy.contains("Add to Cart").last().click();
    cy.get("#js-cart-count").contains("2");
  });

  it("feat: As a user, I want to remove a product from my basket.", () => {
    cy.visit("");
    cy.get("#js-cart-count").contains("0");
    cy.contains("Add to Cart").first().click();
    cy.get("#js-cart-count").contains("1");
    cy.get("#js-cart-toggle").click();
    cy.contains("Remove").click();
    cy.get("#js-cart-count").contains("0");
  });

  it.skip("feat: As a user, I want to filter products by category, gender or genre", () => {
    cy.visit("");
  });
  it.skip("feat: As a user, I want to view an order-confirmation screen after checking out", () => {
    cy.visit("");
  });
  it.skip("feat: As a user, I want to view a summary of my cart on the checkout page", () => {
    cy.visit("");
  });
});
