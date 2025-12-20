import { colorLog } from './colorLog.js';
import { timestamp } from '../../common/time/clock.js';

const parseMessage = (message, sign = '=>') => {
  // check U+FE0F VARIATION SELECTOR-16 for emoji presentation
  if (sign.includes('\uFE0F')) sign = `${sign} `
  if (Array.isArray(message) && sign.trim()) {
    return message.map((part, index) => `${index ? '  ' : sign} ${part}`)
  }
  return `${sign} ${message}`;
}
const _createLogKit = (_logOptions, _report, _log = console.log) => {
  const log = (message) => colorLog(parseMessage(message), undefined, _log);
  /** blue */
  const info = (message) => colorLog(parseMessage(message), ['blue'], _log);
  /** yellow */
  const warn = (message) => colorLog(parseMessage(message, '⚠️'), ['yellow'], _log);
  /** red */
  const error = (message) => colorLog(parseMessage(message, '❌'), ['red'], _log);
  /** green */
  const success = (message) => colorLog(parseMessage(message, '✅'), ['green'], _log);
  /** cyan */
  const loading = (message) => colorLog(parseMessage(message, '⏳'), ['cyan'], _log);
  const track = (message, silent = true) => {
    !silent && colorLog(`${timestamp()} | ${message}`);
    _report && _report(message);
  }
  const color = colorLog;

  return {
    log, info, warn, error, success, loading,
    track,
    color,
  };
}

const createLogKit = (logOptions = {}, report = null, log = console.log) => ({
  ..._createLogKit(logOptions, report, log),
  _: _createLogKit(logOptions, report, console.log),
})

const Logger = createLogKit({}, null, console.log);

export {
  createLogKit,
  Logger,
};
