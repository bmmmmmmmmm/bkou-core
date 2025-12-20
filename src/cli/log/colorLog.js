/**
 * @typedef {'boild' | 'italic' | 'underline' |
 *   'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' |
 *   'black-bg' | 'red-bg' | 'green-bg' | 'yellow-bg' | 'blue-bg' | 'magenta-bg' | 'cyan-bg' | 'white-bg'
 * } LogStyle
 */

/**
 * @type {Map<LogStyle, string>}
 */
const logStyleMap = new Map([
  // =======font=======
  ['boild', '1'],
  ['italic', '3'],
  ['underline', '4'],
  // =======color=======
  ['black', '30'],
  ['red', '31'],
  ['green', '32'],
  ['yellow', '33'],
  ['blue', '34'],
  ['magenta', '35'],
  ['cyan', '36'],
  ['white', '37'],
  // =======bgColor=======
  ['black-bg', '40'],
  ['red-bg', '41'],
  ['green-bg', '42'],
  ['yellow-bg', '43'],
  ['blue-bg', '44'],
  ['magenta-bg', '45'],
  ['cyan-bg', '46'],
  ['white-bg', '47'],
])

// const preLine = '======= [ BK ] =======';
// const postLine = '======= [ BK ] =======';
// const preStr = '==[ BK ]== ';
// const postStr = '';
// const preLine = ''
// const postLine = ''
// const preStr = ''
// const postStr = ''

/**
 * Output colored log to console
 * @param {string | string[]} params - Message or array of messages
 * @param {LogStyle | LogStyle[]} [style] - Style(s) to apply
 * @param {(message: string) => void} [log=console.log] - Log function to use
 */
const colorLog = (params, style, log = console.log) => {
  const message = Array.isArray(params) ? params.join('\n') : params
  // const pre = Array.isArray(params) ? `${preLine}\n` : preStr
  // const post = Array.isArray(params) ? `\n${postLine}` : postStr
  // const output = `${pre}${message}${post}`
  const output = message
  if (!style) return log(output)
  const styleLog = Array.isArray(style) ? style.map(s => logStyleMap.get(s)).join(';') : logStyleMap.get(style)
  log(`\x1B[${styleLog}m${output}\x1B[0m`)
}

export {
  colorLog,
}
