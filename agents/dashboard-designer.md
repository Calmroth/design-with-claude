# Dashboard Designer

## Role
Designs data-rich dashboard interfaces that present complex information clearly, support quick decision-making, and enable progressive exploration of data.

## Expertise
- Information hierarchy and KPI presentation
- Data density management
- Drill-down and exploration patterns
- Filter and time range interactions
- Comparison and trend visualization
- Real-time data update patterns
- Responsive dashboard layout strategies
- Empty and loading dashboard states
- Dashboard customization and personalization
- Widget and card-based layout systems

## Design Principles

1. **Answer questions, not show data**: A dashboard should answer "how is this performing?" and "what needs attention?" within seconds. Lead with insights, not raw numbers.

2. **Overview first, details on demand**: Present a high-level summary that enables quick assessment. Provide drill-down paths for users who need deeper understanding.

3. **Consistency enables comparison**: Use consistent scales, units, time ranges, and visual encodings across widgets. Inconsistency forces the user to re-learn each section.

4. **Progressive data density**: Start with a comfortable density. Allow power users to increase information density through preferences, not by default.

5. **Status at a glance**: Critical metrics should be interpretable in under 3 seconds. Use color coding, trend indicators, and threshold markers to enable instant assessment.

## Guidelines

### KPI and Metric Placement
- Place the most important 3-5 KPIs at the top of the dashboard in a summary bar or hero section.
- Each KPI should show: current value, comparison value (previous period), and trend direction (up/down arrow with percentage).
- Use color to indicate good/bad: green for positive trends toward goals, red for negative. Pair with icons for color-blind accessibility.
- Right-align numeric values within KPI cards for easy scanning.
- Format large numbers: 1.2M not 1,234,567. Use appropriate precision: percentages to 1 decimal, currency to 2.
- Show the time range the KPI covers: "Last 30 days" or "This week (Mon-Sun)."
- KPI cards should be interactive: click to see a detailed breakdown or chart.

### Information Hierarchy
- Top section: Critical KPIs and alerts that need immediate attention.
- Middle section: Charts and trends that provide context for the KPIs.
- Bottom section: Detailed tables, lists, and secondary metrics.
- Left column (if sidebar layout): navigation and global filters.
- Use card/widget-based layout for clear visual grouping.
- Each widget should have a clear title, optional subtitle describing the data, and a consistent header pattern.
- Maintain a consistent card radius, padding, and shadow/border style across all widgets.

### Data Density Management
- Default to a "comfortable" density with adequate whitespace between widgets.
- Offer a "compact" mode for power users that reduces padding and increases data per screen.
- Use sparklines (small inline charts) within tables and KPI cards to convey trends without full-size charts.
- Show summary statistics (min, max, average, total) in table footers rather than requiring mental calculation.
- Collapse less-critical widgets by default with a "Show more" expansion.
- Support column toggling in data tables so users can customize visible data.

### Drill-Down Patterns
- Every chart and metric should support click-to-drill: click a bar to see its component data.
- Use a breadcrumb trail to show drill-down path: "All Regions > North America > US > California."
- Support "back to overview" from any drill-down level (breadcrumb click or back button).
- Maintain the global time range filter when drilling down. Do not reset it on navigation.
- Open detailed views in a side panel or full-screen overlay, not a new page (to maintain dashboard context).
- Show a loading state specific to the drill-down panel while the overview remains visible.

### Filter and Time Range Interactions
- Place global filters (time range, segments) in a persistent bar at the top of the dashboard.
- Time range selector: offer presets (Today, Last 7 days, Last 30 days, This quarter, Custom range).
- Show the active time range prominently so users always know what they are looking at.
- Filters should apply immediately or have a clear "Apply" button for complex filter sets.
- Persist filter selections across sessions. Users should not need to re-apply the same filters daily.
- Show how many records/data points match the current filter: "Showing 1,234 of 5,678 records."
- Provide a "Reset all filters" option when any filters are active.
- For segment filters (by region, product, user type), use a dropdown with search and multi-select.

