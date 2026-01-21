let ENDIANNESS_CACHED = '';

/**
 * Determines the endianness of the current environment.
 * @returns {'big' | 'little' | 'unknown'}
 */
const getEndianness = () => {
  if (!ENDIANNESS_CACHED) {
    ENDIANNESS_CACHED = 'unknown';
    try {
      const buffer = new ArrayBuffer(2);
      const uint8Array = new Uint8Array(buffer);
      uint8Array[0] = 0x00;
      uint8Array[1] = 0xff;
      const uint16Array = new Uint16Array(buffer);
      if (uint16Array[0] === 0xff00) ENDIANNESS_CACHED = 'big';
      else if (uint16Array[0] === 0x00ff) ENDIANNESS_CACHED = 'little';
    } catch (e) { console.error('[getEndianness]', e) }
  }
  return ENDIANNESS_CACHED;
}

const IS_LITTLE_ENDIAN = () => {
  !ENDIANNESS_CACHED && getEndianness();
  return ENDIANNESS_CACHED === 'little';
};

const IS_BIG_ENDIAN = () => {
  !ENDIANNESS_CACHED && getEndianness();
  return ENDIANNESS_CACHED === 'big';
};

export {
  getEndianness,
  IS_LITTLE_ENDIAN,
  IS_BIG_ENDIAN,
};
