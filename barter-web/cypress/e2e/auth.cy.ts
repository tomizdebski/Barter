const baseApi = "http://localhost:4000";
const frontend = "http://localhost:3000";

const user = {
  firstName: "Test",
  lastName: "User",
  email: `testuser_${Date.now()}@example.com`,
  password: "test1234",
};

describe("Auth Flow - signup, login, delete own account", () => {
  it("should register user via API (multipart/form-data)", () => {
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
        url: `${baseApi}/auth/signup`,
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        expect(res.status).to.eq(201);
      });
    });
  });

  it("should log in user via API and visit frontend", () => {
    cy.request({
      method: "POST",
      url: `${baseApi}/auth/signin`,
      body: {
        email: user.email,
        password: user.password,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      expect(res.status).to.eq(200);
      const setCookieHeader = res.headers["set-cookie"];
      const tokenMatch = setCookieHeader?.[0]?.match(/token=([^;]+)/);
      const token = tokenMatch?.[1];
      expect(token, "JWT token extracted from cookie").to.be.a("string");
      cy.setCookie("token", token as string);
      cy.visit(frontend);
    });
    cy.getCookie("token", { timeout: 10000 }).should("exist");
  });
});

