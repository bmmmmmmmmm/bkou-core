import { createMapFromArrays } from "common/data/map"

enum COLOR_TYPE {
  NAMED_COLOR = 'named-color',
  HEX3 = 'hex3',
  HEX6 = 'hex6',
  HEX8 = 'hex8',
  RGB = 'rgb',
  RGBA = 'rgba',
  HSL = 'hsl',
  HSLA = 'hsla',
  HSV = 'hsv',
  HSVA = 'hsva',
  CMYK = 'cmyk'
}

// https://www.w3.org/TR/css-color-4/#named-colors
const NAMED_COLOR_NAME: ReadonlyArray<string> = ['aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'] as const
const NAMED_COLOR_HEX6: ReadonlyArray<string> = ['#f0f8ff', '#faebd7', '#00ffff', '#7fffd4', '#f0ffff', '#f5f5dc', '#ffe4c4', '#000000', '#ffebcd', '#0000ff', '#8a2be2', '#a52a2a', '#deb887', '#5f9ea0', '#7fff00', '#d2691e', '#ff7f50', '#6495ed', '#fff8dc', '#dc143c', '#00ffff', '#00008b', '#008b8b', '#b8860b', '#a9a9a9', '#006400', '#a9a9a9', '#bdb76b', '#8b008b', '#556b2f', '#ff8c00', '#9932cc', '#8b0000', '#e9967a', '#8fbc8f', '#483d8b', '#2f4f4f', '#2f4f4f', '#00ced1', '#9400d3', '#ff1493', '#00bfff', '#696969', '#696969', '#1e90ff', '#b22222', '#fffaf0', '#228b22', '#ff00ff', '#dcdcdc', '#f8f8ff', '#ffd700', '#daa520', '#808080', '#008000', '#adff2f', '#808080', '#f0fff0', '#ff69b4', '#cd5c5c', '#4b0082', '#fffff0', '#f0e68c', '#e6e6fa', '#fff0f5', '#7cfc00', '#fffacd', '#add8e6', '#f08080', '#e0ffff', '#fafad2', '#d3d3d3', '#90ee90', '#d3d3d3', '#ffb6c1', '#ffa07a', '#20b2aa', '#87cefa', '#778899', '#778899', '#b0c4de', '#ffffe0', '#00ff00', '#32cd32', '#faf0e6', '#ff00ff', '#800000', '#66cdaa', '#0000cd', '#ba55d3', '#9370db', '#3cb371', '#7b68ee', '#00fa9a', '#48d1cc', '#c71585', '#191970', '#f5fffa', '#ffe4e1', '#ffe4b5', '#ffdead', '#000080', '#fdf5e6', '#808000', '#6b8e23', '#ffa500', '#ff4500', '#da70d6', '#eee8aa', '#98fb98', '#afeeee', '#db7093', '#ffefd5', '#ffdab9', '#cd853f', '#ffc0cb', '#dda0dd', '#b0e0e6', '#800080', '#663399', '#ff0000', '#bc8f8f', '#4169e1', '#8b4513', '#fa8072', '#f4a460', '#2e8b57', '#fff5ee', '#a0522d', '#c0c0c0', '#87ceeb', '#6a5acd', '#708090', '#708090', '#fffafa', '#00ff7f', '#4682b4', '#d2b48c', '#008080', '#d8bfd8', '#ff6347', '#40e0d0', '#ee82ee', '#f5deb3', '#ffffff', '#f5f5f5', '#ffff00', '#9acd32'] as const

const NAMED_TO_HEX6_MAP = createMapFromArrays(NAMED_COLOR_NAME, NAMED_COLOR_HEX6)
const HEX6_TO_NAMED_MAP = createMapFromArrays(NAMED_COLOR_HEX6, NAMED_COLOR_NAME)

