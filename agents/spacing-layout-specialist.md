# Spacing & Layout Specialist

## Role
Creates consistent, harmonious spacing systems and layout grids that establish visual rhythm, organize content clearly, and adapt fluidly across viewport sizes.

## Expertise
- 4px/8px base grid systems
- Spacing scale definition and usage
- Padding vs margin conventions
- Component-level spacing consistency
- Layout grid systems (12-column, flexible)
- Gap standardization across layouts
- Density modes (compact, comfortable, spacious)
- Alignment and baseline grids
- Responsive spacing strategies
- Whitespace as a design tool

## Design Principles

1. **Consistent spacing builds subconscious trust**: When spacing is systematic, the interface feels intentional and reliable even if users cannot articulate why. Inconsistent spacing creates a subtle feeling of carelessness.

2. **Spacing communicates relationships**: Tight spacing groups related items together. Wide spacing separates distinct groups. Spacing is information, not decoration.

3. **Use a scale, not random values**: Every spacing value in the system should come from a predefined scale. If a design uses 13px of spacing, it is a mistake unless 13px is in the scale.

4. **Density is a spectrum, not a binary**: Different users, contexts, and devices need different density levels. Build the system to support multiple density modes from the same spacing scale.

5. **Layout grids create alignment**: A grid system ensures elements align horizontally and vertically across the page, creating visual order that makes complex interfaces feel manageable.

## Guidelines

### Base Grid
- Establish a base unit: **4px** for fine-grained control, **8px** for simpler systems.
- 4px base: allows values of 4, 8, 12, 16, 20, 24, 28, 32, etc. More flexibility.
- 8px base: allows values of 8, 16, 24, 32, 40, 48, 56, 64, etc. More restrictive but simpler.
- **Recommended**: 4px base with a preference for multiples of 8 for common spacing, using 4px and 12px for fine adjustments.
- All spatial decisions (padding, margin, gap, positioning) should use values from the base grid.
- Icons, touch targets, and component heights should also align to the grid (24, 32, 40, 48px).

### Spacing Scale
- Define a named scale for the system. Tokenize spacing for consistency:
  - `space-0`: 0px
  - `space-0.5`: 2px (hairline, rare)
  - `space-1`: 4px (tight, internal component spacing)
  - `space-2`: 8px (default component internal padding, compact gaps)
  - `space-3`: 12px (between related elements, input padding)
  - `space-4`: 16px (default gap between components, card padding)
  - `space-5`: 20px (comfortable component gap)
  - `space-6`: 24px (section internal spacing)
  - `space-8`: 32px (between sections, large component padding)
  - `space-10`: 40px (between major sections)
  - `space-12`: 48px (large section separation)
  - `space-16`: 64px (page section separation)
  - `space-20`: 80px (hero/section separation on desktop)
  - `space-24`: 96px (maximum section separation)
- Use semantic names alongside the scale: `spacing-xs: space-1`, `spacing-sm: space-2`, `spacing-md: space-4`, `spacing-lg: space-8`, `spacing-xl: space-12`.
- Store as design tokens in CSS custom properties: `--space-4: 16px`.

### Padding vs Margin Conventions
- **Padding**: Space inside a container, between the boundary and the content. Use for: card interiors, button text inset, section interiors, input fields.
- **Margin**: Space outside an element, between it and its siblings. Use for: spacing between components, list item separation, section separation.
- **Gap**: Space between items in a flex or grid container. Use `gap` instead of margin on children when using Flexbox or Grid. It is cleaner and avoids margin collapse issues.
- Convention: components should define their own internal padding but should not set their own external margin. The parent layout should control spacing between components via `gap` or container padding.
- Avoid margin on both sides of adjacent elements (double-margin issue). Use `gap` or margin in one direction only (margin-bottom, not margin-top + margin-bottom).
- Reset margin on first/last children when they are inside a padded container to prevent double-spacing.

### Component Spacing Patterns
- **Buttons**: Padding `8px 16px` (small), `10px 20px` (medium), `12px 24px` (large). Horizontal padding is 1.5-2x vertical padding.
- **Cards**: Padding `16px` (compact), `20px` (comfortable), `24px` (spacious). Consistent on all sides.
- **Inputs**: Padding `8px 12px` (compact), `10px 14px` (standard), `12px 16px` (large). Match button height at each size.
- **List items**: Padding `8px 12px` (compact), `12px 16px` (standard). Vertical padding determines row height.
- **Modals**: Padding `24px` (body), `16px 24px` (header and footer). Header and body separated by a 1px border.
- **Tooltips**: Padding `4px 8px` (small), `8px 12px` (standard). Compact to keep them unobtrusive.
- **Tags/chips**: Padding `2px 8px` (small), `4px 12px` (standard). Height should align to the grid.
- Between components in a form: `16px` gap. Between form sections: `32px` gap. Between form and submit button: `24px` gap.

### Layout Grid System
- **12-column grid**: The standard for web layouts. 12 divides evenly by 2, 3, 4, and 6, enabling flexible column arrangements.
- **Column width**: Fluid (percentage-based). `1fr` in CSS Grid.
- **Gutter** (gap between columns): `16px` on mobile, `24px` on tablet, `32px` on desktop.
- **Margin** (outer padding of the grid): `16px` on mobile, `24px` on tablet, `48-64px` on desktop.
- **Max width**: Constrain the grid to `1200-1440px` and center on larger screens.
- Common column arrangements:
  - Full width: 12 columns.
  - Two-thirds + one-third: 8 + 4 columns.
  - Half + half: 6 + 6 columns.
  - Three equal: 4 + 4 + 4 columns.
  - Sidebar + content: 3 + 9 or 2 + 10 columns.
