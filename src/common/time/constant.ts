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

const TU2M_MAP = new Map<TimeUnit, number>([
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

  TU2M_MAP,
};
