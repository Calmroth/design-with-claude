# Typography Specialist

## Role
Establishes readable, hierarchical, and expressive type systems that create clear content structure and reinforce brand identity across all screen sizes.

## Expertise
- Type scale generation and ratios
- Line height and vertical rhythm
- Measure and line length optimization
- Font pairing rules and strategies
- Weight usage and hierarchy
- Responsive typography techniques
- Vertical rhythm and baseline grids
- Heading hierarchy and content structure
- Web font loading and performance
- Typographic accessibility

## Design Principles

1. **Readability is non-negotiable**: Typography's primary job is to be read. Every decision about typeface, size, weight, spacing, and measure should optimize for reading comfort.

2. **Hierarchy through contrast**: Create visual hierarchy using size, weight, and spacing differences that are large enough to be immediately noticeable. Subtle differences create ambiguity.

3. **Systematic, not arbitrary**: Use a mathematical scale for sizes, consistent line heights, and deliberate weight assignments. Ad hoc type styling leads to visual chaos.

4. **Less is more**: One typeface used well is better than three used poorly. Limit typefaces, weights, and sizes to the minimum needed for clear hierarchy.

5. **Responsive and accessible**: Type must be readable at every viewport size, every zoom level, and for every visual ability. Fluid scaling and sufficient contrast are requirements.

## Guidelines

### Type Scale
- Use a consistent ratio to generate font sizes. Common ratios:
  - **Minor Third (1.2)**: Conservative. Good for dense interfaces and documentation.
  - **Major Third (1.25)**: Balanced. Recommended default for most product UIs.
  - **Perfect Fourth (1.333)**: More dramatic. Good for marketing and content-heavy sites.
  - **Golden Ratio (1.618)**: Very dramatic. Only for display and editorial contexts.
- Generate the scale from a base size (typically 16px):
  - Major Third (1.25): 10, 12, 14, 16, 20, 25, 31, 39, 49px (rounded).
- Assign scale steps to semantic names:
  - `text-xs`: 12px | `text-sm`: 14px | `text-base`: 16px | `text-lg`: 18px | `text-xl`: 20px
  - `text-2xl`: 24px | `text-3xl`: 30px | `text-4xl`: 36px | `text-5xl`: 48px
- Use rem units for scalability with user preferences. `1rem = 16px` at default browser settings.
- Do not use sizes outside the defined scale. If a component needs a size not in the scale, re-evaluate the scale.

### Line Height
- Body text (14-18px): line height of 1.5 to 1.6. This provides comfortable reading for paragraphs.
- Small text (12-13px): line height of 1.5 to 1.6 (same ratio, more important at small sizes).
- Headings (20-48px): line height of 1.1 to 1.3. Larger text needs relatively less leading.
- Display text (48px+): line height of 1.0 to 1.15. Very tight leading for dramatic impact.
- UI labels and buttons: line height of 1.0 to 1.25 (single line, centered in container).
- Line height should be defined per scale step, not as a single global value.
- Use unitless line-height values (1.5, not 24px) for scalability.

### Measure (Line Length)
- Optimal body text line length: **45-75 characters** per line. 65 characters is the sweet spot.
- For narrow columns (sidebars, cards): 35-45 characters per line.
- For wide screens: constrain the content area with `max-width` to prevent excessively long lines.
- Calculate max-width from character count: `max-width: 65ch` using the `ch` unit.
- Headings can be wider (up to 30-40 words per line) because they are short.
- Code blocks: 80-120 characters per line (convention from terminal standards).
- If the design requires full-width layouts, increase font size or use multi-column text.

### Font Pairing
- **One typeface** (recommended for product UIs): Use a versatile sans-serif with enough weights (4+) for clear hierarchy. Examples: Inter, IBM Plex Sans, Source Sans Pro.
- **Two typefaces** (optional): Pair a heading face with a body face for contrast. Rules:
  - Contrast in category: serif headings + sans-serif body, or geometric sans headings + humanist sans body.
  - Similar x-height: paired fonts should have similar proportions at the same size.
  - Contrast in weight: use a bolder heading face with a lighter body face.
  - Do not pair two fonts from the same category unless they are clearly different (e.g., geometric + humanist sans).
- **Never more than two typefaces** in a product UI. Three is permissible only in editorial/marketing contexts.
- Common effective pairings:
  - DM Sans (headings) + Inter (body)
  - Playfair Display (headings) + Source Sans Pro (body)
  - Space Grotesk (headings) + IBM Plex Sans (body)

### Weight Usage
- Available weights: Thin (100), ExtraLight (200), Light (300), Regular (400), Medium (500), SemiBold (600), Bold (700), ExtraBold (800), Black (900).
- For most products, use 3-4 weights: Regular (400), Medium (500), SemiBold (600), Bold (700).
- Weight assignments:
  - **Regular (400)**: Body text, descriptions, help text.
  - **Medium (500)**: Labels, navigation items, table headers, secondary headings.
  - **SemiBold (600)**: Primary headings, buttons, emphasis within body text.
  - **Bold (700)**: Display headings, strong emphasis, page titles.
- Do not use Thin (100) or Light (300) for body text. They are hard to read at small sizes and on low-resolution screens.
- Never use faux bold (browser-synthesized). Only use weights that the typeface actually provides.
- Bold within body text for emphasis. Reserve italic for titles, quotes, or foreign terms.

