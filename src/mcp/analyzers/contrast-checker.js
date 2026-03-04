/**
 * WCAG 2.1 Contrast Ratio Calculator
 *
 * Implements the full WCAG 2.1 contrast calculation algorithm for checking
 * color pair accessibility. Supports hex, rgb(), rgba(), hsl(), hsla(),
 * and CSS named colors.
 *
 * @module contrast-checker
 */

// ---------------------------------------------------------------------------
// CSS Named Colors Map
// ---------------------------------------------------------------------------

/** @type {Record<string, [number, number, number]>} */
const NAMED_COLORS = {
  // 17 standard CSS colors
  black: [0, 0, 0],
  silver: [192, 192, 192],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  white: [255, 255, 255],
  maroon: [128, 0, 0],
  red: [255, 0, 0],
  purple: [128, 0, 128],
  fuchsia: [255, 0, 255],
  green: [0, 128, 0],
  lime: [0, 255, 0],
  olive: [128, 128, 0],
  yellow: [255, 255, 0],
  navy: [0, 0, 128],
  blue: [0, 0, 255],
  teal: [0, 128, 128],
  aqua: [0, 255, 255],
  // Extended common colors
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  coral: [255, 127, 80],
  tomato: [255, 99, 71],
  salmon: [250, 128, 114],
  crimson: [220, 20, 60],
  pink: [255, 192, 203],
  hotpink: [255, 105, 180],
  deeppink: [255, 20, 147],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  darkgoldenrod: [184, 134, 11],
  khaki: [240, 230, 140],
  darkkhaki: [189, 183, 107],
  indigo: [75, 0, 130],
  violet: [238, 130, 238],
  plum: [221, 160, 221],
  orchid: [218, 112, 214],
  magenta: [255, 0, 255],
  darkmagenta: [139, 0, 139],
  mediumpurple: [147, 111, 219],
  rebeccapurple: [102, 51, 153],
  blueviolet: [138, 43, 226],
  darkviolet: [148, 0, 211],
  slateblue: [106, 90, 205],
  darkslateblue: [72, 61, 139],
  mediumslateblue: [123, 104, 238],
  limegreen: [50, 205, 50],
  darkgreen: [0, 100, 0],
  forestgreen: [34, 139, 34],
  seagreen: [46, 139, 87],
  mediumseagreen: [60, 179, 113],
  springgreen: [0, 255, 127],
  mediumspringgreen: [0, 250, 154],
  lightgreen: [144, 238, 144],
  palegreen: [152, 251, 152],
  greenyellow: [173, 255, 47],
  lawngreen: [124, 252, 0],
  chartreuse: [127, 255, 0],
  olivedrab: [107, 142, 35],
  darkolivegreen: [85, 107, 47],
  yellowgreen: [154, 205, 50],
  darkseagreen: [143, 188, 143],
  mediumaquamarine: [102, 205, 170],
  lightseagreen: [32, 178, 170],
  darkcyan: [0, 139, 139],
  cyan: [0, 255, 255],
  darkturquoise: [0, 206, 209],
  turquoise: [64, 224, 208],
  mediumturquoise: [72, 209, 204],
  paleturquoise: [175, 238, 238],
  aquamarine: [127, 255, 212],
  cadetblue: [95, 158, 160],
  steelblue: [70, 130, 180],
  lightsteelblue: [176, 196, 222],
  cornflowerblue: [100, 149, 237],
  royalblue: [65, 105, 225],
  dodgerblue: [30, 144, 255],
  deepskyblue: [0, 191, 255],
  lightskyblue: [135, 206, 250],
  skyblue: [135, 206, 235],
  lightblue: [173, 216, 230],
  powderblue: [176, 224, 230],
  mediumblue: [0, 0, 205],
  darkblue: [0, 0, 139],
  midnightblue: [25, 25, 112],
  aliceblue: [240, 248, 255],
  azure: [240, 255, 255],
  mintcream: [245, 255, 250],
  honeydew: [240, 255, 240],
  ghostwhite: [248, 248, 255],
  whitesmoke: [245, 245, 245],
  floralwhite: [255, 250, 240],
  ivory: [255, 255, 240],
  beige: [245, 245, 220],
  linen: [250, 240, 230],
  oldlace: [253, 245, 230],
  antiquewhite: [250, 235, 215],
  bisque: [255, 228, 196],
  blanchedalmond: [255, 235, 205],
  cornsilk: [255, 248, 220],
  lemonchiffon: [255, 250, 205],
  lightyellow: [255, 255, 224],
  lightgoldenrodyellow: [250, 250, 210],
  papayawhip: [255, 239, 213],
  moccasin: [255, 228, 181],
  peachpuff: [255, 218, 185],
  palegoldenrod: [238, 232, 170],
  wheat: [245, 222, 179],
  navajowhite: [255, 222, 173],
  burlywood: [222, 184, 135],
  tan: [210, 180, 140],
  sandybrown: [244, 164, 96],
  peru: [205, 133, 63],
  chocolate: [210, 105, 30],
  saddlebrown: [139, 69, 19],
  sienna: [160, 82, 45],
  brown: [165, 42, 42],
  firebrick: [178, 34, 34],
  darkred: [139, 0, 0],
  indianred: [205, 92, 92],
  lightcoral: [240, 128, 128],
  rosybrown: [188, 143, 143],
  darksalmon: [233, 150, 122],
  lightsalmon: [255, 160, 122],
  mistyrose: [255, 228, 225],
  lavenderblush: [255, 240, 245],
  lavender: [230, 230, 250],
  thistle: [216, 191, 216],
  snow: [255, 250, 250],
  seashell: [255, 245, 238],
  gainsboro: [220, 220, 220],
  lightgray: [211, 211, 211],
  lightgrey: [211, 211, 211],
  darkgray: [169, 169, 169],
  darkgrey: [169, 169, 169],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
};

