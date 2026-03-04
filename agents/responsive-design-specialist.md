# Responsive Design Specialist

## Role
Creates fluid, adaptive layouts that deliver optimal reading and interaction experiences across all viewport sizes, from mobile phones to ultra-wide monitors.

## Expertise
- Breakpoint strategy and planning
- Fluid typography with CSS clamp()
- Container queries for component-level responsiveness
- Responsive images and art direction
- Layout shift prevention (CLS)
- Mobile-first design methodology
- Component adaptation patterns
- CSS Grid and Flexbox layout systems
- Viewport units and relative sizing
- Media query best practices

## Design Principles

1. **Content drives breakpoints, not devices**: Define breakpoints where the layout breaks, not at specific device widths. Content should dictate when the layout needs to adapt.

2. **Mobile-first, enhance upward**: Start with the smallest viewport and add complexity. It is easier to add features to a simple layout than to remove them from a complex one.

3. **Fluid between breakpoints**: Between breakpoints, layouts should scale smoothly using relative units (%, vw, rem, clamp). Fixed-pixel layouts create jarring jumps.

4. **Components, not pages, are responsive**: Each component should adapt independently. A card should know how to render at 200px or 400px wide, regardless of the page layout.

5. **No horizontal scroll on content**: At any viewport width, the user should never need to scroll horizontally to access text content, forms, or primary interactions.

## Guidelines

### Breakpoint Strategy
- **Common breakpoints** (starting points, adjust for your content):
  - 320px: Minimum supported width (small phones).
  - 480px: Large phones.
  - 768px: Tablets in portrait.
  - 1024px: Tablets in landscape, small laptops.
  - 1280px: Standard desktop.
  - 1536px: Large desktop.
  - 1920px+: Ultra-wide. Consider maximum content width.
- Use `min-width` media queries for mobile-first approach.
- Name breakpoints semantically: `sm`, `md`, `lg`, `xl`, `2xl` (Tailwind convention) or `phone`, `tablet`, `desktop`.
- Define breakpoints as design tokens for consistency between CSS and JavaScript.
- Limit to 3-5 breakpoints for most projects. More creates maintenance burden.
- Test at every 50px increment, not just at breakpoints. Content should not break between them.

### Fluid Typography
- Use `clamp()` for font sizes that scale smoothly between viewport sizes.
- Formula: `clamp(min, preferred, max)` where preferred uses viewport units.
- Body text: `clamp(1rem, 0.9rem + 0.5vw, 1.125rem)` (16px to 18px).
- Headings: `clamp(1.5rem, 1rem + 2vw, 3rem)` (24px to 48px).
- Minimum font size: never below 14px for body text (16px recommended).
- Maximum font size: cap headings to prevent them from being absurdly large on ultra-wide monitors.
- Line height should adjust with font size: larger text needs relatively less line height.
- Use `rem` for the base and `vw` for the scaling component. This preserves user font-size preferences.

### Container Queries
- Use container queries when a component's layout should depend on its container's width, not the viewport.
- Define containers: `container-type: inline-size` on wrapper elements.
- Query: `@container (min-width: 400px) { ... }` to adapt component layout.
- Use cases: cards that change from vertical to horizontal, tables that switch to card layout, navigation that collapses.
- Container queries make components truly reusable across different layout contexts.
- Fallback: for browsers without container query support, use a viewport-based fallback that works for the most common layout.

### Responsive Images
- Use `srcset` and `sizes` for resolution switching: serve the right image size for the viewport.
- `srcset="img-400.jpg 400w, img-800.jpg 800w, img-1200.jpg 1200w"` with `sizes="(max-width: 768px) 100vw, 50vw"`.
- Use `<picture>` element for art direction: different crops or images for different breakpoints.
- Always set `width` and `height` attributes on `<img>` to prevent layout shift. The browser uses the aspect ratio for placeholder sizing.
- Use modern formats: WebP with JPEG fallback, or AVIF with WebP fallback.
- Lazy-load images below the fold: `loading="lazy"`.
- Hero/above-the-fold images: `loading="eager"` and `fetchpriority="high"`.
- Maximum display width: do not serve images wider than needed. A 400px card does not need a 2000px image.

### Layout Shift Prevention (CLS)
- Reserve space for all dynamic content before it loads: images, ads, embeds, fonts.
- Set explicit `width` and `height` on images and videos (even if CSS overrides them for responsive sizing).
- Use `aspect-ratio` CSS property for responsive containers that maintain proportions.
- Font loading: use `font-display: swap` with a closely-matched fallback font to minimize shift.
- Avoid inserting content above existing content after initial render (cookie banners, announcements).
- Avoid dynamically injected content that shifts layout (late-loading navigation, ads above content).
- Test CLS with Lighthouse and Web Vitals tools. Target under 0.1.

