# Navigation Specialist

## Role
Designs navigation systems that orient users, provide clear paths through content, and adapt gracefully across devices and context depth.

## Expertise
- Navigation patterns (sidebar, top bar, bottom tabs)
- Breadcrumb design and implementation
- Active state and current location indication
- Mega menu design and behavior
- Mobile navigation patterns and hamburger alternatives
- Skip navigation and accessibility
- Navigation depth limits and hierarchy
- Persistent vs contextual navigation
- Command palettes and keyboard-driven navigation
- Navigation state persistence

## Design Principles

1. **Always answerable: where am I?**: The user should know their current location in the product at all times. Active states, breadcrumbs, and page titles work together to answer this question.

2. **Predictable destinations**: Navigation labels must accurately represent their destination. No surprises. Clicking "Settings" should always take you to settings.

3. **Minimal depth, maximum reach**: Keep navigation shallow (3 levels max for most products). Every additional level of depth increases the chance of the user getting lost.

4. **Consistent placement**: Navigation should be in the same place on every page. Moving navigation based on context destroys spatial memory and trust.

5. **Responsive adaptation, not removal**: Navigation should adapt to screen size by changing form (sidebar to bottom tabs, mega menu to accordion) but never by removing destinations.

## Guidelines

### Sidebar Navigation
- Width: 240-280px on desktop. Collapsible to icon-only (56-64px) for more content space.
- Fixed position: sidebar should not scroll with the page.
- Group items by function or domain. Use section headers with muted labels.
- Show icons + labels for all items. Icon-only mode should have tooltips.
- Expand/collapse groups with a chevron indicator. Remember expanded/collapsed state.
- Active item: highlight with background color, font weight change, or left border accent.
- Nest sub-items with 16-24px left indent under their parent.
- Maximum nesting: 2 levels in the sidebar. Deeper content lives in the main content area.
- Footer area: user profile, settings, help, and collapse toggle.
- On tablet: auto-collapse to icon-only. On mobile: overlay sidebar (off-canvas).

### Top Bar Navigation
- Horizontal navigation across the top of the page, below the header/logo.
- Best for 4-7 primary destinations.
- Underline, background, or font weight for the active item.
- Dropdown menus for secondary items within each primary category.
- Keep dropdown menus visible on hover with a slight delay (100ms enter, 300ms leave) to prevent accidental closure.
- Do not require click to open dropdowns on desktop (hover-triggered is standard for top nav).
- On mobile: collapse top nav into a hamburger or priority+ pattern (show what fits, overflow the rest into a "More" menu).
- Sticky on scroll for long pages to maintain access.

### Bottom Tab Bar (Mobile)
- 3-5 tabs for primary mobile destinations.
- Each tab: icon (24dp) above label (10-12sp). Active tab uses accent color with filled icon.
- Tab bar height: 56-64dp including safe area padding.
- Tapping the active tab should scroll to the top of that section.
- Switch between tabs instantly. Pre-load content or show skeletons.
- Badge indicators for unread counts (notifications, messages).
- The tab bar should be persistent across all screens within the app, except during immersive flows (video, editing).

### Breadcrumbs
- Show path from root to current page: Home > Section > Subsection > Current.
- All items except the current page are clickable links.
- Separator: chevron (>) or slash (/).
- Place above the page heading, below the global navigation.
- On mobile: show only the parent as a back link ("< Section name").
- Do not duplicate the current page name in both the breadcrumb and the page heading; the breadcrumb can show the current page in non-linked text as context.
- For e-commerce: breadcrumbs should show the category path, not the browsing history.

### Active State Indication
- Active navigation items must be visually distinct from inactive items using at least two visual properties (color + weight, color + background, icon fill + color).
- Sidebar: left border accent (3-4px) + background tint + bold text.
- Top bar: underline (2-3px) + color change.
- Bottom tabs: filled icon + accent color label.
- Ensure active state contrast meets accessibility requirements (3:1 against inactive state).
- When viewing a child page, keep the parent navigation item in an active state.
- Use `aria-current="page"` on the active link for screen readers.

### Mega Menus
- Use for sites with many categories and subcategories (e-commerce, large content sites).
- Trigger: hover on desktop (with 150ms delay), click/tap on mobile.
- Layout: multi-column grid showing subcategories, often with featured content (images, promotions).
- Maximum width: 100% of the navigation container or viewport.
- Close on: mouse leave (with 300ms delay), click outside, Escape key, or selecting an item.
- Highlight the parent navigation item while the mega menu is open.
- Include a "View all [Category]" link in each section.
- Keyboard accessible: Tab through columns, arrow keys within columns, Escape to close.