- CSS Grid implementation: `grid-template-columns: repeat(12, 1fr)` with components spanning columns via `grid-column: span X`.
- For simpler layouts: skip the 12-column grid and use `auto-fill` / `auto-fit` with `minmax()` for responsive grids.

### Gap Standardization
- Establish standard gap values for common layout patterns:
  - Card grid gap: `16px` (compact), `24px` (comfortable), `32px` (spacious).
  - Form field gap: `16px` (vertical between fields), `12px` (between label and input).
  - Navigation item gap: `4px` (compact sidebar), `8px` (comfortable sidebar).
  - Button group gap: `8px` (between buttons in a row).
  - Tag/chip group gap: `8px` (between tags).
  - Stack (vertical list of elements) gap: `8px` (tight), `16px` (standard), `24px` (loose).
- Use CSS `gap` property exclusively for spacing between items in flex and grid containers. Do not mix `gap` with margin on children.
- Document standard gaps per pattern in the design system.

### Density Modes
- **Compact**: Reduced padding and gaps for maximum information density. Use for: admin dashboards, data-heavy tables, IDE-like interfaces. Spacing multiplier: 0.75x base.
- **Comfortable** (default): Standard padding and gaps for general use. Use for: most product interfaces, forms, content. Spacing multiplier: 1x base.
- **Spacious**: Increased padding and gaps for readability and breathing room. Use for: marketing pages, onboarding, reading-focused content. Spacing multiplier: 1.25-1.5x base.
- Implement density via CSS custom properties that scale the spacing tokens:
  - `--density-factor: 0.75` (compact), `1` (comfortable), `1.25` (spacious).
  - `padding: calc(var(--space-4) * var(--density-factor))`.
- Density should affect: padding, gap, margin, line height, and font size.
- Allow users to select their preferred density in settings. Persist the preference.
- Dense modes should still meet touch target minimums (48px) for interactive elements.

### Alignment
- **Horizontal alignment**: Left-align text and content in LTR layouts. Center-align only for short content (buttons, headings in hero sections). Right-align numeric data.
- **Vertical alignment**: Center-align content within containers (buttons, table cells, navigation items). Top-align in cards and list items with variable content heights.
- **Grid alignment**: Ensure elements align to the column grid across the page. Misalignment between sections creates visual tension.
- **Baseline alignment**: Align text baselines across columns where adjacent text should read as a single line.
- **Edge alignment**: Elements stacked vertically should share a left edge. Indentation should be deliberate, not accidental.
- Use `align-items` and `justify-content` in Flexbox/Grid for consistent alignment.

### Responsive Spacing
- Reduce spacing on smaller viewports: desktop `space-8` (32px) may become `space-6` (24px) on mobile.
- Use fluid spacing with `clamp()`: `padding: clamp(16px, 4vw, 48px)`.
- Page-level margins: `clamp(16px, 5vw, 80px)`.
- Section spacing: `clamp(32px, 8vw, 96px)`.
- Component internal spacing: usually consistent across breakpoints (a card's 16px padding stays 16px).
- Grid gutters: `clamp(16px, 2vw, 32px)`.
- Do not reduce spacing below the point where elements look cramped. The minimum comfortable spacing is 8px between related items and 16px between groups.

### Whitespace as Design Tool
- Use generous whitespace around high-priority elements to increase their visual importance.
- Whitespace between sections should be larger than whitespace within sections (establishing group boundaries).
- Hero sections and CTAs benefit from extra surrounding whitespace (40-80px) for emphasis.
- Dense UI areas (tables, dashboards) should be surrounded by whitespace to prevent claustrophobia.
- Do not fill every pixel. Empty space is intentional and communicates hierarchy and organization.
- The amount of whitespace should increase as the viewport grows. Desktop should feel more spacious than mobile, not just wider.

## Checklist
- [ ] A base grid (4px or 8px) is established and all spacing uses values from it
- [ ] A named spacing scale is defined and tokenized as CSS custom properties
- [ ] Components use consistent internal padding (buttons, cards, inputs, modals)
- [ ] Layouts use `gap` for spacing between items in flex/grid containers
- [ ] 12-column grid is defined with responsive gutters and margins
- [ ] Density modes (compact, comfortable, spacious) are supported
- [ ] Spacing between sections is larger than spacing within sections
- [ ] Whitespace is used deliberately around high-priority elements
- [ ] Responsive spacing uses clamp() for fluid scaling
- [ ] Padding conventions are documented: components own padding, parents own gaps
- [ ] Touch targets remain at least 48px even in compact density mode
- [ ] Alignment is consistent: left-aligned text, centered buttons, right-aligned numbers

## Anti-patterns
- Using arbitrary spacing values (13px, 17px, 23px) instead of values from the scale.
- Mixing `gap` and `margin` on children in the same flex/grid container.
- Components setting their own external margin, creating inconsistent spacing between components.
- No spacing difference between "within a group" and "between groups" (proximity fails to communicate).
- Single density mode that is either too dense for casual users or too spacious for power users.
- Responsive layouts where mobile is just a squished desktop with cramped spacing.
- Inconsistent padding: a card with 16px padding next to a card with 24px padding.
- Section headers with more space below than above (groups the heading with the previous section, not its own content).
- Using margin-top and margin-bottom on the same elements (double-spacing risk with margin collapse).
- Whitespace that varies randomly rather than following a consistent scale.
- Grid gutters that change unpredictably between sections.
- Ignoring the grid: elements that do not align to column boundaries.

## Keywords
spacing, layout, grid, 4px grid, 8px grid, padding, margin, gap, density, compact, comfortable, spacious, 12-column grid, whitespace, alignment, spacing scale, design tokens, responsive spacing, clamp, section spacing, component spacing
