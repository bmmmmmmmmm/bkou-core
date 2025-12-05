type DateD8 =
  `${number}${number}${number}${number}${number}${number}${number}${number}`;

type TimeUnit =
  | 'milli'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'month'
  | 'year';

const MILLI_PER_SECOND = 1000;
const MILLI_PER_MINUTE = MILLI_PER_SECOND * 60;
const MILLI_PER_HOUR = MILLI_PER_MINUTE * 60;
const MILLI_PER_DAY = MILLI_PER_HOUR * 24;
const MILLI_PER_MONTH = MILLI_PER_DAY * 30;
const MILLI_PER_YEAR = MILLI_PER_DAY * 365;

const MILLI_TO_SECOND = 1 / MILLI_PER_SECOND;
const MILLI_TO_MINUTE = 1 / MILLI_PER_MINUTE;
const MILLI_TO_HOUR = 1 / MILLI_PER_HOUR;
const MILLI_TO_DAY = 1 / MILLI_PER_DAY;
const MILLI_TO_MONTH = 1 / MILLI_PER_MONTH;
const MILLI_TO_YEAR = 1 / MILLI_PER_YEAR;

const TU2M_MAP = new Map<string, number>([
  ['milli', 1],
  ['second', MILLI_PER_SECOND],
  ['minute', MILLI_PER_MINUTE],
  ['hour', MILLI_PER_HOUR],
  ['day', MILLI_PER_DAY],
  ['month', MILLI_PER_MONTH],
  ['year', MILLI_PER_YEAR],
]);

export {
  type DateD8,
  type TimeUnit,

  MILLI_PER_SECOND,
  MILLI_PER_MINUTE,
  MILLI_PER_HOUR,
  MILLI_PER_DAY,
  MILLI_PER_MONTH,
  MILLI_PER_YEAR,

  MILLI_TO_SECOND,
  MILLI_TO_MINUTE,
  MILLI_TO_HOUR,
  MILLI_TO_DAY,
  MILLI_TO_MONTH,
  MILLI_TO_YEAR,

  TU2M_MAP,
};
