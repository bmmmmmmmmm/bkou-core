function createMapFromArrays<K, V> (keys: readonly K[] | K[], values: readonly V[] | V[]): Map<K, V> {
  if (keys.length !== values.length) {
    throw new Error('Keys and values must have the same length');
  }
  return new Map<K, V>(keys.map((key, index) => [key, values[index]] as [K, V]));
}

export {
  createMapFromArrays,
}
