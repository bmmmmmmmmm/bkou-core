// TODO: sort @typescript-eslint/recommended
// TODO: sort https://github.com/typescript-eslint/typescript-eslint/blob/v8.40.0/packages/eslint-plugin/src/configs/eslint-recommended-raw.ts

/**
 * https://github.com/standard/eslint-config-standard/blob/60d408b04723fb7cd743f6be7c5c01bb3f729139/src/index.ts
 * https://github.com/typescript-eslint/typescript-eslint/blob/v8.40.0/packages/eslint-plugin/src/configs/flat/recommended.ts
 * ==============================================================================================================
 * https://github.com/standard/eslint-config-standard/issues/351
 * https://github.com/standard/standard/issues/1948
 */

import pluginN from 'eslint-plugin-n';
import * as pluginImport from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import tsParser from '@typescript-eslint/parser';
import * as pluginTypescript from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

const config = [
  {
    ignores: [
      '!.*', 'node_modules' // EDIT: https://github.com/eslint/eslint/issues/10341#issuecomment-468548031
    ]
  },
  {
    languageOptions: {
      parser: tsParser, // EDIT: add
      ecmaVersion: 'latest', // ecmaVersion: 2022, // EDIT
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: { jsx: true }
      },

      globals: {
        ...globals.es2021,
        ...globals.node,
        document: 'readonly',
        navigator: 'readonly',
        window: 'readonly'
      }
    },

    plugins: {
      n: pluginN,
      promise: pluginPromise,
      import: pluginImport,
      '@typescript-eslint': pluginTypescript // EDIT: add
    },

    rules: {
      'no-var': 'warn',
      'object-shorthand': ['warn', 'properties'],

      'accessor-pairs': ['error', { setWithoutGet: true, enforceForClassMembers: true }],
      'array-bracket-spacing': ['error', 'never'],
      'array-callback-return': ['error', {
        allowImplicit: false,
        checkForEach: false
      }],
      'arrow-spacing': ['error', { before: true, after: true }],
      'block-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'camelcase': ['error', {
        allow: ['^UNSAFE_'],
        properties: 'never',
        ignoreGlobals: true
      }],
      'comma-dangle': ['error', {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }],
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last'],
      'computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
      'constructor-super': 'error',
      'curly': ['error', 'multi-line'],
      'default-case-last': 'error',
      'dot-location': ['error', 'property'],
      // 'dot-notation': ['error', { allowKeywords: true }], // EDIT
      'eol-last': 'error',
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'func-call-spacing': ['error', 'never'],
      'generator-star-spacing': ['error', { before: true, after: true }],
      'indent': ['error', 2, {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: { parameters: 1, body: 1 },
        FunctionExpression: { parameters: 1, body: 1 },
        CallExpression: { arguments: 1 },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoreComments: false,
        ignoredNodes: [
          'TemplateLiteral *',
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild'
        ],
        offsetTernaryExpressions: false // offsetTernaryExpressions: true // EDIT
      }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      // 'multiline-ternary': ['error', 'always-multiline'], // EDIT
      'new-cap': ['error', { newIsCap: true, capIsNew: false, properties: true }],
      'new-parens': 'error',
      // 'no-array-constructor': 'error', // EDIT: dupe in typescript
      'no-async-promise-executor': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-const-assign': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-delete-var': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-useless-backreference': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-eval': 'error',
      'no-ex-assign': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-parens': ['error', 'functions'],
      'no-fallthrough': 'error',
      'no-floating-decimal': 'error',
      'no-func-assign': 'error',
      'no-global-assign': 'error',
      'no-implied-eval': 'error',
      'no-import-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-iterator': 'error',
      'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
      'no-lone-blocks': 'error',
      'no-loss-of-precision': 'error',
      'no-misleading-character-class': 'error',
      'no-prototype-builtins': 'error',
      'no-useless-catch': 'error',
      'no-mixed-operators': ['error', {
        groups: [
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof']
        ],
        allowSamePrecedence: true
      }],
      'no-mixed-spaces-and-tabs': 'error',
      'no-multi-spaces': 'error',
      'no-multi-str': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-object': 'error',
      'no-new-symbol': 'error',
      'no-new-wrappers': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-redeclare': ['error', { builtinGlobals: false }],
      'no-regex-spaces': 'error',
      'no-return-assign': ['error', 'except-parens'],
      'no-self-assign': ['error', { props: true }],
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-tabs': 'error',
      'no-template-curly-in-string': 'error',
      'no-this-before-super': 'error',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-unexpected-multiline': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-unreachable': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-negation': 'error',
      // 'no-unused-expressions': ['error', {
      //   allowShortCircuit: true,
      //   allowTernary: true,
      //   allowTaggedTemplates: true
      // }], // EDIT: dupe in typescript
      // 'no-unused-vars': ['error', {
      //   args: 'none',
      //   caughtErrors: 'none',
      //   ignoreRestSiblings: true,
      //   vars: 'all'
      // }], // EDIT: dupe in typescript
      'no-use-before-define': ['error', { functions: false, classes: false, variables: false }],
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-escape': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'no-whitespace-before-property': 'error',
      'no-with': 'error',
      'object-curly-newline': ['error', { multiline: true, consistent: true }],
      'object-curly-spacing': ['error', 'always'],
      // 'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }], // EDIT
      'one-var': ['error', { initialized: 'never' }],
      'operator-linebreak': ['error', 'after', { overrides: { '?': 'before', ':': 'before', '|>': 'before' } }],
      'padded-blocks': ['error', { blocks: 'never', switches: 'never', classes: 'never' }],
      'prefer-const': ['error', { destructuring: 'all' }],
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      'quote-props': ['error', 'as-needed', { unnecessary: false }], // 'quote-props': ['error', 'as-needed'], // EDIT
      'quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
      'rest-spread-spacing': ['error', 'never'],
      'semi': ['error', 'always'], // 'semi': ['error', 'never'], // EDIT
      'semi-spacing': ['error', { before: false, after: true }],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': ['error', 'always'],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': ['error', { words: true, nonwords: false }],
      'spaced-comment': ['error', 'always', {
        line: { markers: ['*package', '!', '/', ',', '='] },
        block: { balanced: true, markers: ['*package', '!', ',', ':', '::', 'flow-include'], exceptions: ['*'] }
      }],
      'symbol-description': 'error',
      'template-curly-spacing': ['error', 'never'],
      'template-tag-spacing': ['error', 'never'],
      'unicode-bom': ['error', 'never'],
      'use-isnan': ['error', {
        enforceForSwitchCase: true,
        enforceForIndexOf: true
      }],
      'valid-typeof': ['error', { requireStringLiterals: true }],
      'wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],
      'yield-star-spacing': ['error', 'both'],
      'yoda': ['error', 'never'],

      'import/export': 'error',
      'import/first': 'error',
      'import/no-absolute-path': ['error', { esmodule: true, commonjs: true, amd: false }],
      'import/no-duplicates': 'error',
      'import/no-named-default': 'error',
      'import/no-webpack-loader-syntax': 'error',

      'import/group-exports': 'error', // EDIT: add
      'import/no-mutable-exports': 'error', // EDIT: add

      'n/handle-callback-err': ['error', '^(err|error)$'],
      'n/no-callback-literal': 'error',
      'n/no-deprecated-api': 'error',
      'n/no-exports-assign': 'error',
      'n/no-new-require': 'error',
      'n/no-path-concat': 'error',
      'n/process-exit-as-throw': 'error',

      'promise/param-names': 'error',

      // EDIT: add typescript
      '@typescript-eslint/ban-ts-comment': 'error',
      'no-array-constructor': 'off',
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-unnecessary-type-constraint': 'error',
      '@typescript-eslint/no-unsafe-declaration-merging': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'error',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-wrapper-object-types': 'error',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',
      '@typescript-eslint/triple-slash-reference': 'error'
    }
  }];

export default config;
