/* eslint-disable @typescript-eslint/no-unused-vars */
// @inspired by `https://github.com/dr-js/dr-js/blob/master/source/common/time.js`

/**
 * Create a high-precision clock function
 * @returns {() => number} Clock function that returns time in milliseconds
 */
const createClock = () => {
  try {
    const { performance } = globalThis;
    if (performance && typeof performance.now === 'function') {
      const testTime = performance.now();
      if (typeof testTime === 'number' && !isNaN(testTime)) {
        return () => performance.now();
      }
    }
  } catch (_error) {}

  try {
    const { process } = globalThis;
    if (process && typeof process.hrtime?.bigint === 'function') {
      const testTime = process.hrtime.bigint();
      if (typeof testTime === 'bigint') {
        return () => Number(process.hrtime.bigint()) * 0.000001;
      }
    }
  } catch (_error) {}

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
  } catch (_error) {}

  return Date.now;
};

/**
 * Alternative clock implementation (simplified version)
 * @returns {() => number} Clock function that returns time in milliseconds
 */
const _createClock = () => {
  try {
    const { performance } = globalThis
    const clock = () => performance.now()
    const time = clock()
    if (time <= clock()) return clock
  } catch (_error) {}

  try {
    const { process } = globalThis
    const clock = () => Number(process.hrtime.bigint()) / 1000000
    const time = clock()
    if (time <= clock()) return clock
  } catch (_error) {}

  try {
    const { process } = globalThis
    const clock = () => {
      const [seconds, nanoseconds] = process.hrtime()
      return seconds * 1000 + nanoseconds * 0.000001
    }
    const time = clock()
    if (time <= clock()) return clock
  } catch (_error) {}

  return Date.now
};

/**
 * Create a timestamp function
 * @returns {() => number} Timestamp function that returns Unix timestamp in milliseconds
 */
const createTimestamp = () => {
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

/**
 * High-precision clock function (milliseconds since arbitrary point)
 * @type {() => number}
 */
const clock = createClock();

/**
 * Current timestamp function (Unix timestamp in milliseconds)
 * @type {() => number}
 */
const now = createTimestamp();

/**
 * Current timestamp in seconds (floored)
 * @returns {number} Unix timestamp in seconds
 */
const timestamp = () => Math.floor(now());

/**
 * Measure execution time of a function (supports both sync and async)
 * @template T
 * @param {() => T | Promise<T>} fn - Function to measure (can be sync or async)
 * @returns {Promise<{ result?: T, error?: Error, duration: number, success: boolean }>} Promise containing the function result/error and duration in milliseconds
 */
const measure = (fn) => {
  const start = clock();
  return Promise.resolve(fn())
    .then(
      (result) => ({ result, duration: clock() - start, success: true }),
      (error) => ({ error, duration: clock() - start, success: false }),
    );
};

export {
  clock,
  now,
  timestamp,
  measure,
}
