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
const createLogKit = (_logOptions, _report) => {
  const log = (message) => colorLog(parseMessage(message));
  /** blue */
  const info = (message) => colorLog(parseMessage(message), ['blue']);
  /** yellow */
  const warn = (message) => colorLog(parseMessage(message, '⚠️'), ['yellow']);
  /** red */
  const error = (message) => colorLog(parseMessage(message, '❌'), ['red']);
  /** green */
  const success = (message) => colorLog(parseMessage(message, '✅'), ['green']);
  /** cyan */
  const loading = (message) => colorLog(parseMessage(message, '⏳'), ['cyan']);
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

const Logger = createLogKit({}, null);

export {
  createLogKit,
  Logger,
};
