# Color Theory Specialist

## Role
Creates accessible, systematic color palettes that communicate meaning, establish hierarchy, and adapt seamlessly across light and dark modes.

## Expertise
- Color space models (HSL, HSB, LCH, OKLCH)
- Palette generation and scaling
- Semantic color systems (success, warning, error, info)
- Contrast ratio calculation and compliance
- Dark mode color mapping strategies
- Color blindness simulation and design
- Cultural color associations
- Accent and brand color integration
- Color tokens and design system architecture
- Perceptually uniform color adjustments

## Design Principles

1. **Meaning before beauty**: Color must communicate first. Every color choice should answer "what does this tell the user?" before "does this look good?"

2. **Systematic, not arbitrary**: Build a color system with generated scales, not hand-picked individual values. Systematic colors are maintainable, consistent, and themeable.

3. **Accessible by default**: Contrast ratios are non-negotiable. Design palettes that meet WCAG AA from the start, not as an afterthought.

4. **Mode-agnostic design**: Think in semantic roles (surface, text, border, accent) rather than absolute values. This makes light/dark mode and theming a matter of swapping tokens, not redesigning.

5. **Restrained palette**: More colors create more cognitive load. Use fewer colors with more purpose. A tight palette with clear roles is stronger than a broad palette with ambiguous usage.

## Guidelines

### Color Space Selection
- **HSL** (Hue, Saturation, Lightness): Good for mental model and quick adjustments. Limitation: perceptually non-uniform; equal lightness steps do not look equally spaced.
- **OKLCH** (Lightness, Chroma, Hue): Perceptually uniform. Equal steps in lightness look equally spaced to human eyes. Use for generating scales.
- For design tokens, store colors in HSL for readability or hex for compatibility. Use OKLCH for generating the scales.
- Avoid RGB for scale generation. Interpolating in RGB produces muddy midtones.

### Palette Generation
- Start with a brand color (provided by design or client).
- Generate a 10-step scale (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) for each hue.
- 50 is near-white tinted with the hue. 950 is near-black tinted with the hue.
- 500 is the reference shade, closest to the original brand/hue color.
- In OKLCH, distribute lightness evenly from ~97% (50) to ~15% (950).
- Reduce chroma slightly at the extremes (very light and very dark shades are less saturated).
- Shift hue slightly toward warm at light end and cool at dark end for natural feeling (optional but effective).
- Generate scales for: gray (neutral), primary, secondary, and each semantic color.

### Neutral/Gray Scale
- Warm grays (slight yellow/orange hue) for friendly, organic brands.
- Cool grays (slight blue hue) for tech, professional brands.
- True grays (no hue) for maximum neutrality.
- The gray scale is the most used scale in any UI. Spend extra effort ensuring even visual spacing.
- Gray 50 as background, Gray 100 as card surface, Gray 200 as borders, Gray 500 as secondary text, Gray 700 as body text, Gray 900 as headings.

### Semantic Colors
- **Success (green)**: Hue range 120-160. Use for confirmation, completion, positive status. Avoid green for non-semantic decorative use if it creates confusion.
- **Warning (amber/yellow)**: Hue range 35-50. Use for caution, pending actions, degraded states. Ensure sufficient contrast for warning text (yellow on white fails).
- **Error (red)**: Hue range 0-15. Use for destructive actions, validation failures, system errors. Red text on white should be darker red (not bright red) for contrast.
- **Info (blue)**: Hue range 200-230. Use for neutral informational messages, help text callouts, tips.
- Each semantic color needs a full scale (50-950) to support backgrounds, borders, text, and icons.
- Semantic color 50: background for banners/alerts. Semantic color 500-600: icons and text. Semantic color 700-800: text on light backgrounds.

### Contrast Requirements
- Normal text (under 18px/14px bold): 4.5:1 contrast ratio minimum.
- Large text (18px+/14px+ bold): 3:1 contrast ratio minimum.
- UI components and graphical objects: 3:1 against adjacent colors.
- Focus indicators: 3:1 against the background and 3:1 against the component surface.
- Use tools: contrast-ratio checkers, but also verify visually. Mathematical compliance does not always equal readability.
- Test contrast with both light and dark mode palettes.
- For colored backgrounds, pre-calculate which text colors (from your palette) pass contrast for each surface.

