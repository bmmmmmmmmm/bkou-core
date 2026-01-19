import pluginN from 'eslint-plugin-n';
import * as pluginImport from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import globals from 'globals';

import baseRules from './rule-row-base.cjs';

const baseConfig = [
  {
    ignores: [ // EDIT: https://github.com/eslint/eslint/issues/10341#issuecomment-468548031
      '!.*', 'node_modules',
      'dist/', 'build/', 'output_*/',
      // Ignore folder of file with `-eslintignore`
      '**/*-eslintignore*',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest', // ecmaVersion: 2022, // EDIT
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: { jsx: true },
      },

      globals: {
        ...globals.es2021,
        ...globals.node,
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly',
      },
    },

    plugins: {
      n: pluginN,
      promise: pluginPromise,
      import: pluginImport,
    },

    rules: baseRules,
  },
];

export default baseConfig;
