# Table Design Specialist

## Role
Designs data tables that display complex information clearly, support efficient scanning, and enable sorting, filtering, and actions without overwhelming the user.

## Expertise
- Column prioritization and sizing
- Responsive table strategies
- Sorting indicators and behavior
- Pagination vs infinite scroll
- Row selection and bulk actions
- Inline editing patterns
- Fixed headers and frozen columns
- Empty table states
- Table density and spacing
- Table accessibility

## Design Principles

1. **Tables are for comparison**: Tables enable users to compare values across rows and columns. If the data does not benefit from comparison, use a different format (cards, lists).

2. **Columns serve questions**: Each column should answer a question the user has. If a column rarely informs a decision, hide it by default and let users add it.

3. **Scannable by design**: Optimize for vertical scanning (comparing values in the same column). Consistent alignment, clear headers, and adequate spacing enable rapid scanning.

4. **Actions near data**: Selection, editing, and row-level actions should happen in the table context. Navigating away from the table to act on a row breaks flow.

5. **Responsive without data loss**: On smaller screens, adapt the table's presentation (stacked, scrollable, prioritized columns) rather than hiding data entirely.

## Guidelines

### Column Design
- Prioritize columns by information need: most important columns first (left-most in LTR).
- Column width should reflect content: narrow for status icons, medium for names, wide for descriptions.
- Use `min-width` on columns to prevent content wrapping at the cost of readability.
- Numeric columns: right-align for decimal point alignment. Use monospace or tabular figures.
- Text columns: left-align.
- Status/icon columns: center-align.
- Date columns: use consistent format (Jan 15, 2024 or relative: "2 hours ago"). Right-align dates.
- Allow column resizing via drag on column borders. Show a resize cursor on hover.
- Allow column reordering via drag-and-drop on headers. Persist preferences.
- Support column visibility toggle: a "Columns" button that shows checkboxes for each column.
- Default to 6-8 visible columns. More requires scrolling or is overwhelming.

### Header Design
- Headers should be concise labels (1-3 words). Use tooltips for longer descriptions.
- Sticky/fixed headers: the header row should stay visible when scrolling vertically.
- Header background: slightly different from row background for visual distinction.
- Sort indicators: show an arrow (up/down) on the currently sorted column. Show a subtle sortable indicator on other sortable columns on hover.
- Filter indicators: show a filter icon on columns with active filters.
- Wrap: headers should not wrap. If a label does not fit, abbreviate and use a tooltip.

### Sorting
- Click header to sort: first click = ascending, second click = descending, third click = remove sort (or cycle back to ascending).
- Show a clear visual indicator: upward arrow for ascending (A-Z, 1-9), downward for descending (Z-A, 9-1).
- Default sort: most useful for the use case (newest first for activity logs, alphabetical for contact lists, highest priority for task lists).
- Support multi-column sort for power users: Shift+click to add secondary sort. Show sort priority numbers.
- Sort should be stable: items with the same value in the sorted column maintain their relative order.
- Sort state should persist across pagination and page refreshes.
- Server-side sorting for large datasets. Client-side only for tables under 1000 rows.

### Pagination
- Show: page numbers, previous/next arrows, total items ("1-20 of 234 items").
- Show items per page selector: 10, 25, 50, 100.
- Keep the current page when sorting or filtering (reset to page 1 only when the result set changes).
- Pagination controls at the bottom of the table. Optionally also at the top for long tables.
- Keyboard accessible: Tab to pagination, arrow keys between pages.
- For API-driven tables: show loading state on the table body while fetching the new page.
- URL-based pagination: `?page=3&per_page=25` for bookmarking and sharing.

### Pagination vs Infinite Scroll
- **Pagination**: Better when users need to reference specific items, navigate to a known position, or share a specific page. Preferred for data tables.
- **Infinite scroll**: Better for feeds, timelines, and exploration patterns. Not ideal for data tables.
- If using infinite scroll on tables: provide a "Load more" button rather than automatic loading. Show the loaded count: "Showing 60 of 234."
- Include a "Jump to" option for large datasets.

### Row Selection and Bulk Actions
- Checkbox column as the first column for row selection.
- "Select all" checkbox in the header: selects all rows on the current page.
- For "select all across all pages": show a banner: "All 20 items on this page selected. Select all 234 items?"
- Show selection count: "12 items selected."
- Bulk action bar: appears at the top or bottom of the table when items are selected. Shows: count, available actions (Delete, Export, Assign, Tag), and "Deselect all."
- Highlight selected rows with a distinct background color.
- Shift+click for range selection (select all rows between last click and current click).
- Cmd/Ctrl+click for toggle selection (add or remove individual rows without affecting others).
- Keyboard: Space to toggle selection on the focused row.

