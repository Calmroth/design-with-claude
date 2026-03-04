/**
 * Code Analyzer - Central module for extracting design-relevant properties
 * from JSX/TSX/HTML/CSS files using regex-based parsing (no AST dependency).
 *
 * Capabilities:
 * - Parse JSX/TSX: extract component props, event handlers, ARIA attributes, className usage
 * - Parse CSS: extract property values (colors, spacing, border-radius, transitions, font properties)
 * - Parse inline styles: extract style objects from JSX
 * - Detect patterns: token references (var(--...), theme.xxx) vs hardcoded values
 * - Detect states: presence of :hover, :focus, :disabled, :active in CSS; conditional classes in JSX
 * - Extract color pairs: foreground + background combinations for contrast checking
 *
 * @module code-analyzer
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Return all regex matches with line numbers.
 * @param {string} content - File content to search
 * @param {RegExp} regex - Pattern (must have the global flag)
 * @returns {{ match: RegExpExecArray, line: number }[]}
 */
function matchesWithLines(content, regex) {
  const results = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    let m;
    const lineRegex = new RegExp(regex.source, regex.flags.replace('g', ''));
    while ((m = regex.exec(lines[i])) !== null) {
      results.push({ match: m, line: i + 1 });
      // Prevent infinite loops on zero-length matches
      if (m.index === regex.lastIndex) regex.lastIndex++;
      break; // one match per line per iteration is enough for line-level detection
    }
    // Reset regex for per-line usage
    regex.lastIndex = 0;
  }
  // Re-scan globally for multi-match lines
  return results;
}

/**
 * Lightweight global match iterator that also tracks line numbers.
 * @param {string} content
 * @param {RegExp} regex - Must have the `g` flag
 * @returns {{ value: string, groups: object|undefined, index: number, line: number }[]}
 */
function allMatches(content, regex) {
  const results = [];
  const lineStarts = [0];
  for (let i = 0; i < content.length; i++) {
    if (content[i] === '\n') lineStarts.push(i + 1);
  }

  let m;
  while ((m = regex.exec(content)) !== null) {
    // Binary search for the line number
    let lo = 0;
    let hi = lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lineStarts[mid] <= m.index) lo = mid;
      else hi = mid - 1;
    }
    results.push({
      value: m[0],
      groups: m.groups,
      captures: Array.from(m).slice(1),
      index: m.index,
      line: lo + 1,
    });
    if (m.index === regex.lastIndex) regex.lastIndex++;
  }
  return results;
}

// ---------------------------------------------------------------------------
// CSS named colors (common subset for detection)
// ---------------------------------------------------------------------------

const CSS_NAMED_COLORS = new Set([
  'black', 'silver', 'gray', 'grey', 'white', 'maroon', 'red', 'purple',
  'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal',
  'aqua', 'orange', 'aliceblue', 'antiquewhite', 'aquamarine', 'azure',
  'beige', 'bisque', 'blanchedalmond', 'blueviolet', 'brown', 'burlywood',
  'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue',
  'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod',
  'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta',
  'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon',
  'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey',
  'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray',
  'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen',
  'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'greenyellow',
  'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki',
  'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue',
  'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray',
  'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen',
  'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue',
  'lightyellow', 'limegreen', 'linen', 'magenta', 'mediumaquamarine',
  'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
  'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
  'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose',
  'moccasin', 'navajowhite', 'oldlace', 'olivedrab', 'orangered',
  'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
  'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum',
  'powderblue', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon',
  'sandybrown', 'seagreen', 'seashell', 'sienna', 'skyblue', 'slateblue',
  'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan',
  'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'whitesmoke',
  'yellowgreen', 'rebeccapurple', 'transparent', 'currentcolor',
]);

// ---------------------------------------------------------------------------
// Tailwind color class pattern
// ---------------------------------------------------------------------------

const TW_COLOR_PREFIXES = [
  'bg', 'text', 'border', 'ring', 'outline', 'fill', 'stroke',
  'decoration', 'accent', 'caret', 'shadow', 'divide', 'placeholder',
  'from', 'via', 'to',
];

const TW_COLOR_NAMES = [
  'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber',
  'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue',
  'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
  'black', 'white', 'transparent', 'current', 'inherit',
];

// Build regex for Tailwind color classes
const twColorPrefixGroup = TW_COLOR_PREFIXES.join('|');
const twColorNameGroup = TW_COLOR_NAMES.join('|');
const TW_COLOR_CLASS_RE = new RegExp(
  `(?:^|\\s|"|'|\`)(?:(?:hover|focus|active|disabled|dark|lg|md|sm|xl|2xl):)*(${twColorPrefixGroup})-(${twColorNameGroup})(?:-(\\d{1,3}(?:\\/\\d+)?))?(?=\\s|"|'|\`|$)`,
  'g'
);

// ---------------------------------------------------------------------------
// Extraction functions
// ---------------------------------------------------------------------------

/**
 * Extract JSX/TSX component usages.
 * @param {string} content - File content
 * @param {string} ext - File extension
 * @returns {{ name: string, props: string[], hasChildren: boolean }[]}
 */
