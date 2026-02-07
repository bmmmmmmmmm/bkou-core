const isString = (value: any): value is string => typeof value === 'string';

const toHump = (name) => name.replace(/_(\w)/g, (_, letter) => letter.toUpperCase())
const toLine = (name) => name.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '')

const reverseString = (string) => [...string].reverse().join('')

export {
  isString,
  toHump,
  toLine,
  reverseString,
}
