import * as pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

import reactRules from './rule-row-react.cjs';

const reactConfig = [
  {
    files: ['*.jsx', '*.tsx'],
    settings: {
      linkComponents: ['Link'],
    },
    plugins: {
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: reactRules,
  },
];

export default reactConfig;
