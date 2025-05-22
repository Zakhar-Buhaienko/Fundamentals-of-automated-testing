const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/test/specs/**/*.ts', // <- ось ця зміна
    baseUrl: 'https://www.globalsqa.com'
  }
});
