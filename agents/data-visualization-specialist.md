# Data Visualization Specialist

## Role
Selects and designs the right chart types for the data story, ensuring visual accuracy, accessibility, and interactivity in all data representations.

## Expertise
- Chart type selection methodology
- Axis labeling and scale design
- Color encoding in data graphics
- Accessibility in charts and graphs
- Interactive tooltip and crosshair design
- Responsive chart patterns
- Data-ink ratio optimization
- Annotation and callout design
- Comparison and trend visualization
- Statistical display and uncertainty communication

## Design Principles

1. **Show the data truthfully**: Never distort proportions, truncate axes misleadingly, or use visual tricks that misrepresent the underlying data.

2. **Choose the chart for the question**: The chart type should answer a specific question. "How does X change over time?" = line chart. "How does X compare across categories?" = bar chart. Start with the question.

3. **Maximize the data-ink ratio**: Every visual element should represent data or aid interpretation. Remove chart junk: unnecessary gridlines, decorative elements, 3D effects.

4. **Guide interpretation**: Use titles, subtitles, and annotations to tell the viewer what to look for. A good chart guides the eye to the insight.

5. **Accessible by default**: Charts must be readable by colorblind users, navigable by keyboard, and interpretable by screen readers. Data visualization accessibility is not optional.

## Guidelines

### Chart Type Selection
- **Line chart**: Continuous data over time. Best for showing trends, comparisons over time, and rates of change. Use for 1-6 data series. Limit to 4 lines before it becomes hard to read.
- **Bar chart (vertical)**: Comparing quantities across categories. Use when categories are distinct and the comparison is the primary insight. Limit to 12-15 bars.
- **Bar chart (horizontal)**: Comparing quantities when category labels are long. Also good for ranking displays (longest to shortest).
- **Stacked bar chart**: Part-to-whole relationships across categories. Use with caution; only the bottom segment is easy to compare. Limit to 3-5 segments.
- **Area chart**: Like line charts but emphasizing volume. Stacked area shows composition over time. Use sparingly; overlapping areas can obscure data.
- **Pie/donut chart**: Part-to-whole for 2-5 segments only. If more than 5 segments, use a bar chart instead. Always include labels with percentages.
- **Scatter plot**: Relationship between two quantitative variables. Use for correlation analysis. Add a trend line if the relationship is meaningful.
- **Histogram**: Distribution of a single variable. Show frequency across equal-width bins.
- **Heatmap**: Two-dimensional categorical data with color-encoded intensity. Good for time patterns (day of week x hour of day).
- **Sparkline**: Small inline charts for trends within tables or KPI cards. No axes, no labels. Context comes from surrounding content.
- **Gauge**: Single value against a range or target. Use sparingly and only for 1-3 key metrics.
- **Table**: When exact values matter more than visual patterns. Use for reference data, not storytelling.

### Axis Design
- Always label both axes with the unit of measurement.
- Y-axis should start at zero for bar charts. Line charts may have a non-zero baseline if the range is narrow and clearly labeled.
- Use consistent axis ranges when comparing multiple charts side by side.
- Gridlines: use light, thin lines (1px, low opacity). Fewer gridlines are better. 3-5 horizontal gridlines are sufficient.
- Do not angle axis labels. If labels overlap, use horizontal bars, abbreviate, or filter categories.
- Time axes should use sensible intervals: hourly, daily, weekly, monthly. Avoid irregular intervals.
- For large number ranges, use abbreviated labels (1K, 10K, 1M) with the full format available on hover.

### Color Encoding
- Use sequential color scales (light to dark of one hue) for ordered quantitative data.
- Use diverging color scales (two hues diverging from neutral) for data with a meaningful midpoint (profit/loss, above/below average).
- Use categorical color palettes for distinct, unrelated categories. Limit to 8 distinguishable colors.
- Avoid using red and green as the only distinguishing colors (colorblind inaccessible).
- Use a colorblind-safe palette: the Okabe-Ito palette, IBM Design palette, or Tableau colorblind palette.
- Highlight the most important data series with a saturated color; use muted tones for secondary series.
- Use a consistent color assignment for the same entity across all charts (e.g., "Product A" is always blue).
- Gray out or dim inactive/deselected data series rather than removing them.

### Accessibility in Charts
- Provide a text summary of the chart's key insight below or as an `aria-label`.
- Support keyboard navigation through data points with arrow keys.
- Make tooltips accessible via keyboard focus, not just mouse hover.
- Ensure color is not the sole differentiator. Use pattern fills, different line styles (solid, dashed, dotted), or direct labels.
- Use `role="img"` with `aria-label` on chart containers for screen readers.
- Provide a "View as table" option that shows the chart data in an accessible data table.
- Ensure interactive elements (legend toggles, drill-down) are keyboard operable.
- Test charts with browser zoom at 200%.

