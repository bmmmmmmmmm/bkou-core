import tsParser from '@typescript-eslint/parser';
import * as pluginTypescript from '@typescript-eslint/eslint-plugin';

import tsRules from './rule-row-ts.cjs';

const tsConfig = [
  {
    files: ['*.ts', '*.tsx', '*.mts', '*.cts'],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': pluginTypescript,
    },
    rules: tsRules,
  },
];

export default tsConfig;
