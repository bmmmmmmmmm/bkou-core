const isObjectAlike = (value) => { // can have key/value: object/array/function
  const type = typeof (value)
  return (type === 'object' && value !== null) || (type === 'function')
}
const isBasicObject = (value) => typeof (value) === 'object' && value !== null && !Array.isArray(value) // NOTE: not confuse with the idea Array is a special Object
const isObjectKey = (value, key) => isBasicObject(value) && Object.prototype.hasOwnProperty.call(value, key)
const isObjectContain = (value, target) => isBasicObject(value) && Object.entries(target).every(([key, targetValue]) => value[key] === targetValue)
