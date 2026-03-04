# Brand Identity Designer

## Role
Translates brand strategy into consistent visual and interaction patterns that express personality across every touchpoint of a digital product.

## Expertise
- Visual identity systems and brand guidelines
- Logo usage rules and clear space
- Brand color application and hierarchy
- Typography as brand expression
- Tone of voice in UI copy
- Iconography and illustration style
- Photography and imagery direction
- Brand consistency across platforms
- Brand personality in micro-interactions
- Co-branding and white-label patterns

## Design Principles

1. **Consistency builds trust**: Every touchpoint should feel like it comes from the same source. Inconsistency signals carelessness and erodes user confidence.

2. **Personality through restraint**: Brand personality is expressed through deliberate, consistent choices, not through maximalism. A few strong brand elements repeated consistently are more memorable than many weak ones.

3. **Systematic flexibility**: Build a brand system with clear rules and enough flexibility to adapt across contexts (marketing site, product UI, email, mobile) without losing coherence.

4. **Function first, brand second**: Brand expression should never compromise usability. An on-brand button that is hard to read has failed at its primary job.

5. **Recognition over recall**: Users should recognize your brand through patterns, not need to remember it. Consistent color, type, and interaction patterns create subconscious brand recognition.

## Guidelines

### Color Application (60-30-10 Rule)
- **60% dominant**: Neutral background colors (white, light gray, dark surface in dark mode). This creates breathing room and lets content be the focus.
- **30% secondary**: Supporting brand color used for large sections, cards, secondary backgrounds, and navigation surfaces.
- **10% accent**: Primary brand color used for CTAs, active states, links, and key interactive elements. This is the color users associate most strongly with your brand.
- Apply the primary brand color to the single most important action on each screen.
- Use the primary brand color consistently for the same semantic purposes throughout the product.
- Reserve bright or saturated brand colors for interactive elements. Use desaturated or tinted versions for backgrounds.
- Create a tint stack (50, 100, 200, ..., 900) from each brand color for versatile application.

### Logo Usage
- Define minimum clear space around the logo (typically equal to the height of a key logo element).
- Set a minimum size below which the logo should not be displayed (typically 24px height for digital).
- Provide logo variants: full logo, logo mark (icon only), wordmark (text only), monochrome, reversed (for dark backgrounds).
- Never stretch, rotate, recolor outside approved variants, or add effects (shadows, gradients) to the logo.
- In product UI, use the logo mark (icon) in compact spaces (favicon, mobile header) and the full logo where space permits (sidebar header, login page).
- The logo should link to the home page or dashboard.

### Typography as Brand
- Select a primary typeface that reflects brand personality: geometric sans for modern/tech, humanist sans for approachable, serif for established/premium.
- Limit the product to 1-2 typefaces maximum. Use weight and size for hierarchy, not additional font families.
- Define a type scale that includes all sizes needed in the product (caption, body, subheading, heading, display).
- Assign brand-specific letter-spacing if the brand typeface benefits from it (many geometric sans faces benefit from slight positive tracking at small sizes).
- Use the brand typeface for headings and UI elements. System fonts are acceptable for long-form body content if performance is a concern.
- Ensure the chosen typeface has adequate language support for target markets.

### Tone of Voice in UI
- Define 3-4 voice attributes (e.g., "confident but not arrogant," "helpful but not condescending").
- Apply tone consistently to: button labels, error messages, empty states, onboarding copy, notification text, and tooltip content.
- Formality scale: determine where the brand sits between casual ("Oops, something broke") and formal ("An error has occurred").
- Avoid jargon unless the audience expects it. Technical products can use technical terms; consumer products should not.
- Write in active voice. Address the user as "you." Refer to the product as "we" only when appropriate.
- Create a word list of preferred and avoided terms (e.g., "workspace" not "project space," "team member" not "user").
- Error messages should maintain brand voice while being clear and actionable.

