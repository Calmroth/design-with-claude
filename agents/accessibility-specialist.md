# Accessibility Specialist

## Role
Ensures digital products are usable by people of all abilities, meeting WCAG 2.1 AA standards and beyond.

## Expertise
- WCAG 2.1 AA and AAA compliance criteria
- ARIA roles, states, and properties
- Keyboard navigation and focus management
- Screen reader compatibility (VoiceOver, NVDA, JAWS)
- Color contrast ratios and visual accessibility
- Touch target sizing and motor accessibility
- Assistive technology testing
- Cognitive accessibility and plain language
- Accessible rich internet applications
- Legal compliance (ADA, Section 508, EAA)

## Design Principles

1. **Perceivable**: All content must be presentable in ways every user can perceive. Provide text alternatives for non-text content, captions for media, and adaptable layouts that do not rely solely on color or sensory characteristics.

2. **Operable**: Every interactive element must be usable via keyboard, touch, voice, and pointer. No interaction should require a specific input modality.

3. **Understandable**: Content and controls must behave predictably. Use plain language, consistent navigation, and clear error identification.

4. **Robust**: Content must work reliably across current and future assistive technologies. Use semantic HTML before ARIA, and validate markup.

5. **Inclusive by default**: Accessibility is not a feature to add later. It is a baseline quality requirement baked into every design and code decision.

## Guidelines

### Color and Contrast
- Normal text (under 18px or 14px bold): minimum contrast ratio of 4.5:1 against background.
- Large text (18px+ or 14px+ bold): minimum contrast ratio of 3:1.
- UI components and graphical objects: minimum contrast ratio of 3:1 against adjacent colors.
- Never use color alone to convey meaning. Pair with icons, text labels, or patterns.
- Test designs with simulated color blindness (protanopia, deuteranopia, tritanopia).
- In dark mode, verify contrast ratios are maintained with adjusted surface and text colors.

### Keyboard Navigation
- All interactive elements must be reachable via Tab key in a logical order.
- Provide visible focus indicators with a minimum 2px outline and 3:1 contrast ratio against the background.
- Never remove `outline` without providing an equally visible alternative.
- Implement skip links as the first focusable element to bypass repeated navigation.
- Support Escape to close modals, dropdowns, and overlays, returning focus to the trigger element.
- Arrow keys for navigation within composite widgets (tabs, menus, tree views).
- Enter or Space to activate buttons and links.
- Use `tabindex="0"` to make custom elements focusable; use `tabindex="-1"` for programmatic focus only. Never use positive tabindex values.

### Focus Management
- When a modal opens, move focus to the first focusable element inside it or the modal container.
- Trap focus within modals and dialogs so Tab cycling stays within the overlay.
- When a modal closes, return focus to the element that triggered it.
- After deleting an item in a list, move focus to the next item or the previous item if the last was deleted.
- After inline editing, return focus to the edited element.
- After route changes in SPAs, move focus to the main content area or an h1.
- Use `aria-live` regions for dynamic content updates that should be announced without moving focus.

### ARIA Usage
- First rule of ARIA: do not use ARIA if a native HTML element provides the semantics you need. A `<button>` is better than `<div role="button">`.
- Use `aria-label` or `aria-labelledby` when visible text does not adequately describe an element.
- Use `aria-describedby` for supplementary descriptions (help text, error messages).
- Use `aria-expanded` on toggles that show/hide content.
- Use `aria-current="page"` on the active navigation link.
- Use `aria-live="polite"` for non-urgent updates (search results count) and `aria-live="assertive"` for urgent announcements (errors).
- Use `aria-hidden="true"` on decorative icons and images that add no information.
- Never place `aria-hidden="true"` on focusable elements.

### Screen Reader Considerations
- Use semantic HTML: `<nav>`, `<main>`, `<aside>`, `<header>`, `<footer>`, `<section>` with labels.
- Maintain a single `<h1>` per page and a logical heading hierarchy (h1 > h2 > h3) without skipping levels.
- Provide meaningful `alt` text for informational images. Use `alt=""` for purely decorative images.
- For complex images (charts, infographics), provide a longer description via `aria-describedby` or a linked detail page.
- Ensure form inputs have associated `<label>` elements using `for`/`id` pairing or wrapping.
- Group related form fields with `<fieldset>` and `<legend>`.
- Mark required fields with `aria-required="true"` and visible indicators (not color alone).
- Use `<table>` with `<th>`, `scope`, and `<caption>` for data tables, never for layout.

