type LogStyle =
  'boild' | 'italic' | 'underline' |
  'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' |
  'black-bg' | 'red-bg' | 'green-bg' | 'yellow-bg' | 'blue-bg' | 'magenta-bg' | 'cyan-bg' | 'white-bg';

const logStyleMap = new Map<LogStyle, string>([
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
]);

const _log = (params: string | string[], style?: LogStyle | LogStyle[]) => {
  const message = Array.isArray(params) ? params.join('\n') : params;
  const styleLog = Array.isArray(style) ? style.map(s => logStyleMap.get(s)).join(';') : logStyleMap.get(style);
  console.log(`\x1B[${styleLog}m%s\x1B[0m`, `=======BK=======\n${message}\n=======BK=======`)
}

export {
  _log
}