function extractComponents(content, ext) {
  if (!['.jsx', '.tsx', '.js', '.ts'].includes(ext)) return [];

  const components = [];
  const seen = new Map();

  // Match <ComponentName ... > or <ComponentName ... /> (uppercase first letter)
  const componentRe = /<([A-Z][A-Za-z0-9_.]*)\s*((?:[^>]*?))(\/?>)/g;
  let m;
  while ((m = componentRe.exec(content)) !== null) {
    const name = m[1];
    const attrsStr = m[2];
    const closing = m[3];

    // Extract prop names from the attributes string
    const propRe = /([a-zA-Z_$][\w$-]*)(?:\s*=)/g;
    const props = [];
    let pm;
    while ((pm = propRe.exec(attrsStr)) !== null) {
      props.push(pm[1]);
    }

    // Also detect spread props
    if (/\{\.\.\./.test(attrsStr)) {
      props.push('...spread');
    }

    // Check if self-closing
    const isSelfClosing = closing === '/>';
    // For non-self-closing, check if there's a matching closing tag nearby
    const hasChildren = !isSelfClosing;

    if (seen.has(name)) {
      // Merge props
      const existing = seen.get(name);
      for (const p of props) {
        if (!existing.props.includes(p)) existing.props.push(p);
      }
      if (hasChildren) existing.hasChildren = true;
    } else {
      const entry = { name, props, hasChildren };
      seen.set(name, entry);
      components.push(entry);
    }
  }

  return components;
}

/**
 * Extract color values from CSS, inline styles, and Tailwind classes.
 * @param {string} content - File content
 * @returns {{ value: string, property: string, line: number, isToken: boolean }[]}
 */
function extractColors(content) {
  const colors = [];

  // Hex colors: #xxx, #xxxxxx, #xxxxxxxx
  const hexRe = /(?:color|background(?:-color)?|border(?:-color)?|fill|stroke|outline-color|text-decoration-color|box-shadow|stop-color)\s*:\s*(#(?:[0-9a-fA-F]{3,4}){1,2})\b/g;
  for (const m of allMatches(content, hexRe)) {
    colors.push({ value: m.captures[0], property: m.value.split(':')[0].trim(), line: m.line, isToken: false });
  }

  // Standalone hex colors in style objects or other contexts
  const hexStandaloneRe = /(?:['"])(#(?:[0-9a-fA-F]{3,4}){1,2})\b/g;
  for (const m of allMatches(content, hexStandaloneRe)) {
    // Avoid duplicates from the CSS property scan
    const alreadyFound = colors.some(c => c.value === m.captures[0] && c.line === m.line);
    if (!alreadyFound) {
      colors.push({ value: m.captures[0], property: 'unknown', line: m.line, isToken: false });
    }
  }

  // rgb/rgba/hsl/hsla
  const funcColorRe = /(?:color|background(?:-color)?|border(?:-color)?|fill|stroke|outline-color)\s*:\s*((?:rgba?|hsla?)\([^)]+\))/g;
  for (const m of allMatches(content, funcColorRe)) {
    colors.push({ value: m.captures[0], property: m.value.split(':')[0].trim(), line: m.line, isToken: false });
  }

  // Functional colors in style objects
  const funcStandaloneRe = /['"]?(rgba?|hsla?)\(([^)]+)\)/g;
  for (const m of allMatches(content, funcStandaloneRe)) {
    const alreadyFound = colors.some(c => c.value === m.value && c.line === m.line);
    if (!alreadyFound) {
      colors.push({ value: m.value, property: 'unknown', line: m.line, isToken: false });
    }
  }

  // CSS custom property references for color properties
  const varColorRe = /(?:color|background(?:-color)?|border(?:-color)?|fill|stroke)\s*:\s*(var\(--[^)]+\))/g;
  for (const m of allMatches(content, varColorRe)) {
    colors.push({ value: m.captures[0], property: m.value.split(':')[0].trim(), line: m.line, isToken: true });
  }

  // Named CSS colors in property values
  const namedColorPattern = Array.from(CSS_NAMED_COLORS).join('|');
  const namedColorRe = new RegExp(
    `(?:color|background(?:-color)?|border(?:-color)?|fill|stroke)\\s*:\\s*\\b(${namedColorPattern})\\b`,
    'gi'
  );
  for (const m of allMatches(content, namedColorRe)) {
    if (CSS_NAMED_COLORS.has(m.captures[0].toLowerCase())) {
      colors.push({ value: m.captures[0].toLowerCase(), property: m.value.split(':')[0].trim(), line: m.line, isToken: false });
    }
  }

  // Tailwind color classes
  const twRe = new RegExp(TW_COLOR_CLASS_RE.source, TW_COLOR_CLASS_RE.flags);
  for (const m of allMatches(content, twRe)) {
    const prefix = m.captures[0];
    const colorName = m.captures[1];
    const shade = m.captures[2] || '';
    const twClass = shade ? `${prefix}-${colorName}-${shade}` : `${prefix}-${colorName}`;
    colors.push({ value: twClass, property: prefix, line: m.line, isToken: true });
  }

  return colors;
}

/**
 * Extract spacing values (padding, margin, gap, insets).
 * @param {string} content - File content
 * @returns {{ value: string, property: string, line: number, isToken: boolean }[]}
 */
function extractSpacing(content) {
  const spacing = [];

  // CSS spacing properties
  const cssSpacingRe = /\b(padding|margin|gap|row-gap|column-gap|top|right|bottom|left|padding-(?:top|right|bottom|left)|margin-(?:top|right|bottom|left)|inset)\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, cssSpacingRe)) {
    const prop = m.captures[0];
    const val = m.captures[1].trim();
    const isToken = /var\(--/.test(val);
    spacing.push({ value: val, property: prop, line: m.line, isToken });
  }

  // Tailwind spacing classes
  const twSpacingRe = /(?:^|\s|"|'|`)(?:(?:hover|focus|active|disabled|dark|lg|md|sm|xl|2xl):)*(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|inset|top|right|bottom|left)-(\[?[\w./]+\]?)(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twSpacingRe)) {
    const prefix = m.captures[0];
    const val = m.captures[1];
    spacing.push({ value: `${prefix}-${val}`, property: prefix, line: m.line, isToken: true });
  }

  // Negative Tailwind spacing (e.g., -mt-4)
  const twNegSpacingRe = /(?:^|\s|"|'|`)-(m|mx|my|mt|mr|mb|ml|top|right|bottom|left|inset)-(\[?[\w./]+\]?)(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twNegSpacingRe)) {
    const prefix = m.captures[0];
    const val = m.captures[1];
    spacing.push({ value: `-${prefix}-${val}`, property: prefix, line: m.line, isToken: true });
  }

  return spacing;
}

/**
 * Extract border-radius values.
 * @param {string} content - File content
 * @returns {{ value: string, line: number, isToken: boolean }[]}
 */
function extractBorderRadius(content) {
  const radii = [];

  // CSS border-radius
  const cssRe = /border-radius\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, cssRe)) {
    const val = m.captures[0].trim();
    const isToken = /var\(--/.test(val);
    radii.push({ value: val, line: m.line, isToken });
  }

  // Individual corners
  const cornerRe = /border-(top-left|top-right|bottom-left|bottom-right)-radius\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, cornerRe)) {
    const val = m.captures[1].trim();
    const isToken = /var\(--/.test(val);
    radii.push({ value: val, line: m.line, isToken });
  }

  // Tailwind rounded classes
  const twRoundedRe = /(?:^|\s|"|'|`)(?:(?:hover|focus|active|disabled|dark|lg|md|sm|xl|2xl):)*(rounded(?:-(?:t|b|l|r|tl|tr|bl|br|s|e|ss|se|es|ee))?(?:-(?:none|sm|md|lg|xl|2xl|3xl|full|\[[\w.]+\]))?)(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twRoundedRe)) {
    radii.push({ value: m.captures[0], line: m.line, isToken: true });
  }

  return radii;
}