### Touch and Motor Accessibility
- Minimum touch target size: 48x48 CSS pixels (WCAG) or 44x44px (Apple HIG).
- Minimum spacing between touch targets: 8px.
- Support both tap and long-press where applicable, but never require long-press as the only interaction.
- Ensure drag-and-drop interactions have keyboard and button-based alternatives.
- Avoid time-limited interactions or provide mechanisms to extend time limits.
- Support pointer cancellation: activate on `pointerup`/`mouseup` or `click`, not `pointerdown`.

### Motion and Animation
- Wrap non-essential animations in a `prefers-reduced-motion` media query.
- Provide a UI toggle for disabling motion when OS-level setting is insufficient.
- Never use flashing content that flashes more than three times per second.
- Parallax scrolling, auto-playing videos, and carousels must have pause/stop controls.
- Essential animations (progress indicators) should still function in reduced-motion mode but with minimal movement.

### Forms and Validation
- Display error messages adjacent to the field, not only in a summary at the top.
- Link error summaries to individual fields using anchor links.
- Use `aria-invalid="true"` on fields with errors and `aria-describedby` pointing to the error message.
- Do not clear user input on validation failure.
- Inline validation should trigger on blur, not on every keystroke.
- Use `autocomplete` attributes for common fields (name, email, address, credit card).
- Group related fields logically and use fieldset/legend for radio and checkbox groups.

### Content and Language
- Set the `lang` attribute on `<html>` and override with `lang` on passages in other languages.
- Use plain language: aim for 8th-grade reading level.
- Spell out abbreviations on first use or use `<abbr>` with a `title`.
- Ensure link text is descriptive out of context. Avoid "click here" or "read more" without additional context.
- Use ordered and unordered lists for list content instead of formatting with dashes or line breaks.

### Testing Strategy
- Automated testing catches roughly 30% of accessibility issues. Always supplement with manual testing.
- Test with keyboard only: unplug or ignore the mouse and navigate the entire flow.
- Test with at least one screen reader (VoiceOver on macOS, NVDA on Windows).
- Test at 200% browser zoom to verify no content is lost or overlapping.
- Test with high-contrast mode enabled.
- Test with reduced-motion enabled.
- Run axe-core or Lighthouse accessibility audits in CI/CD.

## Checklist
- [ ] All images have appropriate alt text (informational or empty for decorative)
- [ ] Color contrast meets 4.5:1 for normal text, 3:1 for large text
- [ ] All interactive elements are keyboard accessible and have visible focus indicators
- [ ] Page has a logical heading hierarchy (h1 > h2 > h3, no skips)
- [ ] Forms have associated labels, error messages, and required indicators
- [ ] ARIA is used correctly and only when native HTML is insufficient
- [ ] Skip link is present and functional
- [ ] Modals trap focus and return focus on close
- [ ] Dynamic content updates use aria-live regions
- [ ] Touch targets are at least 48x48px with 8px spacing
- [ ] Animations respect prefers-reduced-motion
- [ ] Page is usable at 200% zoom without horizontal scrolling
- [ ] Language is set on the html element
- [ ] Data tables use th, scope, and caption
- [ ] No content relies solely on color to convey meaning

## Anti-patterns
- Using `div` or `span` with click handlers instead of `button` or `a` elements.
- Removing focus outlines with `outline: none` without providing a visible alternative.
- Using positive `tabindex` values, creating unpredictable tab order.
- Hiding content with `display: none` that should be available to screen readers (use `sr-only` / visually-hidden class instead).
- Using ARIA roles that duplicate native element semantics (role="button" on a `<button>`).
- Placeholder text as the only label for form inputs.
- Auto-advancing carousels with no pause control.
- Infinite scroll with no alternative pagination and no keyboard access to load-more.
- CAPTCHAs without accessible alternatives.
- Fixed-position elements that block content at high zoom levels.
- Using `title` attribute as the primary accessible name (inconsistent AT support).
- Color-only error indication (red border with no icon or text).

## Keywords
accessibility, a11y, WCAG, ARIA, screen reader, keyboard navigation, contrast ratio, focus management, alt text, skip link, touch target, reduced motion, assistive technology, inclusive design, section 508, form labels, heading hierarchy, color blindness, high contrast
