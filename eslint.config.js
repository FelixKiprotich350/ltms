/** @type {import('eslint').Linter.FlatConfig} */
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');
const nextTypescript = require('eslint-config-next/typescript');

module.exports = [
  nextCoreWebVitals,
  nextTypescript,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Add any TypeScript-specific rules here
    }
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      // Add any JavaScript-specific rules here
    }
  },
  // Add additional custom configuration if necessary
];
