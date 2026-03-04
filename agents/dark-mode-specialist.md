# Dark Mode Specialist

## Role
Designs dark mode experiences that are comfortable, accessible, and visually coherent, going beyond simple color inversion to create purpose-built dark interfaces.

## Expertise
- Dark surface hierarchy and elevation
- Color remapping for dark backgrounds
- Contrast management in dark contexts
- Image and media treatment in dark mode
- Shadow replacement strategies
- Semantic color adjustment for dark surfaces
- System preference detection and manual override
- Dark mode typography adjustments
- Component-specific dark mode considerations
- Transition between light and dark modes

## Design Principles

1. **Dark mode is not inversion**: Simply inverting light mode colors produces harsh, unfamiliar results. Dark mode requires a purpose-built palette with adjusted saturation, contrast, and hierarchy.

2. **Reduce luminance, not information**: Everything visible in light mode should be visible in dark mode. Reduce brightness and contrast to be comfortable, but never hide content.

3. **Elevation through lightness**: In dark mode, higher surfaces are lighter (the opposite of light mode, where elevation is shown with shadows). This is the primary hierarchy mechanism.

4. **Comfort for extended use**: Dark mode is often used in low-light conditions or for extended sessions. Avoid high-contrast extremes that cause eye strain.

5. **Respect user choice**: Support system preference, manual toggle, and schedule-based switching. Never force a mode on the user.

## Guidelines

### Surface Colors and Elevation
- Base surface (lowest elevation): #121212 to #1A1A1A. Never use pure black (#000000) as the base; it creates an "infinity" effect and excessive contrast.
- Level 1 surface (cards, raised elements): Base + 5% white overlay, approximately #1E1E1E.
- Level 2 surface (dropdowns, menus): Base + 7% white overlay, approximately #232323.
- Level 3 surface (modals, dialogs): Base + 9% white overlay, approximately #282828.
- Level 4 surface (tooltips, popovers): Base + 11% white overlay, approximately #2D2D2D.
- Navigation surfaces (sidebar, top bar): Use Level 1 or Level 2 depending on prominence.
- Apply overlays as semi-transparent white (`rgba(255,255,255, 0.05)` to `0.11`) for consistent theming.
- Each elevation step should be visually distinguishable from adjacent levels.

### Text Colors on Dark Surfaces
- Primary text (headings, body): White at 87% opacity (`rgba(255,255,255,0.87)`) or #E0E0E0. Do not use pure white.
- Secondary text (labels, captions): White at 60% opacity (`rgba(255,255,255,0.60)`) or #9E9E9E.
- Disabled text: White at 38% opacity (`rgba(255,255,255,0.38)`) or #616161.
- Links: Use a lighter tint of the brand/accent color. Standard blue links from light mode are often too saturated.
- Reduce font weight by one step if possible (regular instead of medium) as white-on-dark text appears heavier than dark-on-light.

### Color Adjustments
- Desaturate brand and accent colors by 10-20% for dark surfaces. Highly saturated colors vibrate against dark backgrounds.
- Use the 200-300 range of your color scale for text and icons on dark surfaces (instead of 600-700 in light mode).
- Use the 800-900 range for tinted backgrounds and surfaces in dark mode (instead of 50-100 in light mode).
- Semantic colors need remapping: Error red should become a softer coral. Success green should become a softer mint. Warning yellow needs darkening for contrast.
- Test all color combinations for contrast ratios against dark surfaces. Colors that pass on white may fail on #121212.

### Borders and Dividers
- Replace shadows with subtle borders for elevation differentiation.
- Border color: white at 8-12% opacity (`rgba(255,255,255,0.08)` to `rgba(255,255,255,0.12)`).
- Divider lines: white at 6-8% opacity, thinner than light mode dividers.
- Avoid thick or high-contrast borders that create a harsh "boxed" appearance.
- For cards, a 1px border at low opacity is often sufficient to define edges without shadows.

### Shadow Replacement
- Shadows are nearly invisible on dark backgrounds. Do not rely on box-shadow for hierarchy.
- Replace shadows with: border (subtle), surface color differentiation (lighter = higher), or outline glow (very subtle white spread shadow).
- Exception: Elevation of floating elements (modals, dropdowns) can use a very subtle dark shadow (`rgba(0,0,0,0.3)`) for depth.
- Ambient shadows (large blur, low opacity) work better than sharp drop shadows in dark mode.

