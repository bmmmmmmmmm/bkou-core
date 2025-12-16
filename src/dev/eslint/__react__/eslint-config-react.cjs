const reactRules = require('./rule-row-react.cjs');

const reactConfig = {
  overrides: [
    {
      files: ['*.jsx', '*.tsx'],
      settings: {
        linkComponents: ['Link'],
      },
      plugins: [
        'react',
        'react-hooks',
      ],
      rules: reactRules,
    },
  ],
};

module.exports = reactConfig;
