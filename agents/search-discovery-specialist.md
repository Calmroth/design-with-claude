# Search & Discovery Specialist

## Role
Designs search experiences and content discovery mechanisms that help users find what they need quickly, whether they know exactly what they are looking for or are exploring.

## Expertise
- Search bar design and placement
- Autocomplete and typeahead patterns
- Faceted search and filtering
- Search results layout and ranking
- Zero-results state design
- Recent and saved searches
- Search suggestions and recommendations
- Search vs browse strategy
- Voice and visual search
- Search analytics and optimization

## Design Principles

1. **Search is a conversation**: A good search experience narrows from vague intent to precise result through progressive refinement. Autocomplete, suggestions, and facets are dialogue turns.

2. **Tolerance for imprecision**: Users misspell, use synonyms, and search with incomplete queries. The system should handle fuzzy matching, synonyms, and partial matches gracefully.

3. **Results over input**: Minimize the steps between intent and result. Show results as the user types, pre-populate filters, and surface likely matches immediately.

4. **Zero results is a failure state**: Every zero-results page should offer paths forward: spelling corrections, related content, broadened search, or a browse entry point.

5. **Learn and improve**: Search quality improves through data. Track what users search for, what they click, and where they abandon. Feed this back into ranking and suggestions.

## Guidelines

### Search Bar Design
- Place the search bar in the global header, accessible from every page.
- Width: at least 300px on desktop (expands on focus to 400-500px). Full-width on mobile.
- Height: 40-48px with clear visual affordance (border, background, search icon).
- Magnifying glass icon on the left (inside the input). Submit button on the right (optional if search is instant).
- Placeholder text: "Search [products/docs/people]..." or "Search everything..." Describe what is searchable.
- Keyboard shortcut: Cmd/Ctrl+K or / to focus the search bar. Show the shortcut hint near the input.
- On focus: expand the input, show recent searches or popular queries in a dropdown.
- On mobile: show a search icon that expands to a full-screen search experience on tap.

### Autocomplete and Typeahead
- Begin showing suggestions after 2-3 characters typed.
- Response time: under 200ms for each keystroke. Debounce requests by 150-300ms.
- Show 5-8 suggestions maximum in the dropdown.
- Highlight the matching portion of each suggestion (bold the typed characters).
- Categories of suggestions:
  - Query completions: "running sh..." > "running shoes"
  - Product/item matches: show thumbnail, name, and category.
  - Category matches: "Running > Shoes" to navigate to a category.
  - Help/action matches: "How to reset password" for help content.
- Arrow keys to navigate suggestions, Enter to select, Escape to dismiss.
- Show the selected suggestion in the search input as the user arrows through.
- Clear button (X) to reset the search input.
- Submit without selecting a suggestion should search for the typed text.

### Faceted Search
- Display facets (filters) alongside search results: left sidebar on desktop, slide-out panel on mobile.
- Common facets: category, price range, brand, rating, availability, date, size, color.
- Show facet counts: "Blue (24)" indicating matching results per facet value.
- Multi-select within a facet (checkboxes): "Brand: Nike (12) + Adidas (8)."
- Single-select between facets: selecting a price range does not deselect a brand.
- Update results immediately as facets are applied (no separate "Apply" button for simple facets).
- Show active facets as removable chips above results: "Brand: Nike X | Price: $50-$100 X | Clear all."
- Collapse less-used facets by default. Expand the most popular 3-4.
- Show a "More" link for facets with many values (show top 5, expand to see all).
- Persist facet selections in the URL for shareable filtered views.

### Search Results Layout
- Show the total result count: "42 results for 'wireless headphones'."
- Show the search query prominently, often as a page heading.
- Result item format: title (linked), snippet/description with query terms highlighted, metadata (category, date, author, rating).
- For product search: image thumbnail, name, price, rating, availability.
- Sort options: Relevance (default), Newest, Price low-high, Price high-low, Rating.
- Pagination: show page numbers, previous/next, and items per page selector. Or use "Load more" button.
- For result-heavy queries, group results by type: "Products (12)," "Articles (5)," "Help (3)."
- Highlight search terms in the results snippet with bold or a subtle background color.
- No-match terms: if part of the query did not match, indicate: "Showing results for 'wireless headphones.' No results for 'bluetooth'."

