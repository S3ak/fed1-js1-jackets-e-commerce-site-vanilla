describe("Checkout", () => {
  it("feat: As a user, I want to view a list of products from my cart.", () => {
    cy.visit("");
    cy.contains("Add to Cart").first().click();
    cy.contains("Add to Cart").last().click();
    cy.contains("Cart").click();
    cy.contains("Checkout").click();

    cy.get("input[id='name']").type("John Smith");
  });
});