/**
 * Extract typography-related values.
 * @param {string} content - File content
 * @returns {{ fontSizes: Array, fontWeights: Array, fontFamilies: Array, lineHeights: Array }}
 */
function extractTypography(content) {
  const fontSizes = [];
  const fontWeights = [];
  const fontFamilies = [];
  const lineHeights = [];

  // CSS font-size
  const fontSizeRe = /font-size\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, fontSizeRe)) {
    const val = m.captures[0].trim();
    fontSizes.push({ value: val, line: m.line, isToken: /var\(--/.test(val) });
  }

  // CSS font-weight
  const fontWeightRe = /font-weight\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, fontWeightRe)) {
    const val = m.captures[0].trim();
    fontWeights.push({ value: val, line: m.line, isToken: /var\(--/.test(val) });
  }

  // CSS font-family
  const fontFamilyRe = /font-family\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, fontFamilyRe)) {
    const val = m.captures[0].trim();
    fontFamilies.push({ value: val, line: m.line, isToken: /var\(--/.test(val) });
  }

  // CSS line-height
  const lineHeightRe = /line-height\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, lineHeightRe)) {
    const val = m.captures[0].trim();
    lineHeights.push({ value: val, line: m.line, isToken: /var\(--/.test(val) });
  }

  // Tailwind font-size classes: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, etc.
  const twFontSizeRe = /(?:^|\s|"|'|`)(text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[[\w.]+\]))(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twFontSizeRe)) {
    fontSizes.push({ value: m.captures[0], line: m.line, isToken: true });
  }

  // Tailwind font-weight classes: font-thin, font-light, font-normal, font-medium, font-semibold, font-bold, font-extrabold, font-black
  const twFontWeightRe = /(?:^|\s|"|'|`)(font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black))(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twFontWeightRe)) {
    fontWeights.push({ value: m.captures[0], line: m.line, isToken: true });
  }

  // Tailwind font-family classes: font-sans, font-serif, font-mono
  const twFontFamilyRe = /(?:^|\s|"|'|`)(font-(?:sans|serif|mono))(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twFontFamilyRe)) {
    fontFamilies.push({ value: m.captures[0], line: m.line, isToken: true });
  }

  // Tailwind line-height classes: leading-none, leading-tight, leading-snug, leading-normal, leading-relaxed, leading-loose, leading-N
  const twLineHeightRe = /(?:^|\s|"|'|`)(leading-(?:none|tight|snug|normal|relaxed|loose|\d+|\[[\w.]+\]))(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twLineHeightRe)) {
    lineHeights.push({ value: m.captures[0], line: m.line, isToken: true });
  }

  return { fontSizes, fontWeights, fontFamilies, lineHeights };
}

