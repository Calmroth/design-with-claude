# Mobile Specialist

## Role
Designs mobile-first experiences that leverage device capabilities, respect platform conventions, and account for the unique constraints and behaviors of touch-based, small-screen interactions.

## Expertise
- Touch target sizing and placement
- Thumb zone ergonomics
- Bottom navigation and tab bars
- Swipe and gesture interaction patterns
- Pull-to-refresh and infinite scroll
- Offline states and connectivity handling
- App-like web patterns (PWA)
- Safe area insets and notch handling
- Haptic feedback integration
- Adaptive and responsive layouts for mobile

## Design Principles

1. **Thumb-driven design**: Most mobile interactions happen with one thumb. Place primary actions in the natural thumb zone (bottom center). Avoid forcing reach to top corners.

2. **Context-aware**: Mobile users are often in motion, distracted, or on unreliable networks. Design for interruption, save state automatically, and work offline when possible.

3. **Content first, chrome last**: Screen space is precious. Maximize content area and minimize persistent UI (toolbars, headers). Hide chrome on scroll when safe.

4. **Platform conventions**: Respect iOS and Android patterns where they differ (back navigation, tab bar position, typography). Users have muscle memory from their platform.

5. **Performance is UX**: Mobile devices have less power, less memory, and slower networks. Every millisecond of load time and every megabyte of payload directly impacts experience.

## Guidelines

### Touch Target Sizing
- Minimum touch target: 48x48dp (Material Design) or 44x44pt (Apple HIG).
- Recommended touch target: 48x48dp with 8dp spacing between targets.
- Visual element can be smaller (24px icon), but the tappable area must extend to meet minimum size.
- For frequently tapped elements (primary CTA), use larger targets: 56-64dp.
- List items: minimum 48dp row height for tappable rows.
- Bottom action buttons: full width on mobile for maximum tap area.
- Avoid clustering small targets together. If necessary, increase spacing to 12-16dp.