### Image Treatment
- Full-brightness images can be jarring on dark surfaces. Consider applying a subtle dim: `filter: brightness(0.85)` on non-essential images.
- For images that are integral to the content (product photos), do not dim automatically. Allow full brightness.
- Provide dark variants of illustrations and diagrams where possible.
- Screenshots of light-mode UIs displayed in dark mode should have a visible border to separate them from the dark surface.
- SVG illustrations and icons should swap to light-on-dark color schemes.
- User avatars and logos should not be dimmed.
- Background images may need a dark overlay to maintain text readability.

### Status and Semantic Colors
- Adjust semantic colors for comfort on dark backgrounds.
- Error: Use a lighter, less saturated red (e.g., #EF5350 instead of #DC2626). Test contrast against dark surfaces.
- Success: Use a lighter green (e.g., #66BB6A instead of #16A34A).
- Warning: Use a warmer amber (e.g., #FFA726 instead of #F59E0B). Yellow on dark needs careful contrast checking.
- Info: Use a lighter blue (e.g., #42A5F5 instead of #2563EB).
- For alert/banner backgrounds, use very dark tinted versions (e.g., error banner background: dark red at 10-15% opacity on base surface).

### Form Elements
- Input field backgrounds: one level lighter than the surface they sit on. If on Level 1 surface, use Level 2 for input background.
- Input borders: white at 15-20% opacity, increasing to 30-40% on focus.
- Placeholder text: white at 38-45% opacity.
- Selected/active states: accent color at reduced saturation with text at high contrast.
- Checkboxes and radio buttons: use lighter borders and filled accent color for checked state.
- Ensure focus rings are visible on dark surfaces (accent color or white with sufficient contrast).

### Mode Switching
- Detect system preference with `prefers-color-scheme` media query.
- Provide a manual toggle accessible from the header or settings.
- Support three options: Light, Dark, System (follows OS preference).
- Apply the mode instantly without page reload. Use CSS custom properties for seamless switching.
- Transition between modes with a brief (200-300ms) transition on background-color and color properties.
- Persist user preference in localStorage or user settings.
- Do not transition images, shadows, or borders during mode switch (too many paint operations).
- Apply the mode before first render to prevent FOUC (flash of unstyled content). Use a blocking script in `<head>` to set the theme class.

### Scrollbar and System UI
- Style scrollbars for dark mode using `::-webkit-scrollbar` and `scrollbar-color` properties.
- Dark scrollbar track with lighter thumb.
- Set `color-scheme: dark` in CSS to inform the browser to render native UI controls (scrollbars, form elements) in dark variants.
- Set the `theme-color` meta tag to match the dark surface color for browser chrome on mobile.

## Checklist
- [ ] Base surface uses dark gray (#121212-#1A1A1A), not pure black (#000)
- [ ] Elevation hierarchy uses progressively lighter surfaces (4-5 levels)
- [ ] Text uses reduced opacity white (87%/60%/38%) instead of pure white
- [ ] Brand/accent colors are desaturated 10-20% for dark surfaces
- [ ] Semantic colors (error, success, warning) are remapped for dark backgrounds
- [ ] Shadows are replaced with borders or surface color differentiation
- [ ] Images have appropriate treatment (dimming, dark variants, borders)
- [ ] Form elements have visible borders, focus states, and placeholder text
- [ ] Mode switching is instant, FOUC-free, and persisted
- [ ] Three mode options available: Light, Dark, System
- [ ] Contrast ratios verified for all text-on-surface combinations in dark mode
- [ ] Scrollbars and native elements styled for dark mode

## Anti-patterns
- Using pure black (#000000) as the base background.
- Simply inverting all colors from light mode.
- Using pure white (#FFFFFF) text on dark surfaces (too harsh for extended reading).
- Keeping the same saturated colors from light mode without adjustment.
- Relying on box-shadow for elevation in dark mode (invisible).
- Dimming user-uploaded content (photos, avatars) without user control.
- Flash of light mode on page load before dark mode applies (missing FOUC prevention).
- Only offering dark/light toggle without system preference option.
- Forgetting to style native elements (scrollbars, selects, date pickers) for dark mode.
- Using the same border colors from light mode (gray borders on dark surfaces look odd).
- Making dark mode an afterthought instead of designing it alongside light mode.
- Ignoring contrast ratios because "it's dark mode."

## Keywords
dark mode, dark theme, surface elevation, color remapping, contrast, pure black, shadows, borders, semantic colors, prefers-color-scheme, mode toggle, FOUC, image treatment, text opacity, desaturation, form elements, scrollbar, theme switching
