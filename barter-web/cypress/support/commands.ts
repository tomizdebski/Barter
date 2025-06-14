/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add("form_request", (method, url, formDataObj) => {
  const formData = new FormData();

  Object.entries(formDataObj).forEach(([key, value]) => {
    if (
      typeof value === "object" &&
      value !== null &&
      "fileContent" in value &&
      "fileName" in value &&
      "mimeType" in value
    ) {
      const blob = Cypress.Blob.base64StringToBlob(
        value.fileContent,
        value.mimeType
      );
      formData.append(key, blob, value.fileName);
    } else {
      formData.append(key, value as string);
    }
  });

  return cy.request({
    method,
    url,
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
});