/**
 * Extract animation and transition values.
 * @param {string} content - File content
 * @returns {{ transitions: Array, durations: Array, easings: Array, keyframes: Array }}
 */
function extractAnimations(content) {
  const transitions = [];
  const durations = [];
  const easings = [];
  const keyframes = [];

  // CSS transition property
  const transitionRe = /transition\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, transitionRe)) {
    transitions.push({ value: m.captures[0].trim(), line: m.line });
  }

  // CSS transition-duration
  const durationRe = /(?:transition-duration|animation-duration)\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, durationRe)) {
    durations.push({ value: m.captures[0].trim(), line: m.line });
  }

  // CSS transition-timing-function / animation-timing-function
  const easingRe = /(?:transition-timing-function|animation-timing-function)\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, easingRe)) {
    easings.push({ value: m.captures[0].trim(), line: m.line });
  }

  // CSS animation property
  const animationRe = /animation\s*:\s*([^;}{]+)/g;
  for (const m of allMatches(content, animationRe)) {
    transitions.push({ value: m.captures[0].trim(), line: m.line });
  }

  // CSS @keyframes
  const keyframeRe = /@keyframes\s+([\w-]+)/g;
  for (const m of allMatches(content, keyframeRe)) {
    keyframes.push({ name: m.captures[0], line: m.line });
  }

  // Tailwind transition classes
  const twTransitionRe = /(?:^|\s|"|'|`)(transition(?:-(?:all|colors|opacity|shadow|transform|none))?)(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twTransitionRe)) {
    transitions.push({ value: m.captures[0], line: m.line });
  }

  // Tailwind duration classes
  const twDurationRe = /(?:^|\s|"|'|`)(duration-(?:\d+|\[[\w.]+\]))(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twDurationRe)) {
    durations.push({ value: m.captures[0], line: m.line });
  }

  // Tailwind ease classes
  const twEaseRe = /(?:^|\s|"|'|`)(ease-(?:linear|in|out|in-out|\[[\w.,()]+\]))(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twEaseRe)) {
    easings.push({ value: m.captures[0], line: m.line });
  }

  // Tailwind animate classes
  const twAnimateRe = /(?:^|\s|"|'|`)(animate-(?:none|spin|ping|pulse|bounce|\[[\w-]+\]))(?=\s|"|'|`|$)/g;
  for (const m of allMatches(content, twAnimateRe)) {
    keyframes.push({ name: m.captures[0], line: m.line });
  }

  return { transitions, durations, easings, keyframes };
}

/**
 * Extract ARIA attributes and role attributes.
 * @param {string} content - File content
 * @returns {{ attribute: string, value: string, line: number }[]}
 */
function extractAriaAttributes(content) {
  const attrs = [];

  // aria-* attributes
  const ariaRe = /(aria-[\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}))?/g;
  for (const m of allMatches(content, ariaRe)) {
    const attribute = m.captures[0];
    const value = m.captures[1] || m.captures[2] || m.captures[3] || '';
    attrs.push({ attribute, value, line: m.line });
  }

  // role attribute
  const roleRe = /\brole\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g;
  for (const m of allMatches(content, roleRe)) {
    const value = m.captures[0] || m.captures[1] || m.captures[2] || '';
    attrs.push({ attribute: 'role', value, line: m.line });
  }

  // tabIndex / tabindex
  const tabIndexRe = /\btab[Ii]ndex\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g;
  for (const m of allMatches(content, tabIndexRe)) {
    const value = m.captures[0] || m.captures[1] || m.captures[2] || '';
    attrs.push({ attribute: 'tabIndex', value, line: m.line });
  }

  return attrs;
}

/**
 * Detect interactive states handled in the content.
 * @param {string} content - File content
 * @param {string} ext - File extension
 * @returns {{ hover: boolean, focus: boolean, active: boolean, disabled: boolean, loading: boolean, error: boolean, focusVisible: boolean }}
 */
function extractStates(content, ext) {
  const states = {
    hover: false,
    focus: false,
    active: false,
    disabled: false,
    loading: false,
    error: false,
    focusVisible: false,
  };

  // CSS pseudo-classes
  if (/:\s*hover\b/.test(content)) states.hover = true;
  if (/:\s*focus\b/.test(content)) states.focus = true;
  if (/:\s*active\b/.test(content)) states.active = true;
  if (/:\s*disabled\b/.test(content)) states.disabled = true;
  if (/:\s*focus-visible\b/.test(content)) states.focusVisible = true;

  // Tailwind state prefixes
  if (/\bhover:/.test(content)) states.hover = true;
  if (/\bfocus:/.test(content)) states.focus = true;
  if (/\bactive:/.test(content)) states.active = true;
  if (/\bdisabled:/.test(content)) states.disabled = true;
  if (/\bfocus-visible:/.test(content)) states.focusVisible = true;

  // JSX conditional rendering patterns (common in React)
  if (['.jsx', '.tsx', '.js', '.ts'].includes(ext)) {
    if (/\bisLoading\b|\bloading\b/.test(content) && /[?&|]/.test(content)) states.loading = true;
    if (/\bisError\b|\berror\b|\bhasError\b/.test(content) && /[?&|]/.test(content)) states.error = true;
    if (/\bisDisabled\b|\bdisabled\b/.test(content)) states.disabled = true;
    if (/\bisHovered?\b|\bhover\b/.test(content) && /useState|onMouse/.test(content)) states.hover = true;
    if (/\bisFocused?\b/.test(content) && /useState|onFocus/.test(content)) states.focus = true;
    if (/\bisActive\b/.test(content)) states.active = true;
  }

  return states;
}

