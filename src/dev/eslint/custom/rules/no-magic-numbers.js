module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'no magic numbers; define named constants instead',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignore: {
            type: 'array',
            items: { type: 'number' },
            default: [0, 1, -1],
          },
          ignoreArrayIndexes: {
            type: 'boolean',
            default: true,
          },
          enforceConst: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noMagic: 'no magic numbers "{{raw}}"; define named constants instead',
    },
  },

  create (context) {
    const options = context.options[0] || {}
    const ignore = options.ignore || [0, 1, -1]
    const ignoreArrayIndexes = options.ignoreArrayIndexes !== false
    // const sourceCode = context.getSourceCode()
    function isIgnoredNumber (value) {
      return ignore.includes(value)
    }
    function isArrayIndex (node) {
      const parent = node.parent
      return parent &&
        parent.type === 'MemberExpression' &&
        parent.property === node &&
        parent.computed
    }
    return {
      Literal (node) {
        if (typeof node.value !== 'number') return
        if (isIgnoredNumber(node.value)) return
        if (ignoreArrayIndexes && isArrayIndex(node)) return
        const parent = node.parent
        if (parent.type === 'VariableDeclarator' && parent.init === node) {
          const declaration = parent.parent
          if (declaration && declaration.kind === 'const') return
        }
        context.report({
          node,
          messageId: 'noMagic',
          data: {
            raw: node.raw,
          },
        })
      },
    }
  },
}
