const tsRules = require('./rule-row-ts.cjs');

const tsConfig = {
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.mts', '*.cts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: tsRules,
    },
  ],
};

module.exports = tsConfig;
