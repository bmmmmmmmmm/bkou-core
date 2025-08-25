const baseRules = require('./rule-row-base.cjs');

const baseConfig = {
  ignorePatterns: [
    '!.*', 'node_modules', // EDIT: https://github.com/eslint/eslint/issues/10341#issuecomment-468548031
  ],

  parserOptions: {
    ecmaVersion: 'latest', // ecmaVersion: 2022, // EDIT
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },

  env: {
    es2021: true,
    node: true,
  },

  plugins: [
    'import',
    'n',
    'promise',
  ],

  globals: {
    document: 'readonly',
    navigator: 'readonly',
    window: 'readonly',
  },

  rules: baseRules,
};

module.exports = baseConfig;