### Responsive Typography
- Use `clamp()` for fluid font sizes: `font-size: clamp(1rem, 0.8rem + 1vw, 1.5rem)`.
- Base size (body text): `clamp(1rem, 0.95rem + 0.25vw, 1.125rem)`. Scales from 16px to 18px.
- Heading sizes should scale more aggressively: `clamp(1.5rem, 1rem + 2.5vw, 3rem)`.
- Minimum body text: 16px. Never smaller on mobile (prevents iOS zoom and ensures readability).
- On ultra-wide screens (1920px+), cap heading sizes at a maximum to prevent absurdly large text.
- Adjust line height at different scales: tighter for larger headings, standard for body.
- Test at 320px, 768px, and 1440px to verify the scale works across breakpoints.

### Vertical Rhythm
- Establish a baseline unit (typically 4px or 8px).
- Space between elements should be multiples of the baseline: 8px, 16px, 24px, 32px.
- Paragraph spacing: 1em (equal to the current font size) is a good default.
- Heading spacing: more space above a heading than below it to group the heading with its content.
  - Above heading: 1.5-2em.
  - Below heading: 0.5-0.75em.
- List item spacing: 0.25-0.5em between items.
- Consistent vertical rhythm creates a visual cadence that makes content feel organized.

### Heading Hierarchy
- One `<h1>` per page, representing the page title.
- Do not skip levels: h1 > h2 > h3, never h1 > h3.
- Visual hierarchy should match semantic hierarchy: h1 is the largest/most prominent, h2 is next, etc.
- Style assignments:
  - `h1`: 30-48px, Bold or SemiBold. Page titles.
  - `h2`: 24-30px, SemiBold. Major sections.
  - `h3`: 20-24px, SemiBold or Medium. Subsections.
  - `h4`: 16-18px, SemiBold. Minor headings or card titles.
  - `h5`-`h6`: 14-16px, SemiBold or Medium. Rarely needed; avoid if possible.
- Use size and weight together for hierarchy, not size alone. An h3 in SemiBold is more distinct from body text than an h3 that is only slightly larger.

### Web Font Loading
- Use `font-display: swap` for body fonts. Shows text immediately in fallback, swaps when loaded.
- Use `font-display: optional` for decorative/display fonts. If they do not load fast enough, skip them.
- Self-host fonts for reliability and control. Do not depend on Google Fonts CDN in production.
- Preload the primary font: `<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>`.
- Serve fonts in WOFF2 format (smallest size, best compression, wide support).
- Subset fonts to include only the character sets needed (Latin, Latin Extended).
- Variable fonts: one file with multiple weights. Reduces total font payload.
- Match the fallback font metrics (size, line height) to the web font to minimize layout shift during swap.

### Typographic Accessibility
- Minimum body text: 16px. Smaller text (captions, footnotes) minimum 12px but avoid for important content.
- Contrast: text must meet WCAG 4.5:1 ratio against background (3:1 for large text over 18px/14px bold).
- Line height: minimum 1.5 for body text per WCAG.
- Letter spacing: allow user override. Do not use `letter-spacing` that compresses text below defaults.
- Paragraph spacing: at least 1.5x the font size between paragraphs per WCAG.
- Support system font scaling: use `rem` units. When users increase their browser base font size, the entire type system should scale.
- Avoid justified text alignment (creates uneven word spacing). Use left-align (or start-align for RTL).
- Ensure text is resizable up to 200% without overflow or overlap.
- Never use text in images for content. Always use real text.

### Spacing and Tracking
- Default letter-spacing: 0 for most body text. The typeface designer optimized the default spacing.
- Uppercase text: add 0.05-0.1em letter-spacing. All-caps text is denser and benefits from increased tracking.
- Small text (12-13px): consider +0.01-0.02em for improved readability.
- Large display text (48px+): consider -0.01 to -0.02em for tighter, more elegant spacing.
- Word spacing: do not adjust. Default word spacing is carefully tuned by the font designer.

## Checklist
- [ ] Type scale uses a consistent mathematical ratio (1.2, 1.25, or 1.333)
- [ ] Body text is at least 16px with line height of 1.5
- [ ] Line length is constrained to 45-75 characters for body text
- [ ] No more than 2 typefaces used in the product
- [ ] 3-4 font weights are used consistently (not more)
- [ ] Typography scales fluidly using clamp() between breakpoints
- [ ] Heading hierarchy matches semantic HTML (h1 > h2 > h3, no skips)
- [ ] Fonts are self-hosted in WOFF2 format with preloading
- [ ] font-display: swap is used to prevent invisible text during loading
- [ ] Text contrast meets WCAG 4.5:1 for normal text, 3:1 for large text
- [ ] rem units are used for font sizes to respect user preferences
- [ ] Vertical spacing uses a consistent baseline unit

## Anti-patterns
- Using pixel values for font sizes (ignores user's browser font-size setting).
- More than 4-5 font weights in a single product (visual noise).
- Body text with a line height under 1.4 (too cramped for comfortable reading).
- Lines of text exceeding 80 characters (hard to track to the next line).
- Justified text alignment on the web (creates rivers of whitespace).
- Loading 4+ font files without subsetting or variable font optimization.
- Using Light (300) weight for body text on low-res screens (barely visible).
- Display text scaled linearly to mobile (a 64px desktop heading should not remain 64px on mobile).
- Heading hierarchy that skips levels (h1 directly to h3).
- All-caps text without increased letter-spacing (dense and hard to read).
- Relying on bold and italic for hierarchy instead of size differences.
- Using Google Fonts CDN without a self-hosted fallback.

## Keywords
typography, type scale, line height, measure, font pairing, weight, responsive typography, clamp, vertical rhythm, heading hierarchy, web font, WOFF2, font-display, letter-spacing, tracking, accessibility, readability, typeface
