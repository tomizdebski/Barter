import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
  baseUrl: "http://localhost:3000",
  env: {
      baseApi: "http://localhost:4000",
      frontend: "http://localhost:3000"
    },
  chromeWebSecurity: false,
  specPattern: "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}",
}

});
