const isNumber = (val: any): val is number => typeof val === 'number';

const _random = (from: number, to: number): number => Math.floor(Math.random() * (to - from + 1) + from)
const getRandomInt = (a: number = 10, b: number = 0) => _random(Math.min(a, b), Math.max(a, b))

export {
  isNumber,
  getRandomInt,
}