// ---------------------------------------------------------------------------
// Color Parsing
// ---------------------------------------------------------------------------

/**
 * Parse a color string into RGB components.
 * Supports: hex (#xxx, #xxxxxx, #xxxx, #xxxxxxxx), rgb(), rgba(), hsl(), hsla(), named colors.
 *
 * @param {string} colorStr - Color string to parse
 * @returns {{ r: number, g: number, b: number, a: number }} RGB values (0-255) and alpha (0-1)
 * @throws {Error} If the color string cannot be parsed
 */
function parseColor(colorStr) {
  if (!colorStr || typeof colorStr !== 'string') {
    return null;
  }

  const str = colorStr.trim().toLowerCase();

  // Named color
  if (NAMED_COLORS[str]) {
    const [r, g, b] = NAMED_COLORS[str];
    return { r, g, b, a: 1 };
  }

  // Hex: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
  const hexMatch = str.match(/^#([0-9a-f]{3,8})$/);
  if (hexMatch) {
    const hex = hexMatch[1];

    if (hex.length === 3) {
      // #RGB
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }

    if (hex.length === 4) {
      // #RGBA
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: parseInt(hex[3] + hex[3], 16) / 255,
      };
    }

    if (hex.length === 6) {
      // #RRGGBB
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }

    if (hex.length === 8) {
      // #RRGGBBAA
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: parseInt(hex.slice(6, 8), 16) / 255,
      };
    }
  }

  // rgb(r, g, b) or rgb(r g b)
  const rgbMatch = str.match(/^rgb\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*\)$/);
  if (rgbMatch) {
    return {
      r: Math.min(255, parseInt(rgbMatch[1], 10)),
      g: Math.min(255, parseInt(rgbMatch[2], 10)),
      b: Math.min(255, parseInt(rgbMatch[3], 10)),
      a: 1,
    };
  }

  // rgba(r, g, b, a) or rgba(r g b / a)
  const rgbaMatch = str.match(
    /^rgba?\(\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,\s]\s*(\d{1,3})\s*[,/]\s*([\d.]+%?)\s*\)$/
  );
  if (rgbaMatch) {
    let alpha = parseFloat(rgbaMatch[4]);
    if (rgbaMatch[4].endsWith('%')) alpha = alpha / 100;
    return {
      r: Math.min(255, parseInt(rgbaMatch[1], 10)),
      g: Math.min(255, parseInt(rgbaMatch[2], 10)),
      b: Math.min(255, parseInt(rgbaMatch[3], 10)),
      a: Math.min(1, Math.max(0, alpha)),
    };
  }

  // hsl(h, s%, l%) or hsl(h s% l%)
  const hslMatch = str.match(
    /^hsla?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)%\s*[,\s]\s*([\d.]+)%\s*(?:[,/]\s*([\d.]+%?))?\s*\)$/
  );
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]) % 360;
    const s = Math.min(100, Math.max(0, parseFloat(hslMatch[2]))) / 100;
    const l = Math.min(100, Math.max(0, parseFloat(hslMatch[3]))) / 100;
    let alpha = 1;
    if (hslMatch[4] !== undefined) {
      alpha = parseFloat(hslMatch[4]);
      if (hslMatch[4].endsWith('%')) alpha = alpha / 100;
    }

    // HSL to RGB conversion
    const { r, g, b } = hslToRgb(h, s, l);
    return { r, g, b, a: Math.min(1, Math.max(0, alpha)) };
  }

  // Unparseable color (e.g., CSS variable, custom function)
  return null;
}

