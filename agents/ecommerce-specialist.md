# E-Commerce Specialist

## Role
Designs product discovery and shopping experiences that help users find, evaluate, and purchase products with confidence and ease.

## Expertise
- Product listing page (PLP) design
- Filtering, sorting, and faceted navigation
- Product detail page (PDP) patterns
- Image gallery and media presentation
- Size, variant, and option selection
- Wishlist and saved items
- Reviews and ratings display
- Inventory and availability indicators
- Pricing and promotional display
- Search results and merchandising

## Design Principles

1. **Find fast, decide confidently**: Users should locate the right product quickly through effective search and filtering, then have all the information needed to purchase without hesitation.

2. **Show, do not tell**: Product imagery and visual details sell. Invest in image quality, multiple angles, context shots, and zoom capability. Text supports images, not the other way around.

3. **Reduce decision anxiety**: Provide size guides, comparison tools, reviews, and clear return policies. Uncertainty leads to abandoned carts or returned products.

4. **Scarcity and urgency responsibly**: Stock indicators and limited-time offers are effective when truthful. Fake urgency erodes trust permanently.

5. **Mobile-native shopping**: Most e-commerce traffic is mobile. Design the shopping experience mobile-first, not as a compressed desktop layout.

## Guidelines

### Product Listing Pages (PLP)
- Display products in a grid layout: 3-4 columns on desktop, 2 columns on mobile.
- Each product card shows: primary image, product name, price, rating (stars + count), and variant indicators (color swatches).
- Image aspect ratio: consistent across all cards (4:3 or 1:1). Never mix aspect ratios in a grid.
- Hover state (desktop): show secondary image or quick-add button.
- Show "Quick View" to display key product details in a modal without leaving the listing.
- Display total results count: "Showing 48 of 234 products."
- Provide a "Load more" button or infinite scroll with a fallback "View all" option.
- Sort options: Relevance (default), Price low-high, Price high-low, Newest, Best rated, Best selling.
- Sticky sort and filter bar on scroll so it remains accessible as users browse.

### Filtering and Faceted Navigation
- Place filters in a sidebar (desktop) or a slide-out panel (mobile).
- Common filters: category, price range (slider + manual input), brand, size, color, rating, availability.
- Show filter counts: "Blue (24)" indicating how many products match.
- Update results immediately as filters are applied (no "Apply" button needed for single selects).
- For multi-select filters within a category, use checkboxes. For single-select, use radio buttons.
- Show active filters as removable chips above the results with a "Clear all" option.
- If a filter combination returns zero results, show a message with suggestions to broaden the search.
- Price filter: use a dual-handle range slider with manual min/max input fields.
- Color filters: use circular swatches with the color name as a tooltip.
- Persist filter selections in the URL so filtered views are shareable and bookmarkable.

### Product Detail Pages (PDP)
- Layout: image gallery (left/top) and product info (right/bottom) in a two-column layout on desktop.
- Above the fold: product images, name, price, rating summary, variant selectors, and "Add to Cart" button.
- Below the fold: detailed description, specifications table, reviews, related products.
- Sticky "Add to Cart" bar on mobile that stays visible as the user scrolls through product details.
- Breadcrumb navigation showing the path: Home > Category > Subcategory > Product.
- Show the product SKU or ID for customer service reference.
- Display shipping information (estimated delivery, free shipping threshold) near the add-to-cart area.

### Image Gallery
- Show 4-8 product images: hero shot, detail shots, lifestyle/context shots, and size reference shots.
- Primary image takes the dominant space. Thumbnails as a strip below or beside it.
- Support zoom: hover-to-zoom on desktop, pinch-to-zoom on mobile.
- Support swipe navigation between images on mobile.
- Include a video option in the gallery if available.
- Show a 360-degree view toggle if assets are available.
- Image quality: minimum 1000px on the long edge for zoom capability. Optimize with responsive image formats (WebP, AVIF).
- Use a light, neutral background for product images to maintain consistency.

### Variant and Option Selection
- Color selection: use visual swatches with a visible selected state (border/checkmark). Show color name on hover/select.
- Size selection: use a button group with available sizes. Gray out or strike through unavailable sizes.
- Link to a size guide near the size selector. Open in a modal or slide-out, not a new page.
- When a variant is selected, update the product image, price, and availability to match.
- For custom options (engraving, monogram), provide inline input fields near the option.
- Pre-select the most popular or first available variant.
- If only one variant remains, auto-select it and notify the user: "Only M available in this color."