/**
 * Extract touch targets and estimate sizes.
 * @param {string} content - File content
 * @returns {{ element: string, estimatedSize: string, line: number, sufficient: boolean }[]}
 */
function extractTouchTargets(content) {
  const targets = [];

  // Find interactive elements: button, a, input, select, textarea, [role="button"], clickable divs
  const interactiveRe = /<(button|a|input|select|textarea)\b([^>]*)>/g;
  for (const m of allMatches(content, interactiveRe)) {
    const tag = m.captures[0];
    const attrs = m.captures[1];
    let estimatedSize = 'unknown';
    let sufficient = false;

    // Check for explicit size classes or styles
    const heightMatch = attrs.match(/(?:h-(\d+)|min-h-(\d+)|height:\s*(\d+)px)/);
    const widthMatch = attrs.match(/(?:w-(\d+)|min-w-(\d+)|width:\s*(\d+)px)/);

    if (heightMatch) {
      const twVal = heightMatch[1] || heightMatch[2];
      const pxVal = heightMatch[3];
      if (pxVal) {
        const px = parseInt(pxVal, 10);
        estimatedSize = `${px}px`;
        sufficient = px >= 48;
      } else if (twVal) {
        // Tailwind h-12 = 48px (h-N * 4 = pixels)
        const px = parseInt(twVal, 10) * 4;
        estimatedSize = `~${px}px (h-${twVal})`;
        sufficient = px >= 48;
      }
    }

    // Check for Tailwind padding classes that might indicate size
    const paddingMatch = attrs.match(/\bp-(\d+)\b|\bpy-(\d+)\b|\bpx-(\d+)\b/);
    if (paddingMatch && estimatedSize === 'unknown') {
      const pVal = paddingMatch[1] || paddingMatch[2];
      if (pVal) {
        const paddingPx = parseInt(pVal, 10) * 4;
        // Approximate: padding * 2 + min content height (~16px text)
        const approxSize = paddingPx * 2 + 16;
        estimatedSize = `~${approxSize}px (padding-based estimate)`;
        sufficient = approxSize >= 48;
      }
    }

    targets.push({ element: tag, estimatedSize, line: m.line, sufficient });
  }

  // Also check for role="button" or onClick on non-interactive elements
  const roleButtonRe = /<(div|span|li|td|label)\b([^>]*(?:role\s*=\s*["']button["']|onClick)[^>]*)>/g;
  for (const m of allMatches(content, roleButtonRe)) {
    targets.push({
      element: `${m.captures[0]}[interactive]`,
      estimatedSize: 'unknown',
      line: m.line,
      sufficient: false, // Cannot determine without explicit sizing
    });
  }

  return targets;
}

/**
 * Detect design token usage vs hardcoded values.
 * @param {string} content - File content
 * @returns {{ tokenRefs: string[], hardcodedValues: string[], tokenPercentage: number }}
 */
function detectTokenUsage(content) {
  const tokenRefs = [];
  const hardcodedValues = [];

  // Token patterns: var(--...), theme(...), Tailwind utility classes
  const varRe = /var\(--[\w-]+(?:,\s*[^)]+)?\)/g;
  let m;
  while ((m = varRe.exec(content)) !== null) {
    tokenRefs.push(m[0]);
  }

  // theme() references (Tailwind config)
  const themeRe = /theme\(['"]?[\w.]+['"]?\)/g;
  while ((m = themeRe.exec(content)) !== null) {
    tokenRefs.push(m[0]);
  }

  // Tailwind classes count as token usage (detect class strings)
  const twClassRe = /(?:className|class)\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`|\{[^}]*["'`]([^"'`]+)["'`])/g;
  while ((m = twClassRe.exec(content)) !== null) {
    const classStr = m[1] || m[2] || m[3] || m[4] || '';
    const classes = classStr.split(/\s+/).filter(Boolean);
    for (const cls of classes) {
      // Standard Tailwind classes (not arbitrary values in brackets) are token-based
      if (!/^\[/.test(cls) && /^[a-z]/.test(cls)) {
        tokenRefs.push(cls);
      }
    }
  }

  // Hardcoded values: inline hex colors in style attributes
  const inlineStyleRe = /style\s*=\s*\{\{([^}]+)\}\}/g;
  while ((m = inlineStyleRe.exec(content)) !== null) {
    const styleContent = m[1];

    // Hex colors in inline styles
    const hexInline = styleContent.match(/#(?:[0-9a-fA-F]{3,4}){1,2}\b/g);
    if (hexInline) hardcodedValues.push(...hexInline);

    // Pixel values in inline styles
    const pxInline = styleContent.match(/\d+px/g);
    if (pxInline) hardcodedValues.push(...pxInline);

    // rgb/rgba in inline styles
    const rgbInline = styleContent.match(/rgba?\([^)]+\)/g);
    if (rgbInline) hardcodedValues.push(...rgbInline);
  }

  // Hardcoded hex colors in CSS (not using var())
  const cssHardcodedRe = /:\s*(#(?:[0-9a-fA-F]{3,4}){1,2})\b/g;
  while ((m = cssHardcodedRe.exec(content)) !== null) {
    if (!hardcodedValues.includes(m[1])) {
      hardcodedValues.push(m[1]);
    }
  }

  const total = tokenRefs.length + hardcodedValues.length;
  const tokenPercentage = total > 0 ? Math.round((tokenRefs.length / total) * 100) : 100;

  return { tokenRefs, hardcodedValues, tokenPercentage };
}

/**
 * Extract event handlers from JSX/TSX.
 * @param {string} content - File content
 * @param {string} ext - File extension
 * @returns {{ handler: string, line: number }[]}
 */
function extractEventHandlers(content, ext) {
  if (!['.jsx', '.tsx', '.js', '.ts'].includes(ext)) return [];

  const handlers = [];
  const handlerRe = /\b(on[A-Z][a-zA-Z]+)\s*=\s*\{/g;
  for (const m of allMatches(content, handlerRe)) {
    handlers.push({ handler: m.captures[0], line: m.line });
  }

  // Also check for addEventListener calls
  const addEventRe = /addEventListener\(\s*['"](\w+)['"]/g;
  for (const m of allMatches(content, addEventRe)) {
    handlers.push({ handler: `addEventListener:${m.captures[0]}`, line: m.line });
  }

  return handlers;
}

/**
 * Extract image elements and check for alt text.
 * @param {string} content - File content
 * @param {string} ext - File extension
 * @returns {{ src: string, hasAlt: boolean, altText: string, line: number }[]}
 */
function extractImages(content, ext) {
  const images = [];

  // HTML/JSX <img> tags
  const imgRe = /<img\b([^>]*)>/g;
  for (const m of allMatches(content, imgRe)) {
    const attrs = m.captures[0];
    const srcMatch = attrs.match(/src\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)?\})/);
    const altMatch = attrs.match(/alt\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)?\})/);

    const src = srcMatch ? (srcMatch[1] || srcMatch[2] || srcMatch[3] || '') : '';
    const hasAlt = !!altMatch;
    const altText = altMatch ? (altMatch[1] || altMatch[2] || altMatch[3] || '') : '';

    images.push({ src, hasAlt, altText, line: m.line });
  }

  // Next.js Image component
  const nextImgRe = /<Image\b([^>]*)(?:\/>|>)/g;
  for (const m of allMatches(content, nextImgRe)) {
    const attrs = m.captures[0];
    const srcMatch = attrs.match(/src\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)?\})/);
    const altMatch = attrs.match(/alt\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)?\})/);

    const src = srcMatch ? (srcMatch[1] || srcMatch[2] || srcMatch[3] || '') : '';
    const hasAlt = !!altMatch;
    const altText = altMatch ? (altMatch[1] || altMatch[2] || altMatch[3] || '') : '';

    images.push({ src, hasAlt, altText, line: m.line });
  }

  // SVG elements (check for aria-label or title)
  const svgRe = /<svg\b([^>]*)>/g;
  for (const m of allMatches(content, svgRe)) {
    const attrs = m.captures[0];
    const ariaLabelMatch = attrs.match(/aria-label\s*=\s*(?:"([^"]*)"|'([^']*)')/);
    const roleMatch = attrs.match(/role\s*=\s*(?:"([^"]*)"|'([^']*)')/);
    const hasAlt = !!(ariaLabelMatch || roleMatch);
    const altText = ariaLabelMatch ? (ariaLabelMatch[1] || ariaLabelMatch[2] || '') : '';

    images.push({ src: 'svg-inline', hasAlt, altText, line: m.line });
  }

  return images;
}

