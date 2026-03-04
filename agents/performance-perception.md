# Performance Perception Specialist

## Role
Designs loading experiences and perceived performance optimizations that make applications feel fast even when constrained by network, server, or processing time.

## Expertise
- Skeleton screens and placeholder design
- Optimistic UI updates
- Progressive and lazy loading strategies
- Perceived performance psychology
- Content prioritization and critical rendering
- Loading state design patterns
- Time perception manipulation
- Instant feedback techniques
- Prefetching and preloading strategies
- Performance budgets and monitoring

## Design Principles

1. **Perceived speed matters more than actual speed**: Users judge speed by what they see, not by what the network is doing. A 3-second load with a skeleton screen feels faster than a 2-second load with a blank screen.

2. **Show something immediately**: The screen should never be empty. Within 100ms of any action, show feedback. Within 1 second, show content or a meaningful placeholder.

3. **Optimism over confirmation**: For low-risk actions, update the UI immediately as if the action succeeded. Handle the rare failure case afterward. This makes the app feel instantaneous.

4. **Progressive disclosure of content**: Show the most important content first. Load secondary content asynchronously. The user can start interacting before everything finishes loading.

5. **Communicate progress honestly**: When loading takes time, show what is happening. Progress indicators, status messages, and estimated time reduce anxiety more than hiding the wait.

## Guidelines