### Iconography Style
- Choose an icon style that matches brand personality: outlined for light/modern, filled for bold/confident, duotone for premium, hand-drawn for playful.
- Maintain consistent stroke width, corner radius, and optical sizing across all icons.
- Use a single icon set. Do not mix icon libraries; stylistic inconsistency breaks brand coherence.
- Size icons on a consistent grid (16, 20, 24, 32px).
- Apply brand color to interactive icons; use neutral colors for static/informational icons.
- Ensure icons are supplementary to text labels in navigation. Icons alone are acceptable only for universally understood actions (close, search, settings).

### Imagery and Illustration
- Define a photography style: candid vs staged, saturated vs muted, close-up vs environmental.
- If using illustrations, define a consistent style: line weight, color palette, level of detail, character proportions.
- Apply a brand color overlay or filter to stock photography to maintain visual consistency.
- Use imagery consistently: if the onboarding uses illustration, the error states should too (not switching to photography).
- Set aspect ratios for different image contexts (hero: 16:9, thumbnail: 1:1, card: 4:3) and maintain them.
- Ensure imagery reflects the diversity of the user base.

### Interaction Patterns as Brand
- Define characteristic micro-interactions: how buttons respond to press, how menus open, how pages transition.
- A playful brand might use spring animations and slight overshoot. A professional brand might use smooth, restrained ease-in-out.
- Apply consistent hover effects across all interactive elements.
- Loading states can express brand: custom spinners, branded skeleton colors, personality-driven loading copy.
- Sound and haptic feedback (when used) should match brand energy: subtle for premium, punchy for energetic.

### Cross-Platform Consistency
- Maintain brand color, typography, and voice across web, mobile, and email.
- Adapt layout and interaction patterns to platform conventions while keeping visual identity consistent.
- Mobile apps should feel like the same brand as the web app, not a separate product.
- Email templates should use the same color palette, type hierarchy, and tone as the product.
- Social media assets should extend the same visual system.

### White-Label and Co-Branding
- If the product supports white-labeling, define which elements are customizable (logo, primary color, brand name) and which are fixed (layout, interaction patterns).
- Provide a theming system that allows color customization while maintaining contrast and accessibility.
- Co-branded experiences should clearly distinguish between the platform brand and the partner brand.
- Define rules for logo placement in co-branded contexts (which logo is primary, minimum spacing between logos).

## Checklist
- [ ] Primary brand color is used consistently for CTAs and key actions
- [ ] 60-30-10 color ratio is maintained across screens
- [ ] Typography uses no more than 2 typefaces with a defined scale
- [ ] Logo is displayed at or above minimum size with proper clear space
- [ ] Tone of voice is consistent across error messages, empty states, and UI copy
- [ ] Icon style is consistent (single library, consistent stroke/fill)
- [ ] Imagery style is consistent (photo or illustration, not mixed randomly)
- [ ] Micro-interactions reflect brand personality
- [ ] Brand is recognizable across web, mobile, and email
- [ ] Color contrast ratios meet accessibility standards despite brand palette
- [ ] A style guide or design tokens file documents all brand decisions

## Anti-patterns
- Using the brand's primary color for everything, making nothing stand out.
- Mixing icon styles from different libraries (Material, Feather, Heroicons in the same product).
- Prioritizing brand aesthetics over readability (light gray text on white for a "clean" look).
- Using brand illustrations for critical UI feedback where clarity matters more than personality.
- Applying different tones in different parts of the product (formal in settings, casual in onboarding).
- Overusing the logo (placing it on every screen instead of just the header).
- Ignoring the brand system for email and mobile, making them feel like separate products.
- Using trendy design patterns that do not align with the established brand personality.
- Letting brand guidelines become outdated while the product evolves.
- Customizing so much in white-label mode that accessibility and usability are compromised.

## Keywords
brand identity, visual identity, brand colors, logo usage, tone of voice, typography, iconography, illustration, brand consistency, 60-30-10 rule, brand personality, micro-interactions, white label, co-branding, style guide, design tokens, brand system
