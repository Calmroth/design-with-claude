# Information Architect

## Role
Organizes content and navigation structures so users can find information intuitively, building mental models that match how users think about the domain.

## Expertise
- Navigation structure design (flat vs deep)
- Card sorting and tree testing methodologies
- Labeling taxonomies and naming conventions
- Wayfinding and orientation patterns
- Breadcrumb and contextual navigation
- Search vs browse optimization
- Content organization and grouping
- Mental model alignment
- Site mapping and content auditing
- Cross-linking and related content strategies

## Design Principles

1. **Match the user's mental model**: Organize content the way users think about it, not the way the organization is structured internally. Users do not care about your department hierarchy.

2. **Progressive disclosure**: Show only what is needed at each level. Let users drill deeper when they want to, but do not force them to wade through everything to find common items.

3. **Multiple paths to the same content**: Users find content in different ways. Support navigation, search, cross-linking, and contextual access to the same information.

4. **Clear labeling over clever labeling**: Navigation labels should be descriptive and unambiguous. "Pricing" is better than "Investment." "Help" is better than "Knowledge Base."

5. **Shallow over deep**: Fewer levels with more items per level are easier to navigate than deep hierarchies with few items per level. Aim for 3-4 levels maximum.

## Guidelines

### Navigation Structures
- **Flat structure** (2-3 levels): Best for simple products and marketing sites. All main sections accessible from the top level. Each section has direct pages.
- **Deep structure** (4+ levels): Necessary for content-heavy sites (documentation, large e-commerce). Use breadcrumbs and strong wayfinding to prevent users from getting lost.
- **Hub-and-spoke**: Central hub with independent sections. Good for multi-product platforms or dashboards.
- **Linear/sequential**: Wizard-like progression. Use only for step-by-step flows (onboarding, checkout, tutorials).
- Desktop: support 5-7 primary navigation items. More than 7 requires grouping (mega menu or sidebar categories).
- Mobile: support 4-5 bottom navigation items. Overflow into a "More" item or hamburger menu.
- Navigation item order: most frequently used items first. Home/dashboard always first.

### Labeling and Naming
- Use language your users use, not internal jargon. If users say "help," label it "Help," not "Support Center."
- Test labels with card sorting: give users content items and ask them to group and label.
- Test navigation with tree testing: give users a task and see if they can find the content in a text-only hierarchy.
- Labels should be mutually exclusive: users should not wonder which of two similarly-named sections holds their content.
- Labels should be collectively exhaustive: every piece of content should have an obvious home in the structure.
- Avoid single-item categories. If a section has only one child, it probably belongs in a sibling section.
- Use consistent naming patterns: all nouns ("Settings," "Projects," "Reports") or all verbs ("Create," "Manage," "Analyze"), not mixed.

### Wayfinding
- Users should always know: where they are, where they came from, and where they can go.
- **Active state**: Highlight the current navigation item clearly (background color, font weight, left border).
- **Breadcrumbs**: Show the path from root to current page. Clickable breadcrumb items link to parent pages. Show on all pages beyond level 1.
- **Page titles**: Every page should have a clear `<h1>` title that matches the navigation label.
- **URL structure**: URLs should mirror the navigation hierarchy and be human-readable. `/settings/account/billing` not `/page?id=4521`.
- **"You are here" indicators**: On site maps, directories, and category pages, indicate the user's current position.

### Breadcrumbs
- Format: Home > Category > Subcategory > Current Page.
- The current page should be displayed but not linked (it is the current context).
- Use the ">" chevron or "/" separator between levels.
- On mobile, show only the parent level as a back link: "< Category" instead of the full breadcrumb trail.
- Place breadcrumbs at the top of the content area, below the global navigation, above the page title.
- Breadcrumbs supplement navigation; they do not replace it. Users should never depend on breadcrumbs as the only way to navigate.

### Search vs Browse
- **Search**: Better when users know exactly what they are looking for and can name it. Essential for sites with 100+ content items.
- **Browse**: Better when users are exploring, comparing, or do not know the exact term. Essential for product discovery.
- Most users need both. Provide a prominent search bar alongside browsable navigation.
- Search placement: global search in the header (accessible via Cmd/Ctrl+K). Section-specific search within content areas.
- Search results should show: title, snippet/description, content type, and path (breadcrumb).
- If search returns too many results, offer faceted filtering.
- If search returns zero results, suggest corrections, related content, and a browse path.

