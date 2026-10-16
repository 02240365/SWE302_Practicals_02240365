const { defineConfig } = require('cypress');

// Cypress configuration (Lab 8). Start the app with `npm start` before running tests.
module.exports = defineConfig({
  e2e: {
    // tests use relative URLs such as cy.visit('/')
    baseUrl: 'http://localhost:3000',
    // where the test files live
    specPattern: 'cypress/e2e/**/*.cy.js',
    // loads the custom commands (cy.login etc.) before every spec
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFailure: true,
    // how long cy.get()/should() keep retrying before failing
    defaultCommandTimeout: 6000,
  },
});
