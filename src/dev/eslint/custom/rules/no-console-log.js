module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'do not use console.log; prefer other console methods',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      noConsoleLog: 'no console.log allowed; use other console methods if necessary',
    },
  },

  create (context) {
    return {
      MemberExpression (node) {
        if (
          node.object.type === 'Identifier' &&
          node.object.name === 'console' &&
          node.property.type === 'Identifier' &&
          node.property.name === 'log'
        ) {
          context.report({
            node,
            messageId: 'noConsoleLog',
          })
        }
      },
    }
  },
}