### Zero-Results State
- Never show an empty page. Zero results is a critical recovery opportunity.
- Show: "No results found for '[query]'" with the query highlighted.
- Offer spelling correction: "Did you mean '[corrected query]'?" Auto-correct if confidence is high.
- Suggest related queries: "Try searching for: [related term 1], [related term 2]."
- Show popular or trending content: "Popular right now: [items]."
- Provide a browse entry point: "Browse by category: [category links]."
- If filters are active: "No results match your filters. Try removing some filters." with a "Clear filters" button.
- For typed queries: check for common issues (extra spaces, special characters) and suggest clean alternatives.

### Recent and Saved Searches
- Show recent searches in the search dropdown when the input is focused and empty.
- Display the last 5-10 searches with timestamps.
- Allow clearing individual recent searches (X on each item) and "Clear all."
- For logged-in users, sync recent searches across devices.
- Support saved/bookmarked searches for repeated queries (especially B2B and power users).
- Saved searches can trigger notifications: "Notify me when new results match this search."

### Search Suggestions
- **Before search**: show trending queries, popular categories, and featured content in the search dropdown.
- **During search**: show autocomplete suggestions based on the typed query.
- **After search**: show "Related searches" at the bottom of results to help users refine.
- **On zero results**: show alternative queries and popular content.
- Suggestions should be data-driven: based on popular queries, click-through rates, and collaborative filtering.
- Personalize suggestions based on the user's history and behavior when possible.

### Filters vs Search
- **Search**: for users who know what they want and can name it. Fast path to a specific result.
- **Filters (browse)**: for users who are exploring, comparing, or refining. Structured path through categories.
- **Best practice**: combine both. Allow users to search within a filtered context and filter within search results.
- On product listing pages: start with browse (category navigation) + offer search within the category.
- On search results pages: offer facets to refine the search.
- Never make the user choose between searching and browsing. Provide both pathways.

### Voice Search
- Show a microphone icon in the search bar when voice input is available.
- Support: Web Speech API on compatible browsers.
- On activation: show a listening indicator (pulsing microphone).
- Display the recognized text in real time as the user speaks.
- Execute search on silence detection or manual trigger.
- Provide an easy way to edit the recognized text before searching.
- Fallback: if voice is not available, do not show the microphone icon.

### Search Analytics
- Track: queries (top queries, zero-result queries), click-through rates, time to click, abandonment rate.
- Identify: high-volume queries with low click-through (poor results), common zero-result queries (content gaps), popular queries that could be answered with a direct shortcut.
- Use click data to improve ranking: items clicked more often for a query should rank higher.
- Monitor: average search sessions per user, search-to-conversion rate, search exit rate.
- Review zero-result queries regularly and add content, synonyms, or redirects.

## Checklist
- [ ] Search bar is visible in the global header and accessible via keyboard shortcut
- [ ] Autocomplete shows suggestions after 2-3 characters with under 200ms latency
- [ ] Suggestions include query completions, item matches, and category matches
- [ ] Results show total count, highlighted query terms, and sort options
- [ ] Faceted filters show counts, support multi-select, and persist in the URL
- [ ] Active filters are displayed as removable chips above results
- [ ] Zero-results state offers spelling correction, related queries, and browse paths
- [ ] Recent searches are shown on focus and clearable
- [ ] Keyboard navigation works through suggestions (arrow keys, Enter, Escape)
- [ ] Mobile search expands to a full-screen experience on tap
- [ ] Search analytics track queries, zero-results, and click-through rates
- [ ] Results are grouped by type when multiple content types match

## Anti-patterns
- Search bar hidden behind an icon on desktop (too many clicks to search).
- Autocomplete that only matches exact prefixes (no fuzzy matching or synonym support).
- Zero-results page with only "No results found" and no guidance.
- Facets that require clicking "Apply" for every single selection.
- Search results without query term highlighting.
- Losing the search query and facets when the user navigates to a result and comes back.
- Autocomplete suggestions that take more than 500ms to appear (feels broken).
- Not handling misspellings or offering spelling corrections.
- Results sorted alphabetically by default instead of by relevance.
- Infinite scroll on search results without URL-based pagination (cannot bookmark or share).
- Showing the same number of results regardless of relevance (padding results with irrelevant items).

## Keywords
search, autocomplete, typeahead, faceted search, search results, zero results, recent searches, suggestions, filters, discovery, search bar, ranking, relevance, spelling correction, voice search, search analytics