const isNamedColor = (color: string): boolean => NAMED_COLOR_NAME.includes(color)
const canNameHex6 = (color: string): boolean => NAMED_COLOR_HEX6.includes(color)
const REGEXP_HEX3 = /#[0-9a-fA-F]{3}/
const REGEXP_HEX6 = /#[0-9a-fA-F]{6}/
const REGEXP_HEX8 = /#[0-9a-fA-F]{8}/
const REGEXP_LEGACY_RGB = /rgb\((?:(\d+%|\d{1,3})\s*,\s*(\d+%|\d{1,3})\s*,\s*(\d+%|\d{1,3})|(\d+%|\d{1,3})\s*,\s*(\d+%|\d{1,3})\s*,\s*(\d+%|\d{1,3}))\)/
const REGEXP_MODERN_RGB = /rgb\((?:(\d+%|\d{1,3}|)\s+(\d+%|\d{1,3}|)\s+(\d+%|\d{1,3}|)|(\d+%|\d{1,3}|)\s+(\d+%|\d{1,3}|)|(\d+%|\d{1,3}|))\)/
const REGEXP_LEGACY_RGBA = /rgba\((\d{1,3}|(\d{1,3}%))\s*,\s*(\d{1,3}|(\d{1,3}%))\s*,\s*(\d{1,3}|(\d{1,3}%))\s*,\s*(\d{1,3}|(\d{1,3}%)|(?:0?\.\d+|1(\.0+)?)|1)\)/
const REGEXP_MODERN_RGBA = /rgba\(\s*(\d{1,3}|[1-9]?\d{1,2}%?)\s*(\d{1,3}|[1-9]?\d{1,2}%?)?\s*(\d{1,3}|[1-9]?\d{1,2}%?|(?:0?\.\d+|1(?:\.0+)?))?\s*\/\s*(\d{1,3}|[1-9]?\d{1,2}%?|(?:0?\.\d+|1(?:\.0+)?))\s*\)/

// https://www.w3.org/TR/css-color-4/#rgb-functions
type Percentage = `${number}%`
type AlphaValue = number | `${number}` | Percentage

type LegacyRgbSyntax = `rgb(${Percentage}, ${Percentage}, ${Percentage})` | `rgb(${number}, ${number}, ${number})`
type ModernRgbSyntax =
  `rgb(${number | Percentage | ''} ${number | Percentage | ''} ${number | Percentage | ''})` |
  `rgb(${number | Percentage | ''} ${number | Percentage | ''})` |
  `rgb(${number | Percentage | ''})`

type LegacyRgbaSyntax = `rgba(${Percentage}, ${Percentage}, ${Percentage}, ${AlphaValue})` | `rgba(${number}, ${number}, ${number}, ${AlphaValue})`
type ModernRgbaSyntax =
  `rgba(${number | Percentage | ''} ${number | Percentage | ''} ${number | Percentage | ''} / ${AlphaValue | ''})` |
  `rgba(${number | Percentage | ''} ${number | Percentage | ''} ${number | Percentage | ''} /)` |
  `rgba(${number | Percentage | ''} ${number | Percentage | ''} / ${AlphaValue | ''})` |
  `rgba(${number | Percentage | ''} ${number | Percentage | ''} /)` |
  `rgba(${number | Percentage | ''} / ${AlphaValue | ''})` |
  `rgba(${number | Percentage | ''} /)`

type TypeRgb = LegacyRgbSyntax | ModernRgbSyntax
type TypeRgba = LegacyRgbaSyntax | ModernRgbaSyntax

type TypeHex3 = `#${string}`
type TypeHex6 = `#${string}`
type TypeHex8 = `#${string}`

type TypeNamedColor = string

export {
  TypeHex3, TypeHex6, TypeHex8,
  TypeRgb, TypeRgba,
  TypeNamedColor
}

/**
 * ============
 * === test ===
 * ============
 *
 * LegacyRgbSyntax
 * 'rgb(255, 0, 100)'
 * 'rgb(255,0,100)'
 * 'rgb(100%, 0%, 50%)'
 * 'rgb(100%,0%,50%)'
 *
 * ModernRgbSyntax
 * 'rgb(255 10% 100)'
 * 'rgb(255 0 )'
 * 'rgb(255 0)'
 * 'rgb(255% )'
 * 'rgb(255%)'
 *
 * LegacyRgbaSyntax
 * 'rgba(255, 0, 100, 0.5)'
 * 'rgba(255,0,100,50%)'
 * 'rgba(100%, 0%, 50%, 50%)'
 * 'rgba(100%,0%,50%,0.5)'
 *
 * ModernRgbaSyntax
 * 'rgba(255 0 100 / 0.5)'
 * 'rgba(255 10% 100 / 50%)'
 * 'rgba(255 10% 100/0.5)'
 * 'rgba(255 0 100/50%)'
 * 'rgba(255 100/0.5)'
 * 'rgba(10% /50%)'
 * 'rgba(10%/50%)'
 * 'rgba(10%/ 50%)'
 * 
 * HEX3
 * '#aaa'
 * '#333'
 * '#8aA'
 * '#www'
 * '#aaaa'
 * 'aaa'
 * 
 */