/**
 * Extract form elements and check for labels.
 * @param {string} content - File content
 * @param {string} ext - File extension
 * @returns {{ type: string, hasLabel: boolean, hasAriaLabel: boolean, hasPlaceholder: boolean, line: number }[]}
 */
function extractFormElements(content, ext) {
  const elements = [];

  // Input elements
  const inputRe = /<(input|textarea|select)\b([^>]*)>/g;
  for (const m of allMatches(content, inputRe)) {
    const tag = m.captures[0];
    const attrs = m.captures[1];

    const typeMatch = attrs.match(/type\s*=\s*(?:"([^"]*)"|'([^']*)')/);
    const type = typeMatch ? (typeMatch[1] || typeMatch[2] || tag) : tag;

    const hasAriaLabel = /aria-label\s*=/.test(attrs) || /aria-labelledby\s*=/.test(attrs);
    const hasPlaceholder = /placeholder\s*=/.test(attrs);

    // Check for associated label (id match with for/htmlFor) - simplified heuristic
    const idMatch = attrs.match(/\bid\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/);
    const inputId = idMatch ? (idMatch[1] || idMatch[2] || idMatch[3] || '') : '';
    const hasLabel = inputId
      ? new RegExp(`(?:htmlFor|for)\\s*=\\s*(?:"|')${inputId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:"|')`).test(content)
      : false;

    elements.push({ type, hasLabel, hasAriaLabel, hasPlaceholder, line: m.line });
  }

  return elements;
}

