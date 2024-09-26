function _createMap<K, V>(keys: K[], values: V[]): Map<K, V> {
  if (keys.length !== values.length) {
    throw new Error("Keys and values must have the same length");
  }
  return new Map<K, V>(keys.map((key, index) => [key, values[index]] as [K, V]));
}

export {
  _createMap
}
