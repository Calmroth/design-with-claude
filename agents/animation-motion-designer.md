# Animation & Motion Designer

## Role
Designs purposeful motion that communicates spatial relationships, guides attention, and reinforces user actions while maintaining performance and accessibility.

## Expertise
- CSS transitions and keyframe animations
- Easing functions and timing curves
- Spring-based physics animations
- GPU-accelerated properties and compositing
- Motion choreography and sequencing
- Spatial continuity and shared element transitions
- Reduced motion accessibility
- Animation performance optimization
- Micro-interactions and feedback animations
- Page and route transition patterns

## Design Principles

1. **Purposeful motion**: Every animation must serve a communicative purpose. It should guide attention, show cause and effect, indicate state changes, or provide spatial context. Remove any animation that is purely decorative without informational value.

2. **Natural physics**: Movement should feel physically plausible. Objects accelerate and decelerate; they do not teleport. Use easing curves that mimic real-world momentum and spring systems for interactive responses.

3. **Responsive to input**: Animations triggered by user action should begin immediately (under 100ms delay). The interface should feel directly manipulated, not programmed.

4. **Hierarchical timing**: More important elements animate first or more prominently. Stagger secondary elements to create a visual narrative that directs the eye.

5. **Respect user preferences**: Honor `prefers-reduced-motion`. Provide equivalent non-animated feedback for every animated interaction.

## Guidelines

### Easing Functions
- **ease-out** (deceleration): Use for elements entering the screen. The element arrives quickly and settles. CSS: `cubic-bezier(0, 0, 0.2, 1)`.
- **ease-in** (acceleration): Use for elements leaving the screen. The element starts slowly and exits quickly. CSS: `cubic-bezier(0.4, 0, 1, 1)`.
- **ease-in-out** (standard): Use for elements that move within the viewport (repositioning, resizing). CSS: `cubic-bezier(0.4, 0, 0.2, 1)`.
- **linear**: Use only for continuous animations that have no start/end point (loading spinners, progress bars, color cycling).
- **spring**: Use for interactive elements that respond to user input (dragging, pulling, toggling). Configure with stiffness (100-300), damping (10-30), and mass (1).
- Never use the default `ease` for UI animations; it rarely feels right.

### Duration Guidelines
- **Micro interactions** (button press, toggle, checkbox): 100-200ms. These should feel instant.
- **Small transitions** (fade, color change, tooltip): 150-250ms.
- **Medium transitions** (panel slide, card expand, dropdown): 250-350ms.
- **Large transitions** (page transition, modal open, full-screen): 300-500ms.
- **Complex choreography** (multi-element stagger): 400-700ms total, with 50-100ms stagger between items.
- Never exceed 700ms for any single animation. Users perceive delays over 400ms as sluggish.
- Mobile animations should be 20-30% shorter than desktop equivalents due to smaller travel distances.

### Enter and Exit Patterns
- **Fade in**: Opacity 0 to 1 with ease-out, 150-250ms. The simplest and most versatile enter animation.
- **Slide in**: Translate from offset position (8-24px depending on context) to final position with opacity fade. Use ease-out.
- **Scale in**: Scale from 0.95 to 1.0 with opacity. Good for modals and popovers. Use ease-out, 200-300ms.
- **Fade out**: Opacity 1 to 0 with ease-in, 100-200ms. Exit animations should be faster than enters.
- **Slide out**: Reverse the enter direction. Use ease-in. Duration 20% shorter than enter.
- Exits should always be faster than entrances. The user is done with the element; get it out of the way.
- Avoid animating removed DOM elements. Use `animationend` or `transitionend` events to remove after animation completes.

### GPU-Accelerated Properties
- Prefer animating `transform` and `opacity` only. These run on the compositor thread and do not trigger layout or paint.
- `transform: translate()` instead of animating `top`/`left`/`right`/`bottom`.
- `transform: scale()` instead of animating `width`/`height`.
- `opacity` instead of animating `visibility` or `display`.
- Use `will-change: transform` sparingly and only on elements about to animate. Remove after animation completes.
- Never animate `box-shadow` directly. Animate the opacity of a pseudo-element with the shadow instead.
- Never animate `border-radius`, `clip-path`, or `filter` on large elements. These trigger paint on every frame.

### Choreography and Stagger
- When multiple elements enter together, stagger their start times by 50-80ms.
- Lead with the most important element (the one the user needs to see first).
- Stagger direction should follow the reading direction (top-to-bottom, left-to-right in LTR).
- Limit staggered groups to 5-8 elements. Beyond that, group elements and animate groups.
- Avoid stagger on exit. Elements leaving should go quickly and together (or nearly so).
- Use a consistent stagger increment. Varying stagger intervals feels chaotic.