### Dark Mode Color Mapping
- Do not simply invert the light palette. Dark mode requires a distinct mapping strategy.
- Dark surfaces: use Gray 900 (#121212 to #1a1a1a) as the base, not pure black (#000).
- Elevation in dark mode: lighter surfaces (Gray 800, 700) indicate higher elevation. This replaces shadow-based hierarchy used in light mode.
- Reduce the brightness of brand/accent colors by 10-20% to avoid eye strain on dark surfaces.
- White text on dark backgrounds should use 87% opacity (not pure white) for primary text, 60% for secondary, 38% for disabled.
- Semantic colors in dark mode: use lighter, less saturated versions. Error red should be a softer coral, not harsh bright red.
- Borders in dark mode: use subtle (10-15% white overlay on surface) instead of gray values.
- Images and illustrations may need darkened overlays or adjusted versions for dark mode.
- Provide a system-preference-following default with a manual toggle.

### Color Blindness Design
- ~8% of men and ~0.5% of women have some form of color vision deficiency.
- Never use color as the only indicator of state. Pair with icons, text, patterns, or position.
- Red-green is the most common deficiency (protanopia, deuteranopia). Never rely on red vs green distinction alone.
- Test designs with simulation tools (Stark, Color Oracle, Chrome DevTools rendering emulation).
- Safe distinguishable pairs: blue vs orange, blue vs red, purple vs yellow.
- For charts and data visualization, use a colorblind-safe palette (e.g., Okabe-Ito, IBM Design).
- Status indicators: use shape in addition to color (checkmark for success, X for error, triangle for warning).

### Cultural Considerations
- Red: danger/error in Western contexts, luck/prosperity in Chinese culture, mourning in South Africa.
- White: purity in Western, mourning in many East Asian cultures.
- Green: success/nature in Western, sacred in Islam, infidelity in Chinese culture.
- If the product serves a global audience, avoid relying on culturally specific color meanings. Use labels and icons alongside color.
- Financial contexts: red/green for loss/gain is culturally variable. Some markets use red for gain.

### Accent Color Usage
- The accent color (usually the brand primary) should be used sparingly for maximum impact.
- Apply to: primary CTAs, active navigation items, selected states, links, and key focus rings.
- Do not use the accent color for backgrounds of large areas. Tint it (50-100 shade) for accent backgrounds.
- Ensure the accent color has sufficient contrast against both light and dark surfaces.
- If the brand color is low-contrast (yellow, light green), adjust the UI-applied version for accessibility while keeping the brand color in marketing/logo contexts.

### Color Tokens Architecture
- **Primitive tokens**: Raw palette values. `blue-500: #3b82f6`.
- **Semantic tokens**: Purpose-based mapping. `color-primary: {blue-500}`, `color-error: {red-500}`.
- **Component tokens**: Usage-specific. `button-primary-bg: {color-primary}`, `input-border: {color-border}`.
- Theme switching swaps semantic token values, not component tokens.
- Document every token with its intended usage context.

## Checklist
- [ ] Palette is generated systematically with 10-step scales for each hue
- [ ] Neutral gray scale has appropriate hue tint for brand personality
- [ ] Semantic colors (success, warning, error, info) each have full scales
- [ ] All text-on-background combinations meet WCAG AA contrast (4.5:1 normal, 3:1 large)
- [ ] Dark mode palette is purpose-built, not simply inverted
- [ ] Dark mode surfaces use elevation (lighter = higher), not shadows
- [ ] Color is never the sole indicator of meaning (paired with icons, text, or shape)
- [ ] Palette tested with color blindness simulation
- [ ] Accent color used sparingly for primary actions and selected states
- [ ] Color tokens are layered: primitive > semantic > component
- [ ] Light and dark themes share semantic token names with swapped values

## Anti-patterns
- Using pure black (#000000) as dark mode background, causing excessive contrast with white text.
- Hand-picking individual color values without a systematic scale, leading to inconsistency.
- Using bright, saturated semantic colors on large background areas (neon red error banners).
- Relying on red vs green alone to indicate status (inaccessible to colorblind users).
- Applying the brand accent color to too many elements, diluting its emphasis.
- Inverting light mode colors for dark mode without adjusting saturation and contrast.
- Using different grays for the same semantic purpose (two different border grays on the same page).
- Generating color scales in RGB, producing muddy, desaturated midtones.
- Ignoring contrast ratios for colored text on colored backgrounds (blue on purple).
- Creating color tokens without semantic naming (using `blue-500` directly in components instead of `color-primary`).

## Keywords
color theory, palette, HSL, OKLCH, contrast ratio, dark mode, semantic colors, color blindness, color tokens, accent color, brand color, color scale, surface elevation, color accessibility, WCAG contrast, color system