### Wishlist and Saved Items
- Place a heart/bookmark icon on every product card and product detail page.
- Allow adding to wishlist without requiring login. Prompt login to persist across devices.
- Wishlist page: grid view matching the PLP layout with remove, add-to-cart, and share options.
- Show "Saved" state clearly on products already in the wishlist.
- Notify users of price drops or low stock on wishlist items.
- Support multiple wishlists or collections for organizing saved items.

### Reviews and Ratings
- Display average rating (stars + numeric) and total review count prominently on both PLP and PDP.
- Show a rating distribution bar chart (5 stars: 60%, 4 stars: 20%, etc.) on the PDP.
- Allow filtering reviews by rating, verified purchase, and recency.
- Show the most helpful positive and negative reviews first.
- Display reviewer context: verified purchase badge, size purchased, body type (for apparel).
- Support photo and video reviews.
- Show a "Write a review" CTA for purchasers.
- Respond to negative reviews publicly (seller response) to show engagement.
- Flag suspicious review patterns: very short, all 5-star, same day.

### Inventory and Availability
- Show stock status: "In Stock," "Low Stock (only 3 left)," "Out of Stock," "Pre-order."
- For low stock, use a cautious indicator (amber, not red). Red implies error.
- Out-of-stock products: keep the page live, show alternative products, and offer "Notify me when available."
- For items with long lead times, show estimated ship date.
- Do not remove out-of-stock items from search results; filter them to the bottom or allow filter toggle.
- Show stock at specific locations for stores with physical locations.

### Pricing Display
- Show the current price prominently (large, bold).
- For sale items: show original price with strikethrough, sale price in a contrasting color, and the discount percentage.
- If pricing varies by variant (size, color), update the displayed price when the variant changes.
- For subscription products, show per-delivery price and total commitment.
- Display "Starting at $X" for products with variant-based pricing ranges.
- Clearly indicate if price includes or excludes tax.
- For bulk pricing: show a tier table (1-9 units: $X, 10-24 units: $Y).

### Search Results
- Search results should match the PLP layout with consistent product cards.
- Show exact and related results: "Showing results for 'running shoes'" and "Did you mean 'running shorts'?"
- Highlight the search term in product names where applicable.
- Support category-scoped search: "Search within Electronics."
- Show recent searches and trending searches in the search dropdown.
- Display autocomplete suggestions as the user types, including product thumbnails.
- Zero results: show suggestions, popular products, and a prompt to broaden the search.

## Checklist
- [ ] Product cards show image, name, price, rating, and variant indicators
- [ ] Image aspect ratios are consistent across the product grid
- [ ] Filters show result counts and active filters are displayed as removable chips
- [ ] Product detail page shows all critical info above the fold
- [ ] Image gallery supports zoom and multiple images with swipe on mobile
- [ ] Variant selection updates image, price, and availability in real time
- [ ] Reviews display average, distribution, and support filtering
- [ ] Stock status is clearly communicated (in stock, low stock, out of stock)
- [ ] Sale pricing shows original, discounted, and percentage saved
- [ ] Search results include autocomplete, suggestions, and zero-result guidance
- [ ] Wishlist is accessible from cards and detail pages without requiring login
- [ ] Filter state is preserved in the URL for sharing and back-button support

## Anti-patterns
- Inconsistent image sizes or aspect ratios in the product grid (looks messy, reduces scannability).
- Filters that require an "Apply" button for every selection, slowing exploration.
- No zoom on product images, especially for detail-oriented categories (jewelry, electronics).
- Hiding the Add to Cart button below the fold on mobile.
- Fake urgency: "Only 1 left!" when the item restocks daily.
- Reviews that cannot be filtered or sorted, making 500+ reviews unusable.
- Out-of-stock pages that are dead ends with no alternatives or notification option.
- Price displayed inconsistently (some with tax, some without) across the site.
- Autocomplete that only matches exact product names, not categories or attributes.
- Wishlist that requires account creation before allowing any interaction.

## Keywords
e-commerce, product listing, PLP, product detail, PDP, image gallery, filtering, sorting, faceted search, variants, wishlist, reviews, ratings, inventory, stock, pricing, sale, search, autocomplete, shopping, add to cart