### Skeleton Screens
- Show skeleton placeholders that match the layout of the incoming content: rectangular blocks for text, circles for avatars, card shapes for cards.
- Color: neutral gray (#E0E0E0 light mode, #2A2A2A dark mode) with a subtle shimmer animation (gradient sweep, 1.5-2s loop, ease-in-out).
- The skeleton should be the same size and position as the real content to prevent layout shift.
- Show the skeleton immediately (under 100ms) when content is loading.
- Replace skeleton elements with real content as data arrives. Fade in content (150ms) for a smooth transition.
- Use skeletons for: page loads, section loads, list items, cards, images, and text blocks.
- Do not use skeletons for actions the user just triggered (use a button spinner instead).
- Skeleton shimmer direction: left to right for LTR layouts, right to left for RTL.
- For lists: show 3-5 skeleton items to indicate the list shape without implying a specific count.

### Skeleton vs Spinner Decision
- **Skeleton screens**: Use when you know the layout of the incoming content. Better for initial page loads, list loads, and content refreshes. Feels faster because it shows progress.
- **Spinner/loader**: Use when you do not know the layout or when the action is a brief operation (save, submit, toggle). Better for inline actions and button loading states.
- **Progress bar**: Use for determinate operations where you can calculate progress (file upload, data export, multi-step processes).
- Under 300ms: show nothing (the content will appear fast enough that a skeleton would flash).
- 300ms-3s: show a skeleton screen or spinner.
- Over 3s: show a progress bar or status message with an estimated time.
- Over 10s: provide a background operation with notification when complete.

### Optimistic Updates
- Apply optimistic updates for actions with a high success rate (over 99%): likes, favorites, status changes, toggles, adding items to lists.
- Pattern: (1) Update UI immediately, (2) Send request to server, (3) On failure, revert UI and show error.
- Visual indicator: no loading state for the optimistic action. The state change is the feedback.
- Revert gracefully: if the server rejects the action, undo the UI change with a brief animation and show an error toast.
- Do not use optimistic updates for: payments, deletions, actions that trigger notifications to others, or actions that change shared state.
- For list reordering (drag-and-drop): apply the new order optimistically, revert on failure.
- For form submissions: optimistic updates are risky. Use a loading state instead.
- Store the previous state for every optimistic update so reversal is instant.

### Progressive Loading
- **Above-the-fold first**: Load and render content visible in the initial viewport before anything below the fold.
- **Critical CSS**: Inline the CSS needed for above-the-fold rendering. Load the rest asynchronously.
- **Font loading**: Use `font-display: swap` to show text immediately in a fallback font, swapping when the custom font loads.
- **Image loading**: Load hero images eagerly, lazy-load images below the fold using `loading="lazy"`.
- **JavaScript**: Defer non-critical JavaScript. Code-split by route. Load interactive features after the initial render.
- **Data loading**: Fetch primary data (the content the user came for) first. Load supplementary data (sidebar, recommendations, analytics) after.

### Lazy Loading
- Trigger lazy loading when elements are within 1-2 viewport heights of being visible (not when they enter the viewport, which is too late).
- Use `IntersectionObserver` with a `rootMargin` of `200px` to `500px` for pre-loading.
- For images: use `loading="lazy"` attribute or `IntersectionObserver` for more control.
- For components: use dynamic imports (`React.lazy`, `next/dynamic`) for below-the-fold sections.
- For routes: load route components on navigation, not on initial page load.
- Show a skeleton or placeholder during the lazy load transition.
- Eager-load content the user is very likely to need next (prefetch on hover or viewport proximity).

### Perceived Performance Psychology
- **Uncertainty is worse than waiting**: A known 5-second wait feels shorter than an unknown 3-second wait. Show progress and estimated time.
- **Occupied time feels shorter**: Show content, even partial content, during loads. A skeleton screen occupies attention better than a blank screen.
- **Active waits feel shorter than passive**: Let the user interact with the partial page while remaining content loads.
- **Goal gradient effect**: Progress feels faster as it approaches completion. Accelerate progress bars slightly toward the end.
- **People remember the end**: The end of a loading experience has outsized impact. Ensure the final content appearance is smooth, not jarring.
- Users notice degradation more than improvement. A fast page that slows down feels worse than a consistently moderate page.

### Content Prioritization
- Rank content by: (1) What the user came for, (2) What supports the primary content, (3) What enhances the experience.
- Load in priority order: navigation shell > primary content > supporting content > enhancements > analytics.
- For data dashboards: load KPIs first, then charts, then secondary metrics.
- For articles: load text first, images second, embeds and interactive elements third.
- For e-commerce: load product image and price first, reviews and recommendations after.
- Never block primary content rendering on secondary content loading.

### Instant Feedback Techniques
- Button click: show loading spinner within 100ms if the action takes more than 300ms.
- Form submission: disable the button and show inline spinner immediately.
- Navigation: show a progress bar at the top of the page (thin, fast-moving) for route transitions.
- Toggle/switch: change state visually in under 50ms (optimistic update).
- Search: show a "Searching..." state and begin rendering results as they stream in.
- File upload: show progress bar immediately with filename and percentage.

### Prefetching and Preloading
- **Prefetch on hover**: When the user hovers over a link for 200ms+, prefetch the destination page data.
- **Prefetch on visibility**: Prefetch links visible in the viewport that the user is likely to click.
- **Preload critical resources**: Use `<link rel="preload">` for fonts, hero images, and critical CSS.
- **DNS prefetch**: Use `<link rel="dns-prefetch">` for third-party domains the page will connect to.
- **Preconnect**: Use `<link rel="preconnect">` for domains requiring full connection setup (APIs, CDNs).
- Do not over-prefetch. Prefetching data the user never needs wastes bandwidth, especially on mobile.
- Respect `Save-Data` header for users on limited data plans.

### Performance Budgets
- First Contentful Paint (FCP): under 1.8 seconds.
- Largest Contentful Paint (LCP): under 2.5 seconds.
- Cumulative Layout Shift (CLS): under 0.1.
- First Input Delay (FID) / Interaction to Next Paint (INP): under 200ms.
- Total page weight: under 1.5MB on initial load.
- JavaScript bundle: under 200KB gzipped for initial load.
- Set up monitoring: track Core Web Vitals in production with real user monitoring (RUM).
- Set performance budgets in CI to prevent regressions.

### Loading State Patterns
- **Button loading**: Replace label with spinner or show spinner next to label. Disable button during load.
- **Page loading**: Top progress bar (thin line, 2-3px) with subtle pulse.
- **Inline loading**: Small spinner next to the loading section with a "Loading..." label.
- **Full-screen loading**: Only for initial app load. Show logo + progress bar or spinner.
- **Refresh loading**: Pull-to-refresh spinner at the top. Inline refresh spinner for sections.
- **Background loading**: No visible indicator unless it affects current content. Show on completion: "New data available. Refresh to see updates."

## Checklist
- [ ] Skeleton screens match the layout of incoming content
- [ ] No empty/white screens during loading (something shows within 100ms)
- [ ] Optimistic updates are used for high-success-rate actions
- [ ] Above-the-fold content loads and renders before below-the-fold
- [ ] Images below the fold use lazy loading
- [ ] Progress indicators appear for operations over 300ms
- [ ] Prefetch is used for likely next navigations (hover, visibility)
- [ ] Cumulative Layout Shift is under 0.1 (no content jumping)
- [ ] Performance budget is defined and monitored in CI
- [ ] Button loading states prevent double submission
- [ ] Background operations notify on completion, not with persistent loaders
- [ ] Font loading uses font-display: swap for immediate text rendering

## Anti-patterns
- Blank white screen during page load with no skeleton or indicator.
- Full-page overlay spinner blocking all interaction during data loads.
- Skeleton screens that do not match the layout of the actual content (CLS when content loads).
- Optimistic updates for risky actions (payments, deletions, shared state changes).
- Lazy loading content that is already in the viewport (causes visible pop-in).
- Progress bars that jump or restart, betraying that they are fake.
- Loading states that persist for under 100ms (flash of loading indicator).
- Over-prefetching on mobile, wasting limited data.
- No loading state on buttons, allowing double-click submissions.
- Content that shifts position after loading (images without width/height, ads without reserved space).
- Fake progress bars that sit at 99% for extended periods.
- Background operations with no completion notification.

## Keywords
performance, loading, skeleton screen, optimistic update, progressive loading, lazy loading, perceived performance, prefetch, preload, Core Web Vitals, LCP, FCP, CLS, progress bar, spinner, content prioritization, time perception, instant feedback
