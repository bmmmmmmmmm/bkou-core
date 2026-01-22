// NOTE: not confuse with the idea Array is a special Object
const isBasicObject = (value) => typeof (value) === 'object' && value !== null && !Array.isArray(value)

// can have key/value: object/array/function
const isObjectAlike = (value) => {
  const type = typeof (value)
  return (type === 'object' && value !== null) || (type === 'function')
}

const isObjectKey = (value, key) => isBasicObject(value) && Object.prototype.hasOwnProperty.call(value, key)
const isObjectContain = (value, target) => isBasicObject(value) && Object.entries(target).every(([key, targetValue]) => value[key] === targetValue)

// function readonly<T extends object> (x: T): { readonly [K in keyof T]: () => T[K] } {
//   const ret = {} as { [K in keyof T]: () => T[K] };
//   (Object.keys(x) as Array<keyof T>).forEach(k => ret[k] = () => x[k]);
//   return ret;
// }

/**
 * Deeply compares two object literals.
 * @param obj1 object 1
 * @param obj2 object 2
 * @param shallow shallow compare
 * @returns
 */
const isEqualObject = (obj1: any, obj2: any, shallow = false): boolean => {
  // https://github.com/mapbox/mapbox-gl-js/pull/5979/files#diff-fde7145050c47cc3a306856efd5f9c3016e86e859de9afbd02c879be5067e58f
  const refSet = new Set<any>();
  const deepEqual = (a: any, b: any, level = 1): boolean => {
    const circular = refSet.has(a);
    // warning(!circular, 'Warning: There may be circular references');
    if (circular) return false;
    if (a === b) return true;
    if (shallow && level > 1) return false;
    refSet.add(a);
    const newLevel = level + 1;
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i], newLevel)) return false;
      }
      return true;
    }
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      const keys = Object.keys(a);
      if (keys.length !== Object.keys(b).length) return false;
      return keys.every(key => deepEqual(a[key], b[key], newLevel));
    }
    // other
    return false;
  }
  return deepEqual(obj1, obj2);
}

export {
  isObjectAlike,
  isBasicObject,
  isObjectKey,
  isObjectContain,
  // readonly,
  isEqualObject,
}