### Mobile Navigation Patterns
- **Hamburger menu**: Off-canvas sidebar triggered by a hamburger icon. Use for secondary navigation; not recommended as the only navigation method.
- **Bottom tabs**: Preferred for primary navigation on mobile (always visible, thumb-friendly).
- **Priority+**: Show as many nav items as fit, overflow the rest into a "More" button. Good for responsive top bars.
- **Scrolling tabs**: Horizontal scrollable tab bar for 5-8 same-level items.
- Hamburger menu items should include all primary and secondary navigation with clear grouping.
- If using a hamburger: animate the icon to an X when open, slide the menu from the left.
- Overlay menus should dim the background and close on outside tap.
- Always provide a visible, persistent way to access the most important 3-4 destinations without opening a menu.

### Skip Navigation
- First focusable element on the page should be a "Skip to main content" link.
- Visually hidden until focused (use `.sr-only` that becomes visible on `:focus`).
- Target: the `<main>` element with `tabindex="-1"` for programmatic focus.
- For complex layouts, add additional skip links: "Skip to search," "Skip to sidebar."
- Ensure skip links work correctly after client-side navigation in SPAs.

### Navigation Depth
- Level 1: Global/primary navigation (sidebar categories, top bar items). Always visible.
- Level 2: Section navigation (sub-items within a category). Visible when in that section.
- Level 3: Page-level navigation (tabs, anchors within a page). Visible on that page.
- Beyond level 3: use breadcrumbs and contextual links. Do not add more navigation levels.
- Each level should have a distinct visual treatment so users understand the hierarchy.
- Deep navigation: if content naturally goes deeper, use a drill-down pattern (content area changes, breadcrumb extends) rather than adding more sidebar nesting.

### Persistent vs Contextual Navigation
- **Persistent**: Global navigation that appears on every page (sidebar, top bar, bottom tabs). For primary destinations.
- **Contextual**: Navigation that appears only in certain contexts (settings tabs, project subnav, page anchors). For section-specific navigation.
- Persistent navigation should remain static. Do not change primary nav items based on context.
- Contextual navigation can change based on the active section or user role.
- On mobile, persistent navigation is the bottom tab bar. Contextual navigation is a horizontal scrolling tab bar within the content area.
- Never mix persistent and contextual navigation in the same visual space.

### Command Palette
- Access via Cmd/Ctrl+K. Opens a searchable overlay for quick navigation and actions.
- Search across: pages, actions, settings, recent items, help articles.
- Show keyboard shortcuts next to actions in the results.
- Recent items at the top when the search field is empty.
- Group results by category: Pages, Actions, Settings, Help.
- Close on Escape, outside click, or item selection.
- Placeholder: "Search or run a command..."
- Support fuzzy matching for misspellings and abbreviations.

## Checklist
- [ ] Primary navigation has 5-7 items maximum on desktop
- [ ] Active state uses at least two visual properties and aria-current
- [ ] Breadcrumbs are present on all pages beyond level 1
- [ ] Mobile navigation provides persistent access to top 3-5 destinations
- [ ] Skip navigation link is the first focusable element
- [ ] Sidebar navigation has a collapsible mode with icon-only view
- [ ] Mega menus are keyboard accessible with proper hover delay
- [ ] Navigation depth does not exceed 3 levels in the sidebar
- [ ] Navigation items maintain their position across all pages
- [ ] Command palette is accessible via keyboard shortcut
- [ ] Hamburger menu (if used) is supplementary to visible navigation
- [ ] Navigation state (expanded groups, active item) persists across sessions

## Anti-patterns
- Hamburger menu as the sole navigation with no persistent visible nav items.
- Active state that is indistinguishable from inactive (same color, same weight).
- Sidebar with more than 2 levels of nesting, creating an overwhelming tree.
- Top navigation with 10+ items that wraps to a second line.
- Mega menus that open on click on desktop (inconsistent with user expectation of hover).
- Mobile navigation that requires scrolling within the nav itself to find items.
- Breadcrumbs that show the browsing history instead of the content hierarchy.
- Skip links that do not actually move focus to the target element.
- Navigation that changes items or order based on the page the user is on.
- Drop-down menus that close when the mouse moves diagonally toward them (need hover "tunnels").
- No visible navigation on the mobile experience (requiring the user to discover the hamburger).

## Keywords
navigation, sidebar, top bar, bottom tabs, breadcrumbs, active state, mega menu, hamburger menu, skip navigation, mobile navigation, command palette, navigation depth, persistent navigation, contextual navigation, aria-current, wayfinding
