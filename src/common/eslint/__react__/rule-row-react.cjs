// https://github.com/standard/eslint-config-standard-jsx/blob/b21a96c35092f7e70195e5a58c410fc981d2830b/eslintrc.json
// https://github.com/standard/eslint-config-standard-react/blob/3dbac862af3b7c73bcfef281ae07599bc49630b2/eslintrc.json

const reactRules = {
  'jsx-quotes': ['error', 'prefer-single'],
  'react/jsx-boolean-value': 'error',
  'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
  'react/jsx-closing-tag-location': 'error',
  'react/jsx-curly-brace-presence': ['error', {
    'props': 'never',
    'children': 'never',
  }],
  'react/jsx-curly-newline': ['error', {
    'multiline': 'consistent',
    'singleline': 'consistent',
  }],
  'react/jsx-curly-spacing': ['error', {
    'attributes': { 'when': 'never', 'allowMultiline': true },
    'children': { 'when': 'never', 'allowMultiline': true },
  }],
  'react/jsx-equals-spacing': ['error', 'never'],
  'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
  'react/jsx-fragments': ['error', 'syntax'],
  'react/jsx-handler-names': 'error',
  'react/jsx-indent': ['error', 2, {
    'checkAttributes': false,
    'indentLogicalExpressions': true,
  }],
  'react/jsx-indent-props': ['error', 2],
  'react/jsx-key': ['error', {
    'checkFragmentShorthand': true,
  }],
  'react/jsx-no-comment-textnodes': 'error',
  'react/jsx-no-duplicate-props': 'error',
  'react/jsx-no-target-blank': ['error', { 'enforceDynamicLinks': 'always' }],
  'react/jsx-no-undef': ['error', { 'allowGlobals': true }],
  'react/jsx-pascal-case': ['error', { 'allowAllCaps': false }],
  'react/jsx-props-no-multi-spaces': 'error',
  'react/jsx-tag-spacing': ['error', {
    'closingSlash': 'never',
    'beforeSelfClosing': 'always',
    'afterOpening': 'never',
    'beforeClosing': 'never',
  }],
  'react/jsx-uses-react': 'error',
  'react/jsx-uses-vars': 'error',
  'react/jsx-wrap-multilines': ['error', {
    'declaration': 'parens-new-line',
    'assignment': 'parens-new-line',
    'return': 'parens-new-line',
    'arrow': 'ignore',
    'condition': 'ignore',
    'logical': 'ignore',
    'prop': 'ignore',
  }],
  'react/no-children-prop': 'error',
  'react/no-danger-with-children': 'error',
  'react/no-deprecated': 'error',
  'react/no-direct-mutation-state': 'error',
  'react/no-find-dom-node': 'error',
  'react/no-is-mounted': 'error',
  'react/no-string-refs': ['error', {
    'noTemplateLiterals': true,
  }],
  'react/no-unescaped-entities': ['error', {
    'forbid': ['>', '}'],
  }],
  'react/no-render-return-value': 'error',
  'react/require-render-return': 'error',
  'react/self-closing-comp': 'error',
  // ==============================================================================================================
  'react/jsx-no-bind': ['error', {
    'allowArrowFunctions': true,
    'allowBind': false,
    'ignoreRefs': true,
  }],
  'react/no-did-update-set-state': 'error',
  'react/no-unknown-property': 'error',
  'react/no-unused-prop-types': 'error',
  'react/prop-types': 'error',
  'react/react-in-jsx-scope': 'error',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
};

module.exports = reactRules;
