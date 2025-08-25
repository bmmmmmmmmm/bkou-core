// https://github.com/typescript-eslint/typescript-eslint/blob/v8.40.0/packages/eslint-plugin/src/configs/eslint-recommended-raw.ts
// https://github.com/typescript-eslint/typescript-eslint/blob/v8.40.0/packages/eslint-plugin/src/configs/eslintrc/recommended.ts

const tsRules = {
  'constructor-super': 'off', // ts(2335) & ts(2377)
  'getter-return': 'off', // ts(2378)
  'no-class-assign': 'off', // ts(2629)
  'no-const-assign': 'off', // ts(2588)
  'no-dupe-args': 'off', // ts(2300)
  'no-dupe-class-members': 'off', // ts(2393) & ts(2300)
  'no-dupe-keys': 'off', // ts(1117)
  'no-func-assign': 'off', // ts(2630)
  'no-import-assign': 'off', // ts(2632) & ts(2540)
  // TODO - remove this once we no longer support ESLint v8
  'no-new-native-nonconstructor': 'off', // ts(7009)
  'no-new-symbol': 'off', // ts(7009)
  'no-obj-calls': 'off', // ts(2349)
  'no-redeclare': 'off', // ts(2451)
  'no-setter-return': 'off', // ts(2408)
  'no-this-before-super': 'off', // ts(2376) & ts(17009)
  'no-undef': 'off', // ts(2304) & ts(2552)
  'no-unreachable': 'off', // ts(7027)
  'no-unsafe-negation': 'off', // ts(2365) & ts(2322) & ts(2358)
  'no-var': 'error', // ts transpiles let/const to var, so no need for vars any more
  'no-with': 'off', // ts(1101) & ts(2410)
  'prefer-const': 'error', // ts provides better types with const
  'prefer-rest-params': 'error', // ts provides better types with rest args over arguments
  'prefer-spread': 'error', // ts transpiles spread to apply, so no need for manual apply

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
  '@typescript-eslint/no-require-imports': ['error', { allowAsImport: true }], // '@typescript-eslint/no-require-imports': 'error', // EDIT
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
  '@typescript-eslint/triple-slash-reference': 'error',
};

module.exports = tsRules;