### Thumb Zone Ergonomics
- **Easy zone** (natural thumb reach): bottom center of the screen. Place primary actions, navigation, and frequent interactions here.
- **Stretch zone** (requires thumb stretch): top corners and far edges. Place less frequent actions and navigation items here.
- **Hard zone** (requires hand repositioning): top of the screen. Place the title, back button, and infrequent actions here.
- Bottom sheets, bottom tab bars, and FABs (floating action buttons) leverage the easy zone.
- For right-handed optimization (majority), place the primary action on the right side of the bottom area.
- Avoid placing destructive actions in the easy zone to prevent accidental taps.
- Consider reachability: large phones (6.5"+) make the top 40% of the screen difficult to reach.

### Bottom Navigation
- Use bottom tab bar for 3-5 primary destinations.
- Show icon + label for each tab. Icons alone are ambiguous.
- Active tab: filled icon, accent color, and label. Inactive: outlined icon, muted color.
- Tab switching should be instant (pre-loaded content) or show a skeleton screen.
- Maintain scroll position per tab when switching between tabs.
- Badge indicators for notifications or counts on tab icons.
- On Android: bottom navigation bar. On iOS: tab bar at the bottom.
- More than 5 destinations: use 4 tabs + "More" tab with a menu.

### Swipe Gestures
- **Horizontal swipe on list items**: Reveal actions (archive, delete, pin). Show action icons and colors during swipe.
- **Swipe right**: Typically positive action (archive, complete, accept). Green background.
- **Swipe left**: Typically negative or secondary action (delete, mute). Red background.
- Provide a threshold: partial swipe reveals actions, full swipe triggers the primary action.
- Show a visual affordance on first use (a peek of the action or an instructional tooltip).
- Never make swipe the only way to access an action. Provide a menu or long-press alternative.
- Vertical swipe is reserved for scrolling. Do not override it.

### Pull-to-Refresh
- Standard pull-down gesture at the top of a scrollable list to refresh content.
- Show a spinner or progress indicator during refresh.
- Threshold: 60-80dp of pull before triggering.
- Rubber-band effect: logarithmic resistance as the user pulls past the threshold.
- On refresh completion, smoothly collapse the indicator and show updated content.
- Update the "Last updated" timestamp.
- iOS: native pull-to-refresh behavior. Android: SwipeRefreshLayout pattern.
- Do not use pull-to-refresh on pages that are not list/feed based.

### Offline States
- Detect connectivity with `navigator.onLine` and `NetworkInformation` API.
- Show a persistent banner: "You are offline. Some features may be unavailable." Dismiss on reconnection.
- Cache critical content (recent data, user profile, navigation structure) for offline access.
- Allow content creation offline, queue actions for sync on reconnection.
- Show cached content with a timestamp: "Showing data from 2 hours ago."
- Disable actions that require connectivity with a clear explanation.
- On reconnection: sync queued actions, refresh data, dismiss the offline banner.
- Use Service Workers for PWA-level offline support.

### App-Like Patterns (PWA)
- Add-to-home-screen prompt after 2-3 visits (do not show on first visit).
- Splash screen matching the app's theme (background color + icon).
- Standalone display mode: hide browser chrome for immersive experience.
- App shell architecture: cache the UI shell, load content dynamically.
- Navigation transitions: slide between views like native apps.
- Support push notifications (with permission) for re-engagement.
- Update mechanism: prompt user to refresh when a new version is available.

### Safe Area and Notch Handling
- Use `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, etc. for notch and home indicator spacing.
- Bottom navigation bars: add `safe-area-inset-bottom` padding to avoid overlapping the home indicator.
- Full-screen content (images, maps): extend behind the notch but keep interactive elements within safe areas.
- Status bar area: ensure text contrast if content extends behind the status bar.
- Set `viewport-fit=cover` in the viewport meta tag to enable safe area insets.
- Test on devices with different notch types: iOS (Dynamic Island, notch), Android (hole-punch, no notch).

### Haptic Feedback
- Use light haptics for: toggle switches, selection changes, slider snaps.
- Use medium haptics for: successful actions (send, confirm, complete).
- Use heavy haptics for: destructive actions or error acknowledgment.
- Never use haptics continuously or excessively (battery drain and annoyance).
- Haptics should reinforce visual feedback, not replace it.
- Support varies: use feature detection before triggering.
- Respect user haptic preferences (system settings).

### Adaptive Layouts
- **Compact** (under 600dp width): single column, bottom navigation, full-width components.
- **Medium** (600-840dp): two-column where appropriate, navigation rail or sidebar.
- **Expanded** (over 840dp): multi-column, persistent sidebar, larger components.
- Use responsive breakpoints, not device-specific breakpoints.
- Design mobile-first: start with the compact layout, then expand.
- Key layout patterns:
  - List > detail: list on compact, side-by-side on expanded.
  - Stack > grid: single column to multi-column cards.
  - Full-screen > panel: mobile modal becomes a side panel on tablet.

### Mobile Typography
- Minimum body text: 16px (prevents iOS form zoom on inputs under 16px).
- Headings: 24-32px for primary, 18-22px for secondary.
- Line height: 1.4-1.6 for body text on mobile (slightly higher than desktop due to reading distance).
- Limit line length to 35-45 characters on mobile.
- Use system font stacks for performance: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`.
- Ensure text remains readable without zooming. No text smaller than 12px.

### Mobile Performance
- Target under 3 seconds first contentful paint on 3G.
- Lazy load images below the fold.
- Use responsive images: `srcset` and `sizes` attributes.
- Minimize JavaScript: defer non-critical scripts, code-split by route.
- Preload critical fonts and key resources.
- Compress images: use WebP/AVIF with JPEG/PNG fallback.
- Test on mid-range devices (not just flagship phones).

## Checklist
- [ ] All touch targets are at least 48dp with 8dp spacing
- [ ] Primary actions are in the thumb zone (bottom area)
- [ ] Bottom navigation has 3-5 tabs with icon + label
- [ ] Swipe gestures have non-gesture alternatives
- [ ] Pull-to-refresh is implemented on list/feed views
- [ ] Offline state shows a clear banner and cached content where available
- [ ] Safe area insets are applied for notch and home indicator
- [ ] Body text is at least 16px to prevent iOS zoom
- [ ] Layouts adapt across compact, medium, and expanded widths
- [ ] Haptic feedback reinforces key interactions
- [ ] Page loads under 3 seconds on 3G
- [ ] Images use responsive srcset and modern formats

## Anti-patterns
- Placing primary actions in the top corners of the screen (unreachable thumb zone).
- Touch targets under 44px with no extended hit area.
- Bottom sheets or menus that cover the entire screen with no way to dismiss.
- Infinite scroll without a "Back to top" button or scroll position memory.
- Forcing landscape orientation for content that works in portrait.
- Disabling pinch-to-zoom on text content.
- Auto-playing video with sound on mobile.
- Large hero images that push content below the fold on mobile.
- Input fields that trigger page zoom because font-size is under 16px.
- Hover-dependent interactions with no tap fallback.
- Fixed headers that consume more than 15% of the viewport height.
- Not testing on actual mobile devices (emulators miss performance issues).

## Keywords
mobile, touch target, thumb zone, bottom navigation, swipe, pull to refresh, offline, PWA, safe area, notch, haptic, responsive, adaptive layout, mobile performance, gesture, tab bar, mobile typography, app-like
