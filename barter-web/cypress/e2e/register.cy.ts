describe("Register Page", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/auth/register"); 
  });

  it("should show validation errors when submitting empty form", () => {
    cy.contains("Create an account").click();

    cy.contains("First name is required").should("be.visible");
    cy.contains("Last name is required").should("be.visible");
    cy.contains("Email is required").should("be.visible");
    cy.contains("Password must be at least 6 characters").should("be.visible");
    cy.contains("Avatar is required").should("be.visible");
  });

  it("should register a user with valid data", () => {
    // Wprowadź dane
    cy.get('input[placeholder="First name"]').type("Tomasz");
    cy.get('input[placeholder="Last name"]').type("Izdebski");
    cy.get('input[placeholder="Email"]').type(`tomasz${Date.now()}@test.com`);
    cy.get('input[placeholder="Password"]').type("superhaslo");

    // Załaduj avatar i zaakceptuj
    cy.fixture("avatar.jpg", "base64").then((fileContent) => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Blob.base64StringToBlob(fileContent, "image/jpeg"),
        fileName: "avatar.jpg",
        lastModified: Date.now(),
      }, { force: true });
    });

    // Poczekaj na edytor avatara i zaakceptuj
    cy.get("canvas").should("exist");
    cy.contains("Accept avatar").click();

    // Wyślij formularz
    cy.contains("Create an account").click();

    // Powinna nastąpić przekierowanie do /auth/login
    cy.url().should("include", "/auth/login");
  });
});