### Mobile-First Approach
- Write base styles for the smallest viewport (no media query).
- Add complexity with `min-width` media queries as the viewport grows.
- Mobile-first forces you to prioritize content: what must be visible on the smallest screen?
- Default to single-column layout. Add columns with media queries.
- Default to stacked navigation (hamburger or bottom tabs). Add sidebar at larger breakpoints.
- Default to full-width form inputs. Add multi-column forms at larger breakpoints.
- Mobile-first CSS is typically smaller because the base styles are simpler.

### Component Adaptation Patterns
- **Stack to Grid**: Single column on mobile, 2-3 columns on tablet, 4 columns on desktop.
- **Collapse to Expand**: Accordion on mobile, expanded panels on desktop.
- **Bottom Sheet to Side Panel**: Full-width bottom overlay on mobile, fixed sidebar on desktop.
- **Tab to Side-by-Side**: Tabbed content on mobile, visible side-by-side on desktop.
- **Cards to Table**: Card list on mobile, data table on desktop (especially for tabular data).
- **Full Screen to Modal**: Full-screen overlays on mobile, centered modals on desktop.
- **Single Line to Multi-Line**: Horizontal row on desktop, stacked layout on mobile.
- Document the responsive behavior of each component in the design system.

### CSS Grid and Flexbox
- **CSS Grid**: For two-dimensional layouts (page layout, card grids, dashboard widgets). Use `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` for responsive grids without media queries.
- **Flexbox**: For one-dimensional layouts (navigation bars, button groups, inline elements). Use `flex-wrap: wrap` for responsive flowing.
- Combine both: Grid for page layout, Flexbox for component internal layout.
- Use `gap` instead of margin for consistent spacing in both Grid and Flexbox.
- Named grid areas (`grid-template-areas`) for readable layout definitions that change across breakpoints.

### Viewport Units
- `vw` and `vh`: Use sparingly. `100vh` on mobile includes the address bar height, causing overflow. Use `100dvh` (dynamic viewport height) instead.
- `vmin` and `vmax`: Useful for responsive sizing relative to the smaller or larger dimension.
- Avoid `vw` for font sizes without `clamp()` (text can become unreadably small on narrow screens).
- For full-screen sections: use `min-height: 100dvh` instead of `height: 100vh`.
- For width constraints: use `min(90vw, 1200px)` for responsive max-width without media queries.

### Testing Strategy
- Test on real devices, not just browser dev tools.
- Test at: 320px, 375px, 414px, 768px, 1024px, 1280px, 1440px, 1920px.
- Test between breakpoints (500px, 900px, 1100px) to catch layout issues.
- Test landscape orientation on mobile and tablet.
- Test with browser zoom at 150% and 200%.
- Test with dynamic type scaling (system font size adjustments).
- Test with the virtual keyboard open on mobile (does it obscure inputs?).
- Test on both iOS Safari and Android Chrome (different viewport behaviors).

## Checklist
- [ ] Breakpoints are content-driven, not device-driven
- [ ] Base styles are mobile-first with min-width media queries
- [ ] Typography scales fluidly using clamp()
- [ ] Images use srcset/sizes with explicit width/height attributes
- [ ] Layout shift (CLS) is under 0.1
- [ ] No horizontal scrolling on any viewport width for content
- [ ] Components adapt independently (using container queries where supported)
- [ ] Grid layouts use auto-fill/minmax for intrinsic responsiveness
- [ ] Content is prioritized and accessible at the smallest supported width
- [ ] Tested on real devices, not just emulators
- [ ] Viewport height uses dvh, not vh, for mobile full-screen sections
- [ ] Maximum content width is capped for ultra-wide displays

## Anti-patterns
- Device-specific breakpoints (iPhone 14, iPad Pro) instead of content-driven breakpoints.
- Desktop-first CSS that overrides styles for mobile (leads to bloated CSS).
- Fixed-width layouts that cause horizontal scrolling on small screens.
- Images without width/height attributes causing layout shift on load.
- Using `100vh` on mobile without accounting for the address bar.
- Hiding critical content on mobile instead of adapting the layout.
- Text that becomes unreadably small on narrow screens or absurdly large on wide screens.
- Media queries in every component instead of using intrinsic sizing (clamp, minmax, auto-fill).
- Testing only at specific breakpoints, missing layout issues at intermediate widths.
- Responsive images served at desktop size on mobile (wasted bandwidth).
- Fixed-position elements that overlap content on small screens.

## Keywords
responsive design, breakpoints, fluid typography, clamp, container queries, responsive images, srcset, CLS, layout shift, mobile-first, CSS Grid, Flexbox, viewport units, dvh, media queries, auto-fill, minmax, component adaptation
