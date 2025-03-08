import {
  type TimeUnit,
  MILLI_PER_SECOND,
  MILLI_PER_MINUTE,
  MILLI_PER_HOUR,
  MILLI_PER_DAY,
  MILLI_PER_MONTH,
  MILLI_PER_YEAR,
  TU2M_MAP,
} from "./constant";

function timeIntervalFormat(date, fineness: TimeUnit = "year") {
  let t = Date.now() - new Date(date || Date.now()).getTime();

  if (Number.isNaN(t)) return "";

  const f = TU2M_MAP.get(fineness) || MILLI_PER_YEAR;
  const l = [
    { n: "年", s: MILLI_PER_YEAR },
    { n: "个月", s: MILLI_PER_MONTH },
    { n: "天", s: MILLI_PER_DAY },
    { n: "小时", s: MILLI_PER_HOUR },
    { n: "分钟", s: MILLI_PER_MINUTE },
    { n: "秒", s: MILLI_PER_SECOND },
  ].filter(({ s }) => s <= f);
  const p = t > 0 ? "前" : "后";
  t = Math.abs(t);

  for (let i = 0; i < l.length; i++) {
    const { n, s } = l[i];
    if (t >= s) {
      const v = Math.floor(t / s);
      return `${v}${n}${p}`;
    }
  }
  return "刚刚";
}

export {
  timeIntervalFormat,
};

// console.log(timeIntervalFormat("2024-04-17 10:27:40"));
// console.log(timeIntervalFormat("2025-04-17 10:27:40"));
// console.log(timeIntervalFormat("2014-04-17 10:27:40", "day"));
