module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'use arrow functions instead of function expressions for callbacks',
      category: 'ECMAScript 6',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowNamedFunctions: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferArrow: 'prefer arrow functions instead of function expressions',
    },
  },

  create (context) {
    const options = context.options[0] || {}
    const allowNamedFunctions = options.allowNamedFunctions || false
    return {
      CallExpression (node) {
        const callbackMethods = ['map', 'filter', 'forEach', 'reduce', 'find', 'some', 'every']
        if (node.callee.type === 'MemberExpression') {
          const methodName = node.callee.property.name
          if (callbackMethods.includes(methodName)) {
            const arg = node.arguments[0]
            if (arg && arg.type === 'FunctionExpression') {
              if (allowNamedFunctions && arg.id) return
              context.report({
                node: arg,
                messageId: 'preferArrow',
                fix (fixer) {
                  const sourceCode = context.getSourceCode()
                  const params = sourceCode.getText(arg).match(/\((.*?)\)/)?.[1] || ''
                  const body = sourceCode.getText(arg.body)
                  const arrowFunc = `(${params}) => ${body}`
                  return fixer.replaceText(arg, arrowFunc)
                },
              })
            }
          }
        }
      },
    }
  },
}
