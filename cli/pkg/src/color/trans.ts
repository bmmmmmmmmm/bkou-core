
const HexToDec = (c) => {
  if (RegExp(/^[a-f|0-9]+$/i).test(c)) {
    return parseInt(c, 16)
  }
}

/**
 * @description RGBA 覆盖在 RGB 背景色上所呈现出的视觉 RGB 颜色
 * */
export const rgba2rgb = (RGBA_color, RGB_background) => { // RGBA_color and RGB_background are hex values, without the leading #
  const ca = { r: HexToDec(RGBA_color.substr(0, 2)), g: HexToDec(RGBA_color.substr(2, 2)), b: HexToDec(RGBA_color.substr(4, 2)), a: HexToDec(RGBA_color.substr(6, 2)) / 255 }
  const ba = { r: HexToDec(RGB_background.substr(0, 2)), g: HexToDec(RGB_background.substr(2, 2)), b: HexToDec(RGB_background.substr(4, 2)) }
  let a = ca.a
  if (isNaN(a)) a = 1
  const modR = Math.round((1 - a) * ba.r + a * ca.r)
  const modG = Math.round((1 - a) * ba.g + a * ca.g)
  const modB = Math.round((1 - a) * ba.b + a * ca.b)
  const modColor = ('0' + modR.toString(16)).slice(-2) + ('0' + modG.toString(16)).slice(-2) + ('0' + modB.toString(16)).slice(-2)
  return modColor
}

/**
 * @description 获取颜色的相对亮度，参考 https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
const getL = (HEX6) => {
  let R, G, B
  const RsRGB = HexToDec(HEX6.substr(0, 2)) / 255
  const GsRGB = HexToDec(HEX6.substr(2, 2)) / 255
  const BsRGB = HexToDec(HEX6.substr(4, 2)) / 255
  if (RsRGB <= 0.03928) R = RsRGB / 12.92; else R = Math.pow((RsRGB + 0.055) / 1.055, 2.4)
  if (GsRGB <= 0.03928) G = GsRGB / 12.92; else G = Math.pow((GsRGB + 0.055) / 1.055, 2.4)
  if (BsRGB <= 0.03928) B = BsRGB / 12.92; else B = Math.pow((BsRGB + 0.055) / 1.055, 2.4)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

/**
 * @description 获取两个颜色的对比度，参考 https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export const getContrast = (HEX6A, HEX6B) => {
  const L1 = getL(HEX6A)
  const L2 = getL(HEX6B)
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
}