/**
 * Convert HSL to RGB.
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-1)
 * @param {number} l - Lightness (0-1)
 * @returns {{ r: number, g: number, b: number }} RGB values (0-255)
 */
function hslToRgb(h, s, l) {
  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hueToRgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hNorm = h / 360;

  return {
    r: Math.round(hueToRgb(p, q, hNorm + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hNorm) * 255),
    b: Math.round(hueToRgb(p, q, hNorm - 1 / 3) * 255),
  };
}

// ---------------------------------------------------------------------------
// WCAG Luminance & Contrast
// ---------------------------------------------------------------------------

/**
 * Convert a single sRGB channel value (0-255) to linear RGB.
 * Uses the WCAG 2.1 formula.
 *
 * @param {number} channel - sRGB channel value (0-255)
 * @returns {number} Linear RGB value (0-1)
 */
function srgbToLinear(channel) {
  const c = channel / 255;
  if (c <= 0.03928) {
    return c / 12.92;
  }
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Calculate relative luminance per WCAG 2.1.
 * Formula: L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 * where R, G, B are linear RGB values.
 *
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number} Relative luminance (0-1)
 */
function relativeLuminance(r, g, b) {
  const rLin = srgbToLinear(r);
  const gLin = srgbToLinear(g);
  const bLin = srgbToLinear(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Calculate contrast ratio between two colors.
 * Formula: (L1 + 0.05) / (L2 + 0.05) where L1 >= L2
 *
 * @param {{ r: number, g: number, b: number }} color1 - First color (RGB 0-255)
 * @param {{ r: number, g: number, b: number }} color2 - Second color (RGB 0-255)
 * @returns {number} Contrast ratio (1-21)
 */
function contrastRatio(color1, color2) {
  const l1 = relativeLuminance(color1.r, color1.g, color1.b);
  const l2 = relativeLuminance(color2.r, color2.g, color2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a contrast ratio meets WCAG requirements.
 *
 * WCAG 2.1 thresholds:
 * - Normal text:  AA >= 4.5:1, AAA >= 7:1
 * - Large text (>=18pt or >=14pt bold): AA >= 3:1, AAA >= 4.5:1
 * - UI components and graphical objects: AA >= 3:1
 *
 * @param {number} ratio - Contrast ratio
 * @param {'AA'|'AAA'} [level='AA'] - WCAG conformance level
 * @param {'normal'|'large'|'ui'} [textSize='normal'] - Text size category
 * @returns {{ AA: boolean, AAA: boolean }}
 */
function meetsWCAG(ratio, level, textSize) {
  const size = textSize || 'normal';

  let aaThreshold;
  let aaaThreshold;

  switch (size) {
    case 'large':
      aaThreshold = 3;
      aaaThreshold = 4.5;
      break;
    case 'ui':
      aaThreshold = 3;
      aaaThreshold = 3; // No AAA requirement specified for UI components
      break;
    case 'normal':
    default:
      aaThreshold = 4.5;
      aaaThreshold = 7;
      break;
  }

  return {
    AA: ratio >= aaThreshold,
    AAA: ratio >= aaaThreshold,
  };
}

/**
 * Composite a semi-transparent foreground color over an opaque background.
 * Uses the standard alpha compositing formula:
 *   result = fg * alpha + bg * (1 - alpha)
 *
 * @param {{ r: number, g: number, b: number, a: number }} fg - Foreground color with alpha
 * @param {{ r: number, g: number, b: number }} bg - Background color (assumed opaque)
 * @returns {{ r: number, g: number, b: number }}
 */
function alphaComposite(fg, bg) {
  const a = fg.a;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
  };
}

/**
 * Check a foreground/background color pair for WCAG compliance.
 * If the foreground has alpha transparency, it will be composited over the background
 * before checking contrast.
 *
 * @param {string} foreground - Foreground color string
 * @param {string} background - Background color string
 * @returns {{ ratio: number, AA: boolean, AAA: boolean, AAlarge: boolean, AAAlarge: boolean, AAui: boolean, foreground: { r: number, g: number, b: number }, background: { r: number, g: number, b: number } }}
 */
function checkColorPair(foreground, background) {
  const fg = parseColor(foreground);
  const bg = parseColor(background);

  // Return null if either color couldn't be parsed
  if (!fg || !bg) return null;

  // Handle alpha compositing if foreground has transparency
  let effectiveFg;
  if (fg.a < 1) {
    effectiveFg = alphaComposite(fg, bg);
  } else {
    effectiveFg = { r: fg.r, g: fg.g, b: fg.b };
  }

  const bgColor = { r: bg.r, g: bg.g, b: bg.b };
  const ratio = contrastRatio(effectiveFg, bgColor);

  const normalWcag = meetsWCAG(ratio, 'AA', 'normal');
  const largeWcag = meetsWCAG(ratio, 'AA', 'large');
  const uiWcag = meetsWCAG(ratio, 'AA', 'ui');

  return {
    ratio: Math.round(ratio * 100) / 100,
    AA: normalWcag.AA,
    AAA: normalWcag.AAA,
    AAlarge: largeWcag.AA,
    AAAlarge: largeWcag.AAA,
    AAui: uiWcag.AA,
    foreground: effectiveFg,
    background: bgColor,
  };
}

/**
 * Find the minimum opacity at which a foreground color over a background
 * still meets the given contrast threshold.
 *
 * @param {string} foreground - Foreground color string (ignoring any existing alpha)
 * @param {string} background - Background color string
 * @param {number} [threshold=4.5] - Required contrast ratio
 * @returns {number|null} Minimum alpha (0-1) or null if even 100% opacity fails
 */
function findMinimumOpacity(foreground, background, threshold) {
  const target = threshold || 4.5;
  const fg = parseColor(foreground);
  const bg = parseColor(background);

  // Check if full opacity meets the threshold
  const fullOpacityRatio = contrastRatio(
    { r: fg.r, g: fg.g, b: fg.b },
    { r: bg.r, g: bg.g, b: bg.b }
  );
  if (fullOpacityRatio < target) {
    return null; // Cannot meet threshold even at full opacity
  }

  // Binary search for minimum alpha
  let lo = 0;
  let hi = 1;
  while (hi - lo > 0.01) {
    const mid = (lo + hi) / 2;
    const composite = alphaComposite({ ...fg, a: mid }, bg);
    const ratio = contrastRatio(composite, { r: bg.r, g: bg.g, b: bg.b });
    if (ratio >= target) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  return Math.ceil(hi * 100) / 100;
}

/**
 * Suggest an accessible alternative for a failing color pair.
 * Adjusts the foreground color to meet the target contrast ratio.
 *
 * @param {string} foreground - Original foreground color
 * @param {string} background - Background color
 * @param {number} [targetRatio=4.5] - Target contrast ratio
 * @returns {{ original: string, suggested: string, originalRatio: number, suggestedRatio: number }|null}
 */
function suggestAccessibleColor(foreground, background, targetRatio) {
  const target = targetRatio || 4.5;
  const fg = parseColor(foreground);
  const bg = parseColor(background);

  const originalRatio = contrastRatio(fg, bg);
  if (originalRatio >= target) {
    return null; // Already meets the threshold
  }

  const bgLum = relativeLuminance(bg.r, bg.g, bg.b);

  // Determine direction: darken foreground if bg is light, lighten if bg is dark
  const shouldDarken = bgLum > 0.5;

  // Binary search for the right lightness adjustment
  let lo = 0;
  let hi = 1;
  let bestColor = fg;

  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    let adjusted;
    if (shouldDarken) {
      adjusted = {
        r: Math.round(fg.r * (1 - mid)),
        g: Math.round(fg.g * (1 - mid)),
        b: Math.round(fg.b * (1 - mid)),
      };
    } else {
      adjusted = {
        r: Math.round(fg.r + (255 - fg.r) * mid),
        g: Math.round(fg.g + (255 - fg.g) * mid),
        b: Math.round(fg.b + (255 - fg.b) * mid),
      };
    }

    const ratio = contrastRatio(adjusted, bg);
    if (ratio >= target) {
      bestColor = adjusted;
      hi = mid;
    } else {
      lo = mid;
    }
  }

  const suggestedHex = `#${bestColor.r.toString(16).padStart(2, '0')}${bestColor.g.toString(16).padStart(2, '0')}${bestColor.b.toString(16).padStart(2, '0')}`;

  return {
    original: foreground,
    suggested: suggestedHex,
    originalRatio: Math.round(originalRatio * 100) / 100,
    suggestedRatio: Math.round(contrastRatio(bestColor, bg) * 100) / 100,
  };
}

module.exports = {
  parseColor,
  relativeLuminance,
  contrastRatio,
  meetsWCAG,
  checkColorPair,
  alphaComposite,
  hslToRgb,
  findMinimumOpacity,
  suggestAccessibleColor,
  NAMED_COLORS,
};
