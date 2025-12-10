/* eslint-disable brace-style */
/**
 * 通用命令行参数解析器
 * @param {string[]} argv - process.argv
 * @param {Object} options - 配置选项
 * @param {Object} options.flags - 短选项映射，如 { t: 'typescript', r: 'react' }
 * @param {Object} options.aliases - 长选项别名，如 { ts: 'typescript' }
 * @param {Object} options.defaults - 默认值
 * @returns {Object} 解析后的参数对象，位置参数存储在 _ 数组中
 */
const parseArgs = (argv, options = {}) => {
  const args = argv.slice(2)
  const { flags = {}, aliases = {}, defaults = {} } = options
  const result = { ...defaults, _: [] }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    // -- => {_:[...]}
    if (arg === '--') {
      result._.push(...args.slice(i + 1))
      break
    }

    // --key=value => {key: value}
    else if (arg.startsWith('--') && arg.includes('=')) {
      const equalIndex = arg.indexOf('=')
      const key = arg.slice(2, equalIndex)
      const value = arg.slice(equalIndex + 1)
      const finalKey = aliases[key] || key
      result[finalKey] = value
    }

    // --key => {key: true} // --key value => {key: value}
    else if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const finalKey = aliases[key] || key
      const nextArg = args[i + 1]
      if (nextArg && !nextArg.startsWith('-')) {
        result[finalKey] = nextArg
        i++
      }
      else {
        result[finalKey] = true
      }
    }

    // -abc => {a: true, b: true, c: true}
    else if (arg.startsWith('-') && arg.length > 1) {
      const chars = arg.slice(1).split('')
      for (const char of chars) {
        const key = flags[char] || char
        result[key] = true
      }
    }

    // {_: [...]}
    else {
      result._.push(arg)
    }
  }

  return result
}

export {
  parseArgs,
}
