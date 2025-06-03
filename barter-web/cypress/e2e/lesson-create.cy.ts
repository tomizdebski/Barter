const api = "http://localhost:4000";
const front = "http://localhost:3000";

const user = {
  firstName: "Test",
  lastName: "User",
  email: `testuser_${Date.now()}@example.com`,
  password: "test1234",
};
describe("Lesson Creation Flow", () => {
  before(() => {
    cy.fixture("avatar.jpg", "base64").then((fileContent) => {
      const formData = new FormData();
      formData.append("firstName", user.firstName);
      formData.append("lastName", user.lastName);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append(
        "avatar",
        Cypress.Blob.base64StringToBlob(fileContent, "image/jpeg"),
        "avatar.jpg"
      );
      cy.request({
        method: "POST",
        url: `${api}/auth/signup`,
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    });
  });
  it("should log in and create a lesson", () => {
    cy.request({
      method: "POST",
      url: `${api}/auth/signin`,
      body: {
        email: user.email,
        password: user.password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      const token = res.headers["set-cookie"]?.[0]?.match(/token=([^;]+)/)?.[1];
      expect(token, "JWT token extracted").to.be.a("string");
      cy.setCookie("token", token as string);
    });
    cy.visit(`${front}/lessons/create`);
    cy.get('input[placeholder="Lesson title"]').type("Cypress Test Lesson");
    cy.get('textarea[placeholder="Lesson description..."]').type(
      "This is a test lesson created with Cypress for E2E testing."
    );
    cy.get("select").should("exist");
    cy.get("select").select(1); 
    cy.get('input[type="file"]#photo').selectFile("cypress/fixtures/photo.jpg", {
      force: true,
    });
    cy.get('input[type="file"]#video').selectFile("cypress/fixtures/video.mp4", {
      force: true,
    });
    cy.contains("Add Lesson").click();
    cy.url({ timeout: 10000 }).should("include", "/dashboard");
  });
});
