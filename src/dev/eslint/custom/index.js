const noConsoleLog = require('./rules/no-console-log.js')
const preferArrowCallback = require('./rules/prefer-arrow-callback.js')
const noMagicNumbers = require('./rules/no-magic-numbers.js')

module.exports = {
  rules: {
    'no-console-log': noConsoleLog,
    'prefer-arrow-callback': preferArrowCallback,
    'no-magic-numbers': noMagicNumbers,
  },
}