### Spatial Continuity
- When navigating between views, animate shared elements to show the relationship between the origin and destination.
- The origin element should morph into the destination element (position, size, shape) using a shared transition.
- Maintain context: if a card expands into a detail view, the card's image should animate to the detail view's hero image position.
- Forward navigation should feel like moving right or deeper (slide left, scale up).
- Backward navigation should feel like returning (slide right, scale down).
- Use the View Transitions API where supported for cross-document or cross-route transitions.

### Loading and Progress- Use skeleton screens that match the layout of incoming content. Animate a shimmer gradient across them (left to right, 1.5-2s loop, ease-in-out).
- Determinate progress bars should animate smoothly. Use `transition` on the width property with ease-out.
- Indeterminate spinners should rotate smoothly (linear easing, 700-1000ms per rotation).
- Pulsing indicators (typing dots, recording) use a sinusoidal ease at 1-2s intervals.
- Content appearing after load should fade in, not pop in. Even 150ms of fade makes it feel intentional.

### Scroll-Linked Animations
- Use `IntersectionObserver` for scroll-triggered animations, not scroll event listeners.
- Elements entering the viewport should animate once, not re-animate on every scroll.
- Parallax effects should be subtle (0.1-0.3 rate difference). Extreme parallax causes motion sickness.
- Scroll-linked progress indicators (reading progress bar) should update smoothly using `requestAnimationFrame`.
- Always disable scroll-linked animations when `prefers-reduced-motion` is active.

### Micro-interactions
- Button press: scale to 0.97 on active state, return with spring easing. Duration 100ms.
- Toggle switch: translate the thumb with ease-in-out, 200ms. Change background color simultaneously.
- Checkbox: scale check mark from 0 with a slight overshoot (spring), 200ms.
- Hover: transition background-color or shadow with 150ms ease-out. Remove on mouse leave with 100ms ease-in.
- Ripple effect: radial scale from click point with opacity fade, 400ms ease-out.
- Like/favorite: scale up to 1.2 then spring back to 1.0, with color change. 300ms total.
- Pull-to-refresh: rubber-band resistance (logarithmic) during pull, spring release on let go.

### Reduced Motion
- Wrap all non-essential animations in `@media (prefers-reduced-motion: no-preference)`.
- In reduced-motion mode, replace motion with instant state changes (opacity crossfade at 0ms or very short fade).
- Keep functional animations (progress bars, loading indicators) but simplify them. A spinner can become a pulsing dot.
- Never remove feedback entirely. If a button animates on press, in reduced-motion mode it should still change visually (color, shadow) just without movement.
- Test the entire application with reduced motion enabled.

### Performance Best Practices
- Monitor animation frame rate. Target 60fps consistently; 30fps is the minimum acceptable.
- Use the Performance panel in DevTools to check for layout thrashing during animations.
- Batch DOM reads and writes. Do not interleave reading layout properties and writing style changes.
- Debounce or throttle animations tied to scroll, resize, or mouse move events.
- On low-power devices, reduce animation complexity or disable entirely.
- Use CSS animations for simple transitions. Use JavaScript (Web Animations API or libraries) for complex, interactive, or physics-based motion.

## Checklist
- [ ] Every animation serves a communicative purpose (not decorative only)
- [ ] Easing functions match the motion type (ease-out for enter, ease-in for exit)
- [ ] Durations fall within recommended ranges (100-500ms)
- [ ] Only transform and opacity are animated for performance
- [ ] Stagger is used for grouped element entrances with consistent intervals
- [ ] Exit animations are faster than entrance animations
- [ ] All animations respect prefers-reduced-motion with appropriate fallbacks
- [ ] No animation exceeds 700ms duration
- [ ] Loading states use skeleton screens or appropriate progress indicators
- [ ] Spatial continuity is maintained between related views
- [ ] Animation frame rate stays at 60fps under normal conditions
- [ ] will-change is used sparingly and removed after animation completes

## Anti-patterns
- Animating layout properties (width, height, top, left, margin, padding) causing layout thrashing.
- Using the same duration for all animations regardless of distance or importance.
- Animations that block user interaction (non-cancellable, long-running transitions).
- Bounce or elastic easing on UI elements that do not represent physical objects.
- Auto-playing animations that loop indefinitely without user control.
- Staggering more than 8 elements, creating a tedious wave effect.
- Using `transition: all` instead of specifying exact properties, causing unexpected animations.
- Animating elements off-screen or hidden elements, wasting GPU resources.
- Jank from animating during JavaScript-heavy operations.
- Using setTimeout for animation timing instead of requestAnimationFrame or CSS transitions.
- Parallax effects with extreme rates that cause motion sickness.
- Entry animations that delay content visibility beyond 500ms total.

## Keywords
animation, motion, easing, transition, duration, timing, micro-interaction, choreography, stagger, reduced motion, GPU acceleration, transform, opacity, spring physics, skeleton screen, loading animation, scroll animation, spatial continuity, page transition, keyframe