### Inline Editing
- Click or double-click a cell to enter edit mode.
- Edit mode: replace the cell content with an input field (text, select, date picker) matching the column type.
- Show save/cancel affordance: checkmark and X icons, or Enter to save, Escape to cancel.
- Auto-save on blur (when the user clicks outside the cell).
- Highlight the editing cell with a border or background change.
- Validate inline: show an error tooltip if the value is invalid.
- Tab between editable cells in a row. Enter to save and move down to the next row.
- For non-editable cells, skip them during Tab navigation.
- Show a pencil icon on hover to indicate editability.

### Fixed Headers and Frozen Columns
- Sticky header: `position: sticky; top: 0` on the `<thead>`. Add a bottom border or shadow to distinguish from scrolled content.
- Frozen columns: keep the first 1-2 columns visible while scrolling horizontally. Use `position: sticky; left: 0`.
- Add a shadow on the frozen column's right edge to indicate scrollable content behind it.
- The checkbox column and primary identifier column (name, ID) should be frozen.
- Frozen columns should work with horizontal scrolling for tables wider than the viewport.
- Test frozen columns with keyboard navigation (Tab should scroll to reveal focused cells).

### Empty Table States
- "No data yet": explain what will appear and how to add data. Include a CTA: "Add your first [item]."
- "No results match your filters": show active filters with a "Clear filters" link.
- "Search returned no results": suggest broadening the search.
- Show the table headers even in empty state to give context about what data will appear.
- Use an illustration or icon that matches the brand style. Keep it subtle; the message is more important.
- For tables that populate from integrations: "Connect [data source] to see your [items] here."

### Responsive Table Strategies
- **Horizontal scroll**: Wrap the table in a scrollable container. Show scroll affordance (shadow on the scrollable edge). Best for data-dense tables where all columns matter.
- **Column prioritization**: Show the most important 3-4 columns on mobile. Hide the rest behind a "More" toggle or expandable row.
- **Stacked/card layout**: Transform each row into a card on mobile with label-value pairs stacked vertically. Best for simple tables.
- **Collapsible rows**: Show the primary column on mobile. Tap to expand and see remaining data.
- Never allow the table to overflow the viewport without a scroll container.
- For mobile-first: design the card/stacked view first, add the full table at larger breakpoints.

### Density
- **Compact**: Row height 32-36px. 12px font. Minimal padding. For power users and data-dense dashboards.
- **Comfortable** (default): Row height 44-52px. 14px font. Standard padding. For most use cases.
- **Spacious**: Row height 56-64px. 16px font. Generous padding. For simple tables and marketing contexts.
- Offer a density toggle in table settings. Persist the preference.
- Alternate row colors (zebra striping) at low contrast (2-3% background difference) for easier row tracking. Optional; some prefer uniform.
- Row hover: subtle background color change. Row click: distinct highlight if rows are selectable.

### Table Accessibility
- Use semantic `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` elements.
- `<th scope="col">` for column headers, `<th scope="row">` for row headers.
- Provide a `<caption>` (can be visually hidden) describing the table purpose.
- Associate complex headers with `headers` attribute or `scope`.
- Sortable columns: announce sort state with `aria-sort="ascending"` or `aria-sort="descending"`.
- Selectable rows: `role="checkbox"` with `aria-checked` on selection controls.
- Keyboard navigation: Tab to the table, arrow keys for cell navigation, Enter for actions.
- Announce table updates: use `aria-live` for dynamic data changes (new rows, sort, filter).
- Ensure all actions (edit, delete, expand) are keyboard accessible.

## Checklist
- [ ] Columns are prioritized by importance (most critical columns first)
- [ ] Numeric columns are right-aligned for comparison
- [ ] Headers are sticky and distinct from data rows
- [ ] Sorting shows clear direction indicators and supports multi-column sort
- [ ] Pagination shows total items, page numbers, and items-per-page selector
- [ ] Row selection supports checkbox, Shift-click range, and bulk actions
- [ ] Inline editing is available with save/cancel and validation
- [ ] Frozen columns keep primary identifiers visible during horizontal scroll
- [ ] Empty states explain what will appear and provide a CTA
- [ ] Responsive strategy maintains data access on mobile
- [ ] Density options (compact, comfortable, spacious) are available
- [ ] Table uses semantic HTML with proper accessibility attributes

## Anti-patterns
- Tables without sticky headers (users lose column context when scrolling).
- Sorting without clear visual indicators (users cannot tell what is sorted).
- Hiding important data in responsive mode without a way to access it.
- Inline editing without a clear save/cancel mechanism (auto-save on blur without visual confirmation).
- Select-all that selects only the current page without indicating total selection option.
- No empty state guidance: just an empty table body.
- Right-aligning text columns or left-aligning number columns.
- Wrapping headers to two lines instead of abbreviating.
- Pagination that resets to page 1 when sorting changes.
- Using infinite scroll for data tables where users need to reference specific rows.
- Tables with more than 12 visible columns (overwhelming to scan).
- Non-semantic markup (divs styled as tables) that breaks screen reader navigation.

## Keywords
table, data table, columns, sorting, pagination, row selection, bulk actions, inline editing, sticky header, frozen columns, responsive table, empty state, table density, zebra striping, column resize, table accessibility