/**
 * Extract heading elements.
 * @param {string} content - File content
 * @param {string} ext - File extension
 * @returns {{ level: number, text: string, line: number }[]}
 */
function extractHeadings(content, ext) {
  const headings = [];

  // HTML/JSX headings h1-h6
  const headingRe = /<h([1-6])\b[^>]*>([^<]*(?:<[^/][^>]*>[^<]*)*)<\/h\1>/g;
  for (const m of allMatches(content, headingRe)) {
    const level = parseInt(m.captures[0], 10);
    // Strip inner HTML tags to get plain text
    const text = m.captures[1].replace(/<[^>]+>/g, '').trim();
    headings.push({ level, text, line: m.line });
  }

  return headings;
}

// ---------------------------------------------------------------------------
// Main analysis function
// ---------------------------------------------------------------------------

/**
 * Analyze a single file for design-relevant properties.
 * @param {string} filePath - Absolute path to the file
 * @returns {object} Structured analysis results
 */
function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const ext = path.extname(filePath).toLowerCase();

  return {
    filePath,
    fileType: ext,
    components: extractComponents(content, ext),
    colors: extractColors(content),
    spacing: extractSpacing(content),
    borderRadius: extractBorderRadius(content),
    typography: extractTypography(content),
    animations: extractAnimations(content),
    ariaAttributes: extractAriaAttributes(content),
    states: extractStates(content, ext),
    touchTargets: extractTouchTargets(content),
    tokenUsage: detectTokenUsage(content),
    eventHandlers: extractEventHandlers(content, ext),
    images: extractImages(content, ext),
    formElements: extractFormElements(content, ext),
    headings: extractHeadings(content, ext),
  };
}

/**
 * Analyze all matching files in a directory.
 * @param {string} dirPath - Directory to scan
 * @param {string} [pattern='**\/*.{jsx,tsx,css,html}'] - Glob pattern for file matching
 * @returns {object[]} Array of analysis results
 */