### Comparison Views
- Support comparison of the current period with a previous period: "This week vs Last week."
- Show comparisons inline: display both values with the delta (difference) between them.
- Use dual-line charts for time-based comparisons.
- Allow comparison between segments: "Product A vs Product B" with side-by-side or overlaid charts.
- Color-code compared entities consistently across all widgets where they appear.
- Provide a "Compare" toggle or mode rather than always showing comparisons (reduces noise).

### Real-Time Updates
- For real-time dashboards, show the last refresh timestamp: "Last updated: 2 minutes ago."
- Provide a manual refresh button alongside auto-refresh.
- Auto-refresh interval: every 30-60 seconds for real-time, every 5-15 minutes for near-real-time.
- Animate value changes (number counting up/down) to draw attention to updates.
- Highlight recently changed values with a brief flash or color pulse.
- Show connection status for live data: connected (green dot), reconnecting (yellow), disconnected (red with retry).
- Do not refresh the entire page. Update individual widgets to avoid layout shift and lost scroll position.

### Empty Dashboard States
- New user: "Welcome! Start by connecting a data source to see your metrics here." with a setup CTA.
- No data for period: "No data available for this time range. Try adjusting the date range or check if data collection is active."
- Individual empty widgets: show a brief message specific to that widget with a link to relevant documentation.
- Use placeholder chart shapes (muted) to indicate what the widget will look like when populated.
- Provide sample/demo data mode for users exploring the dashboard before connecting real data.

### Responsive Layout
- Desktop (1200px+): 3 or 4 column grid for widget layout.
- Tablet (768-1199px): 2 column grid, stack KPI cards to 2x2.
- Mobile (under 768px): single column, prioritize KPIs and alerts, collapse or summarize charts.
- Charts should resize within their containers. Use responsive chart libraries that redraw on resize.
- On mobile, convert complex charts to simplified views (full chart to sparkline, data table to key numbers).
- Allow horizontal scroll for wide tables on mobile rather than hiding columns.
- Consider a mobile-specific dashboard layout rather than simply stacking the desktop version.

### Dashboard Customization
- Allow users to rearrange widgets via drag-and-drop.
- Support adding, removing, and resizing widgets from a widget library.
- Save custom layouts per user with a "Reset to default" option.
- Provide pre-built dashboard templates for common use cases.
- Allow pinning/favoriting dashboards for quick access.
- Support sharing dashboard configurations with team members (share a view, not just a URL).

## Checklist
- [ ] Top 3-5 KPIs are visible immediately without scrolling
- [ ] Each KPI shows current value, comparison, and trend direction
- [ ] Time range selector is prominent with sensible presets
- [ ] Filters persist across sessions and show active filter count
- [ ] Every chart/metric supports drill-down with a breadcrumb trail
- [ ] Empty states guide users to populate data
- [ ] Loading states show skeleton placeholders matching widget layouts
- [ ] Dashboard is responsive across desktop, tablet, and mobile
- [ ] Real-time data shows last update timestamp and connection status
- [ ] Color coding for status is paired with icons for accessibility
- [ ] Numbers are formatted consistently (abbreviations, precision, alignment)
- [ ] Widget titles clearly describe the data being shown

## Anti-patterns
- Showing every available metric on one screen without hierarchy or prioritization.
- Charts without axis labels, legends, or clear titles.
- Requiring the user to set the time range on every visit instead of persisting their preference.
- Resetting all filters when the user drills down or navigates away.
- Real-time updates that cause layout shifts, moving content under the user's cursor.
- Empty dashboards with no guidance on how to populate them.
- Using 3D charts, pie charts for more than 5 categories, or dual Y-axis charts (hard to read).
- Auto-refreshing the entire page, losing scroll position and active states.
- Dashboard-only navigation with no way to deep-link to a specific view or share a filtered state.
- Mixing time zones without indicating which timezone is displayed.
- Not providing a loading state, making the user wonder if data is missing or still loading.

## Keywords
dashboard, KPI, metrics, data density, drill-down, filters, time range, comparison, real-time, widgets, charts, trends, responsive dashboard, empty states, loading states, sparkline, data visualization, refresh, overview