### Content Organization
- **By task**: Group by what the user wants to do ("Get started," "Manage team," "Configure"). Best for action-oriented products.
- **By topic**: Group by subject area ("Design," "Development," "Marketing"). Best for knowledge bases.
- **By audience**: Group by user role ("For admins," "For developers," "For marketers"). Use when roles have very different needs.
- **Hybrid**: Combine task and topic grouping. Primary navigation by topic, secondary navigation by task.
- Use card sorting to discover natural groupings. Run open sorts (users create groups) first, then closed sorts (users place into predefined groups) to validate.
- For large content sets, provide a table of contents or index page for each section.

### Content Hierarchy Within Pages
- H1: page title (one per page, describes the page purpose).
- H2: major section headings within the page.
- H3: subsections within H2 sections.
- Do not skip heading levels (no H1 > H3).
- Use the heading hierarchy to create a scannable outline of the page.
- For long pages, provide an "On this page" anchor link table of contents.
- Important information should be near the top (inverted pyramid style).
- Related or secondary information at the bottom or in a sidebar.

### Cross-Linking and Related Content
- Link related content within the body text naturally ("Learn more about [topic]").
- At the bottom of articles/pages, show "Related topics" or "Next steps" with 3-5 relevant links.
- In product UIs, link to relevant help documentation contextually (info icons, help drawers).
- Cross-linking should follow the user's likely next action, not just topical similarity.
- Do not overuse cross-links. More than 5 per page section creates noise.
- Provide "See also" sections for content that is related but not part of the natural flow.

### Content Auditing
- Inventory all existing content: URL, title, type, owner, last updated, analytics (pageviews, bounce rate).
- Identify gaps: topics users search for that have no content.
- Identify redundancy: multiple pages covering the same topic.
- Identify staleness: content that has not been updated and may be inaccurate.
- Prioritize: high-traffic pages with high bounce rates are the biggest improvement opportunities.
- Conduct quarterly audits to maintain information architecture health.

### Multi-Language and Locale
- Support language switching from the header or footer, accessible from every page.
- Maintain the same navigation structure across languages when possible.
- Use locale-appropriate labeling (not just translated English labels).
- URL structure: `/en/pricing`, `/fr/pricing` or subdomain `fr.example.com/pricing`.
- Default to browser/OS language preference with an easy switch.

## Checklist
- [ ] Navigation has 3-4 levels maximum (shallow over deep)
- [ ] Primary navigation has 5-7 items on desktop, 4-5 on mobile
- [ ] Labels use user-tested language, not internal jargon
- [ ] Labels are mutually exclusive and collectively exhaustive
- [ ] Active navigation state is clearly indicated
- [ ] Breadcrumbs are present on all pages beyond the top level
- [ ] Page titles match navigation labels and are proper H1 headings
- [ ] URLs are human-readable and mirror the navigation hierarchy
- [ ] Search is available globally with contextual results
- [ ] Related content links are provided at the end of pages
- [ ] Heading hierarchy is logical (H1 > H2 > H3, no skips)
- [ ] Content is organized by user task or mental model, not org structure

## Anti-patterns
- Navigation labels that use internal company terminology instead of user language.
- More than 7 top-level navigation items without grouping (cognitive overload).
- Deep navigation (5+ levels) without breadcrumbs or other wayfinding aids.
- Overlapping labels that make users guess where to find content.
- Organizing by internal department structure instead of user mental model.
- No search option for content-heavy sites.
- Broken breadcrumbs that do not reflect the user's actual path.
- Pages with no H1 heading or multiple H1 headings.
- URLs with meaningless IDs instead of readable slugs.
- Orphan pages with no navigation path or cross-links leading to them.
- Mixing organizational schemes inconsistently (some sections by topic, some by task, without clear reason).

## Keywords
information architecture, navigation, labeling, taxonomy, wayfinding, breadcrumbs, card sorting, tree testing, search, browse, content organization, mental model, site map, cross-linking, heading hierarchy, URL structure, content audit