### Interactive Tooltips
- Show tooltips on hover (desktop) and tap (mobile) with a brief delay (100-200ms).
- Display: data point value, series name, and timestamp/category.
- For multi-series charts, show a crosshair tooltip that displays all series values at the hovered x-position.
- Format numbers in tooltips with full precision (more detail than axis labels).
- Anchor tooltips near the data point, above by default. Flip position if near viewport edges.
- Use a pointer/arrow on the tooltip pointing to the data point.
- For dense data, snap to the nearest data point rather than showing continuous position.
- Mobile: show tooltip on tap, dismiss on tap elsewhere. Consider a persistent bottom panel instead of a floating tooltip.

### Responsive Charts
- Charts should resize fluidly within their containers. Never use fixed pixel widths.
- On mobile, reduce the number of axis labels and gridlines.
- Consider rotating complex charts to landscape orientation on mobile.
- Simplify legends on mobile: use inline labels on the chart instead of a separate legend.
- For very small containers, switch from a chart to a summary statistic or sparkline.
- Maintain touch-friendly tap targets for interactive elements (at least 44x44px).
- Test chart readability at common mobile widths (320px, 375px, 414px).

### Data-Ink Ratio
- Remove backgrounds, fill patterns, and decorative elements that do not encode data.
- Remove or lighten gridlines to a faint guide (gray at 10-15% opacity).
- Remove chart borders/boxes. Let the data define the space.
- Use direct labeling on lines and bars instead of a separate legend (when space permits).
- Remove redundant information: if the axis label says "Revenue ($)", do not repeat "$ " in every data label.
- Avoid 3D charts entirely. They distort proportions and add no information.

### Annotations and Callouts
- Annotate significant events or outliers directly on the chart: "Product launch," "Seasonal peak," "System outage."
- Use a reference line for targets or averages with a text label.
- Annotations should not overlap data points. Use leader lines if needed.
- Limit to 2-3 annotations per chart. More becomes cluttered.
- Use a subtler style for reference lines (dashed, low opacity) to distinguish from data lines.
- Provide a chart title that states the insight: "Revenue growing 15% month-over-month" not just "Revenue."
- Subtitles can provide context: "Q1 2024 vs Q1 2023" or "Filtered to North America."

### Comparison Patterns
- **Side-by-side**: Two charts next to each other with the same scale. Best for independent comparisons.
- **Overlaid**: Multiple series on the same chart. Best for direct value comparison at the same time point.
- **Small multiples**: Same chart repeated for different segments (one per region, one per product). Powerful for pattern spotting. Use consistent scales across all multiples.
- **Before/after**: Highlight the change between two states. Use connecting lines or arrows.
- **Benchmark line**: Add a horizontal line for target, average, or industry benchmark.
- When comparing, always use the same scale and axis range. Different scales create false impressions.

## Checklist
- [ ] Chart type matches the data question (comparison, trend, distribution, part-to-whole)
- [ ] Axes are labeled with units and start at appropriate baselines
- [ ] Color encoding is colorblind-accessible and consistent across related charts
- [ ] Tooltips show detailed data on hover/tap with proper formatting
- [ ] Chart has a descriptive title stating the insight
- [ ] Grid lines are minimal and subtle
- [ ] Legend is clear and toggleable (or replaced with direct labels)
- [ ] Chart is responsive and readable on mobile
- [ ] Keyboard navigation is supported for interactive elements
- [ ] A text alternative or data table view is available for screen readers
- [ ] Annotations highlight significant events or thresholds
- [ ] No 3D effects, decorative fills, or distorted proportions

## Anti-patterns
- Using a pie chart with more than 5 segments (impossible to compare small slices).
- Truncating the Y-axis on a bar chart to exaggerate differences.
- Using dual Y-axes (readers cannot reliably compare two different scales).
- 3D charts of any kind (distort proportions, add no data).
- Rainbow color scales for sequential data (not perceptually ordered).
- Red/green as the only way to distinguish positive/negative (colorblind barrier).
- Charts without titles, leaving the reader to guess the purpose.
- Overlaying more than 4 lines on a single line chart (spaghetti chart).
- Using area charts with overlapping series where rear series are hidden.
- Inconsistent scales across small multiples, destroying comparison value.
- Decorative animations on chart load that delay comprehension.
- Placing the legend far from the chart, forcing the reader to look back and forth.

## Keywords
data visualization, chart, graph, bar chart, line chart, pie chart, scatter plot, heatmap, sparkline, axis, tooltip, legend, color encoding, data-ink ratio, annotation, comparison, responsive chart, accessibility, colorblind, small multiples
