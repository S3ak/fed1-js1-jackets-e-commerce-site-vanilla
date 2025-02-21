describe("Home >>>", () => {
  beforeEach(() => {
    cy.visit("");
    cy.get("#js-cart-count").contains("0");
    cy.get("#js-products").children().should("have.length", 30);
  });

  it("feat: As a user, I want to view a list of products on the homepage.", () => {
    cy.get("#js-products").find(".c-product-preview-image");
    cy.contains("Green Chili Pepper").should("exist");
    cy.contains(
      "Spicy green chili pepper, ideal for adding heat to your favorite recipes.",
    ).should("exist");
    cy.contains("0.99 kr").should("exist");
  });

  it("feat: As a user, I want to view a single products details.", () => {
    cy.get("#js-products").find(".c-product-preview-image");
    cy.get("a").contains("Green Chili Pepper").click();
    cy.url().should(
      "include",
      "product-details.html?id=26&title=Green+Chili+Pepper",
    );

    cy.get("img").should(
      "have.attr",
      "src",
      "https://cdn.dummyjson.com/products/images/groceries/Green%20Chili%20Pepper/1.png",
    );
    cy.contains("Green Chili Peppe").should("exist");
    cy.contains("0.99 kr").should("exist");
    cy.contains(
      "Spicy green chili pepper, ideal for adding heat to your favorite recipes.",
    ).should("exist");
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
    cy.openCart();
    cy.get("button[data-btn='decreaseQuantity']").click();
    cy.get("#js-cart-count").contains("0");
  });

  it("feat: As a user, I want to clear my basket.", () => {
    cy.contains("Add to Cart").first().click();
    cy.contains("Add to Cart").last().click();
    cy.get("#js-cart-count").contains("2");
    cy.openCart();
    cy.contains("Clear Cart").click();
    cy.get("#js-cart-count").contains("0");
  });

  it("feat: As a user, I order products by price", () => {
    cy.get("#js-products").children().first().contains("0.99 kr");
    cy.get("#js-products").children().last().contains("2499.99 kr");
    cy.get("[name='sort-by']").select("Price high-low");
    cy.get("#js-products").children().should("have.length", 30);
    cy.get("#js-products").children().first().contains("2499.99 kr");
    cy.get("#js-products").children().last().contains("0.99 kr");
    cy.get("[name='sort-by']").select("Price low-high");
    cy.get("#js-products").children().first().contains("0.99 kr");
    cy.get("#js-products").children().last().contains("2499.99 kr");
  });

  it.skip("feat: As a user, I want to filter products by gender", () => {
    cy.contains("The Women's Rainy Days Venture jacket ").should("exist");
    cy.select("[name='gender']").select("men");
    cy.contains("The Women's Rainy Days Venture jacket ").should("not.exist");
  });
});
