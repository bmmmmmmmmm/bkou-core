const customRules = {
  'custom/prefer-arrow-callback': ['warn', {
    allowNamedFunctions: false,
  }],

  'custom/no-console-log': 'warn',

  'custom/no-magic-numbers': ['warn', {
    ignore: [0, 1, -1, 2],
    ignoreArrayIndexes: true,
    enforceConst: true,
  }],
};

module.exports = customRules;
