/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    form_request(
      method: string,
      url: string,
      formDataObj: {
        [key: string]:
          | string
          | {
              fileContent: string;
              fileName: string;
              mimeType: string;
            };
      }
    ): Chainable<Response>;
  }
}
