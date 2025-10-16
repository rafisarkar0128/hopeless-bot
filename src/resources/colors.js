module.exports = {
  // red or red-ish colors
  lightCoral: "#F08080",
  salmon: "#FA8072",
  darkSalmon: "#E9967A",
  lightSalmon: "#FFA07A",
  crimson: "#DC143C",
  red: "#FF0000",
  fireBrick: "#B22222",
  darkRed: "#8B0000",
  AmericanRose: "#FF033E",

  // pink or pink-ish colors
  pink: "#FFC0CB",
  lightPink: "#FFB6C1",
  hotPink: "#FF69B4",
  deepPink: "#FF1493",

  // orange or orange-ish colors
  coral: "#FF7F50",
  OrangeRed: "#FF4500",
  darkOrange: "#FF8C00",
  orange: "#FFA500",

  // yellow or yellow-ish colors
  gold: "#FFD700",
  yellow: "#FFFF00",
  lightYellow: "#FFFFE0",
  papayaWhip: "#FFEFD5",
  moccasin: "#FFE4B5",
  peachPuff: "#FFDAB9",
  paleGoldenrod: "#EEE8AA",
  khaki: "#F0E68C",

  // violet or violate-ish colors
  lavender: "#E6E6FA",
  plum: "#DDA0DD",
  violet: "#EE82EE",
  orchid: "#DA70D6",
  magenta: "#FF00FF",
  blueViolet: "#8A2BE2",
  darkViolet: "#9400D3",
  purple: "#800080",
  indigo: "#4B0082",
  slateBlue: "#6A5ACD",
  darkSlateBlue: "#483D8B",

  // green or green-ish colors
  greenYellow: "#ADFF2F",
  lawnGreen: "#7CFC00",
  lime: "#00FF00",
  limeGreen: "#32CD32",
  paleGreen: "#98FB98",
  lightGreen: "#90EE90",
  androidGreen: "#32de84",
  mediumSpringGreen: "#00FA9A",
  springGreen: "#00FF7F",
  seaGreen: "#2E8B57",
  forestGreen: "#228B22",
  green: "#008000",
  darkGreen: "#006400",
  yellowGreen: "#9ACD32",
  olive: "#808000",
  mediumAquamarine: "#66CDAA",
  lightSeaGreen: "#20B2AA",
  darkCyan: "#008B8B",

  // blue or blue-ish colors
  aqua: "#00FFFF",
  cyan: "#00FFFF",
  lightCyan: "#E0FFFF",
  aquamarine: "#7FFFD4",
  turquoise: "#40E0D0",
  darkTurquoise: "#00CED1",
  steelBlue: "#4682B4",
  powderBlue: "#B0E0E6",
  lightBlue: "#ADD8E6",
  skyBlue: "#87CEEB",
  lightSkyBlue: "#87CEFA",
  deepSkyBlue: "#00BFFF",
  dodgerBlue: "#1E90FF",
  cornflowerBlue: "#6495ED",
  royalBlue: "#4169E1",
  blue: "#0000FF",
  darkBlue: "#00008B",
  navy: "#000080",
  midnightBlue: "#191970",

  // brown or brown-ish colors
  cornsilk: "#FFF8DC",
  bisque: "#FFE4C4",
  wheat: "#F5DEB3",
  burlyWood: "#DEB887",
  sandyBrown: "#F4A460",
  chocolate: "#D2691E",
  brown: "#A52A2A",
  maroon: "#800000",

  // white or white-ish colors
  white: "#FFFFFF",
  snow: "#FFFAFA",
  honeyDew: "#F0FFF0",
  mintCream: "#F5FFFA",
  azure: "#f0ffff",
  whiteSmoke: "#F5F5F5",
  seaShell: "#FFF5EE",
  floralWhite: "#FFFAF0",
  lavenderBlush: "#FFF0F5",
  mistyRose: "#FFE4E1",

  // gray or gray-ish colors
  lightGray: "#D3D3D3",
  silver: "#C0C0C0",
  darkGray: "#A9A9A9",
  gray: "#808080",
  dimGray: "#696969",
  lightSlateGray: "#778899",
  slateGray: "#708090",
  darkSlateGray: "#2F4F4F",
  black: "#000000",

  // extra colors
  main: "#90B63E",
  good: "#74a371",
  giveaway: "#FFAF00",
  standby: "#dedc5d",
  wrong: "#de5d5d",
  error: "#d1352f",
  transparent: "#36393F",
  warning: "#F7E919",
  normal: "#5865F2",
  discord: "#7289DA",

  /**
   * Returns a random color from the color object
   * @returns {string}
   * @example client.color.getRandom();
   */
  getRandom() {
    const colorArray = Object.values(this).filter((v) => typeof v === "string");
    return colorArray[Math.floor(Math.random() * colorArray.length)];
  },
};