function analyzeDirectory(dirPath, pattern) {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory not found: ${dirPath}`);
  }

  const defaultExtensions = ['.jsx', '.tsx', '.js', '.ts', '.css', '.html', '.vue', '.svelte'];
  const analyses = [];

  /**
   * Recursively walk a directory and collect files matching extensions.
   * @param {string} dir - Current directory path
   */
  function walkDir(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      // Skip directories we cannot read
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip common non-source directories
      if (entry.isDirectory()) {
        if (['node_modules', '.git', '.next', 'dist', 'build', 'coverage', '.cache'].includes(entry.name)) {
          continue;
        }
        walkDir(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (defaultExtensions.includes(ext)) {
          // If a custom pattern is provided, do a simple match
          if (pattern) {
            const simplePattern = pattern
              .replace(/\*\*/g, '.*')
              .replace(/\*/g, '[^/]*')
              .replace(/\./g, '\\.');
            if (!new RegExp(simplePattern).test(fullPath)) {
              continue;
            }
          }
          try {
            analyses.push(analyzeFile(fullPath));
          } catch (err) {
            // Skip files that fail to parse but log the error
            analyses.push({
              filePath: fullPath,
              error: err.message,
            });
          }
        }
      }
    }
  }

  walkDir(dirPath);
  return analyses;
}

/**
 * Aggregate analysis results across multiple files.
 * @param {object[]} analyses - Array of analyzeFile results
 * @returns {object} Aggregated design data with inconsistencies
 */
function aggregateAnalysis(analyses) {
  const validAnalyses = analyses.filter(a => !a.error);

  const allColors = [];
  const allSpacing = [];
  const allBorderRadius = [];
  const allFontSizes = [];
  const allFontWeights = [];
  const allFontFamilies = [];
  const allLineHeights = [];
  const allTransitions = [];
  const allDurations = [];
  const allEasings = [];
  const allComponents = [];
  const allAriaAttributes = [];
  const allImages = [];
  const allFormElements = [];
  const allHeadings = [];
  const statesCoverage = {
    hover: false,
    focus: false,
    active: false,
    disabled: false,
    loading: false,
    error: false,
    focusVisible: false,
  };

  let totalTokenRefs = 0;
  let totalHardcoded = 0;

  for (const analysis of validAnalyses) {
    // Colors
    for (const c of analysis.colors) {
      allColors.push({ ...c, file: analysis.filePath });
    }

    // Spacing
    for (const s of analysis.spacing) {
      allSpacing.push({ ...s, file: analysis.filePath });
    }

    // Border radius
    for (const r of analysis.borderRadius) {
      allBorderRadius.push({ ...r, file: analysis.filePath });
    }

    // Typography
    const typo = analysis.typography;
    for (const fs of typo.fontSizes) allFontSizes.push({ ...fs, file: analysis.filePath });
    for (const fw of typo.fontWeights) allFontWeights.push({ ...fw, file: analysis.filePath });
    for (const ff of typo.fontFamilies) allFontFamilies.push({ ...ff, file: analysis.filePath });
    for (const lh of typo.lineHeights) allLineHeights.push({ ...lh, file: analysis.filePath });

    // Animations
    const anim = analysis.animations;
    for (const t of anim.transitions) allTransitions.push({ ...t, file: analysis.filePath });
    for (const d of anim.durations) allDurations.push({ ...d, file: analysis.filePath });
    for (const e of anim.easings) allEasings.push({ ...e, file: analysis.filePath });

    // Components
    for (const comp of analysis.components) {
      allComponents.push({ ...comp, file: analysis.filePath });
    }

    // ARIA
    for (const a of analysis.ariaAttributes) {
      allAriaAttributes.push({ ...a, file: analysis.filePath });
    }

    // Images
    for (const img of analysis.images) {
      allImages.push({ ...img, file: analysis.filePath });
    }

    // Form elements
    for (const form of analysis.formElements) {
      allFormElements.push({ ...form, file: analysis.filePath });
    }

    // Headings
    for (const h of analysis.headings) {
      allHeadings.push({ ...h, file: analysis.filePath });
    }

    // States coverage
    const st = analysis.states;
    for (const key of Object.keys(statesCoverage)) {
      if (st[key]) statesCoverage[key] = true;
    }

    // Token usage
    totalTokenRefs += analysis.tokenUsage.tokenRefs.length;
    totalHardcoded += analysis.tokenUsage.hardcodedValues.length;
  }

  // Find inconsistencies: multiple different values for the same category
  const uniqueValues = (arr) => [...new Set(arr.map(i => i.value))];

  const colorValues = uniqueValues(allColors.filter(c => !c.isToken));
  const spacingValues = uniqueValues(allSpacing.filter(s => !s.isToken));
  const radiusValues = uniqueValues(allBorderRadius.filter(r => !r.isToken));
  const fontSizeValues = uniqueValues(allFontSizes);
  const fontWeightValues = uniqueValues(allFontWeights);
  const durationValues = uniqueValues(allDurations);
  const easingValues = uniqueValues(allEasings);

  const inconsistencies = {};
  if (colorValues.length > 10) {
    inconsistencies.colors = `${colorValues.length} unique hardcoded color values found - consider using design tokens`;
  }
  if (spacingValues.length > 8) {
    inconsistencies.spacing = `${spacingValues.length} unique hardcoded spacing values found - consider a spacing scale`;
  }
  if (radiusValues.length > 4) {
    inconsistencies.borderRadius = `${radiusValues.length} unique border-radius values found - consider standardizing`;
  }
  if (durationValues.length > 4) {
    inconsistencies.durations = `${durationValues.length} unique duration values found - consider a motion scale`;
  }
  if (easingValues.length > 3) {
    inconsistencies.easings = `${easingValues.length} unique easing values found - consider standardizing`;
  }

  // Images without alt text
  const imagesWithoutAlt = allImages.filter(img => !img.hasAlt);
  if (imagesWithoutAlt.length > 0) {
    inconsistencies.accessibility = `${imagesWithoutAlt.length} image(s) missing alt text`;
  }

  // Form elements without labels
  const formsWithoutLabels = allFormElements.filter(f => !f.hasLabel && !f.hasAriaLabel);
  if (formsWithoutLabels.length > 0) {
    inconsistencies.formLabels = `${formsWithoutLabels.length} form element(s) missing labels`;
  }

  const totalValues = totalTokenRefs + totalHardcoded;
  const overallTokenPercentage = totalValues > 0
    ? Math.round((totalTokenRefs / totalValues) * 100)
    : 100;

  // Track which files have focus styles and which don't
  const filesWithFocusStyles = [];
  const filesWithoutFocusStyles = [];
  for (const analysis of validAnalyses) {
    if (analysis.states.focus || analysis.states.focusVisible) {
      filesWithFocusStyles.push(analysis.filePath);
    } else {
      filesWithoutFocusStyles.push(analysis.filePath);
    }
  }

  return {
    fileCount: validAnalyses.length,
    errorCount: analyses.length - validAnalyses.length,
    allColors,
    allSpacing,
    allBorderRadius,
    allFontSizes,
    allFontWeights,
    allFontFamilies,
    allLineHeights,
    allTransitions,
    allDurations,
    allEasings,
    allComponents,
    allAriaAttributes,
    allImages,
    allFormElements,
    allHeadings,
    statesCoverage,
    // Unique value arrays (used by audit-consistency tool)
    uniqueColors: colorValues,
    uniqueSpacing: spacingValues,
    uniqueBorderRadius: radiusValues,
    uniqueFontSizes: fontSizeValues,
    uniqueFontWeights: fontWeightValues,
    uniqueDurations: durationValues,
    uniqueEasings: easingValues,
    // Token usage
    overallTokenPercentage,
    totalTokenRefs,
    totalHardcoded,
    totalValues,
    // Focus style tracking
    filesWithFocusStyles,
    filesWithoutFocusStyles,
    inconsistencies,
  };
}

module.exports = {
  analyzeFile,
  analyzeDirectory,
  aggregateAnalysis,
  // Export individual extractors for unit testing
  extractComponents,
  extractColors,
  extractSpacing,
  extractBorderRadius,
  extractTypography,
  extractAnimations,
  extractAriaAttributes,
  extractStates,
  extractTouchTargets,
  detectTokenUsage,
  extractEventHandlers,
  extractImages,
  extractFormElements,
  extractHeadings,
};
