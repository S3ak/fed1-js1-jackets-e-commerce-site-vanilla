describe("Home >>>", () => {
  beforeEach(() => {
    cy.visit("");
    cy.get("#js-cart-count").contains("0");
    cy.get("#js-products").children().should("have.length", 12);
  });

  it("feat: As a user, I want to view a list of products on the homepage.", () => {
    cy.get("#js-products").find(".c-product-preview-image");
    cy.contains("Rainy Days Thunderbolt Jacket").should("exist");
    cy.contains(
      "The Women's Rainy Days Thunderbolt jacket is a sleek and stylish waterproof jacket perfect for any outdoor adventure.",
    ).should("exist");
    cy.contains("139.99 kr").should("exist");
  });

  it("feat: As a user, I want to view a single products details.", () => {
    cy.get("#js-products").find(".c-product-preview-image");
    cy.get("a").contains("Rainy Days Venture Jacket").click();

    cy.get("img").should(
      "have.attr",
      "src",
      "https://static.noroff.dev/api/rainy-days/10-venture-jacket.jpg",
    );
    cy.contains("Rainy Days Venture Jacket").should("exist");
    cy.contains("99.99 kr").should("exist");
    cy.contains(
      "The Women's Rainy Days Venture jacket is a lightweight and packable rain jacket that is perfect for travel.",
    ).should("exist");
    cy.contains("Rainy Days Venture Jacket").should("exist");
    cy.get("[name='size']").should("exist");
    cy.get("[name='quantity']").should("exist");
    cy.contains("Add to Cart").should("exist");
  });

  it("feat: As a user, I want to add a product to my basket.", () => {
    cy.contains("Add to Cart").first().click();
    cy.get("#js-cart-count").contains("1");
    cy.contains("Add to Cart").last().click();
    cy.get("#js-cart-count").contains("2");
  });

  it("feat: As a user, I want to remove a product from my basket.", () => {
    cy.contains("Add to Cart").first().click();
    cy.get("#js-cart-count").contains("1");
    cy.get("#js-cart-toggle").click({ force: true });
    cy.contains("Remove").click();
    cy.get("#js-cart-count").contains("0");
  });

  it("feat: As a user, I order products by price", () => {
    cy.get("#js-products").children().first().contains("99.99 kr");
    cy.get("#js-products").children().last().contains("179.99 kr");
    cy.get("[name='sort-by']").select("Price high-low");
    cy.get("#js-products").children().should("have.length", 12);
    cy.get("#js-products").children().first().contains("179.99 kr");
    cy.get("#js-products").children().last().contains("99.99 kr");
    cy.get("[name='sort-by']").select("Price low-high");
    cy.get("#js-products").children().first().contains("99.99 kr");
    cy.get("#js-products").children().last().contains("179.99 kr");
  });

  it.skip("feat: As a user, I want to filter products by gender", () => {
    cy.contains("The Women's Rainy Days Venture jacket ").should("exist");
    cy.select("[name='gender']").select("men");
    cy.contains("The Women's Rainy Days Venture jacket ").should("not.exist");
  });
});
