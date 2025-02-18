describe("Home >>>", () => {
  beforeEach(() => {
    cy.visit("");
  });

  it("feat: As a user, I want to view a list of posts on the homepage.", () => {
    cy.get("#js-posts").find(".c-post-preview-image");
    cy.contains("Rainy Days Thunderbolt Jacket").should("exist");
    cy.contains(
      "The Women's Rainy Days Thunderbolt jacket is a sleek and stylish waterproof jacket perfect for any outdoor adventure.",
    ).should("exist");
    cy.contains("139.99 kr").should("exist");
  });
});
