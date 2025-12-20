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
const _createLogKit = (_logOptions, _report, _log = colorLog) => {
  const log = (message) => _log(parseMessage(message));
  /** blue */
  const info = (message) => _log(parseMessage(message), ['blue']);
  /** yellow */
  const warn = (message) => _log(parseMessage(message, '⚠️'), ['yellow']);
  /** red */
  const error = (message) => _log(parseMessage(message, '❌'), ['red']);
  /** green */
  const success = (message) => _log(parseMessage(message, '✅'), ['green']);
  /** cyan */
  const loading = (message) => _log(parseMessage(message, '⏳'), ['cyan']);
  const track = (message, silent = true) => {
    !silent && _log(`${timestamp()} | ${message}`);
    _report && _report(message);
  }
  const color = _log;

  return {
    log, info, warn, error, success, loading,
    track,
    color,
  };
}

const createLogKit = (logOptions = {}, report = null, log = colorLog) => ({
  ..._createLogKit(logOptions, report, log),
  _: _createLogKit(logOptions, report, colorLog),
})

const Logger = createLogKit({}, null, colorLog);

export {
  createLogKit,
  Logger,
};
