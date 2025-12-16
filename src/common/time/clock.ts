/* eslint-disable @typescript-eslint/no-unused-vars */
// @inspired by `https://github.com/dr-js/dr-js/blob/master/source/common/time.js`

const createClock = (): () => number => {
  try {
    const { performance } = globalThis;
    if (performance && typeof performance.now === 'function') {
      const testTime = performance.now();
      if (typeof testTime === 'number' && !isNaN(testTime)) {
        return () => performance.now();
      }
    }
  } catch (error) {}

  try {
    const { process } = globalThis;
    if (process && typeof process.hrtime?.bigint === 'function') {
      const testTime = process.hrtime.bigint();
      if (typeof testTime === 'bigint') {
        return () => Number(process.hrtime.bigint()) * 0.000001;
      }
    }
  } catch (error) {}

  try {
    const { process } = globalThis;
    if (process && typeof process.hrtime === 'function') {
      const [seconds, nanoseconds] = process.hrtime();
      if (typeof seconds === 'number' && typeof nanoseconds === 'number') {
        return () => {
          const [s, ns] = process.hrtime();
          return s * 1000 + ns * 0.000001;
        };
      }
    }
  } catch (error) {}

  return Date.now;
};

const _createClock = (): () => number => {
  try {
    const { performance } = globalThis
    const clock = () => performance.now()
    const time = clock()
    if (time <= clock()) return clock
  } catch (error) {}

  try {
    const { process } = globalThis
    const clock = () => Number(process.hrtime.bigint()) / 1000000
    const time = clock()
    if (time <= clock()) return clock
  } catch (error) {}

  try {
    const { process } = globalThis
    const clock = () => {
      const [seconds, nanoseconds] = process.hrtime()
      return seconds * 1000 + nanoseconds * 0.000001
    }
    const time = clock()
    if (time <= clock()) return clock
  } catch (error) {}

  return Date.now
};

const createTimestamp = (): () => number => {
  // try {
  //   const { performance } = globalThis;
  //   if (performance && typeof performance.now === 'function' && performance.timeOrigin) {
  //     const testTime = performance.now();
  //     if (typeof testTime === 'number' && !isNaN(testTime)) {
  //       return () => performance.timeOrigin + performance.now();
  //     }
  //   }
  // } catch (error) {}

  // try {
  //   const { process } = globalThis;
  //   if (process && typeof process.hrtime?.bigint === 'function') {
  //     const testTime = process.hrtime.bigint();
  //     if (typeof testTime === 'bigint') {
  //       const baseTimestamp = Date.now();
  //       const baseHrtime = process.hrtime.bigint();
  //       return () => {
  //         const currentHrtime = process.hrtime.bigint();
  //         const elapsedNs = Number(currentHrtime - baseHrtime);
  //         return baseTimestamp + elapsedNs / 1000000;
  //       };
  //     }
  //   }
  // } catch (error) {}

  return Date.now;
};

const clock = createClock();
const now = createTimestamp();
const timestamp = () => Math.floor(now());
const measure = <T>(fn: () => T): { result: T; duration: number } => {
  const start = clock();
  const result = fn();
  const duration = clock() - start;
  return { result, duration };
};

export {
  clock,
  now,
  timestamp,
  measure,
}
