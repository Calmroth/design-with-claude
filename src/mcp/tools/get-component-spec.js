const { loadAgents } = require('../../agents/agent-loader');
const { selectAgents } = require('../../agents/agent-selector');
const { extractGuidance } = require('../../agents/agent-knowledge');

const TOOL_DEFINITION = {
  name: 'get_component_spec',
  description:
    'Get a completeness checklist for a component type. Returns required states, variants, accessibility requirements, and best practices for buttons, modals, forms, tables, navigation, and more.',
  inputSchema: {
    type: 'object',
    properties: {
      component_type: {
        type: 'string',
        description:
          "Component type (e.g. 'button', 'modal', 'form', 'table', 'navigation', 'card', 'dropdown', 'toast', 'tabs', 'accordion')",
      },
      context: {
        type: 'string',
        description:
          'Optional project context for domain-specific requirements',
      },
    },
    required: ['component_type'],
  },
};

/**
 * Built-in component spec registry.
 * Each spec defines states, variants, accessibility, motion, and responsive requirements.
 */
const COMPONENT_SPECS = {
  button: {
    displayName: 'Button',
    variants: [
      'Primary — main call to action',
      'Secondary — secondary actions',
      'Ghost/Text — low-emphasis actions',
      'Outline — medium-emphasis actions',
      'Destructive/Danger — irreversible actions (red)',
      'Icon-only — actions represented by an icon',
    ],
    sizes: ['Small (sm) — compact UI, tables', 'Medium (md) — default', 'Large (lg) — hero CTAs, mobile primary'],
    states: [
      'Default — resting state',
      'Hover — cursor over (desktop)',
      'Active/Pressed — mouse down or touch',
      'Focus — keyboard focus (:focus-visible)',
      'Disabled — non-interactive, aria-disabled="true"',
      'Loading — async action in progress, show spinner, disable clicks',
    ],
    accessibility: [
      'Use <button> element (not <div> or <a>)',
      'aria-label for icon-only buttons',
      'aria-disabled="true" instead of disabled attribute (keeps focusability)',
      'aria-busy="true" during loading state',
      'Minimum touch target: 48x48px (use padding if needed)',
      'Visible focus ring (:focus-visible)',
      'Type="button" to prevent accidental form submission',
    ],
    motion: [
      'Hover transition: 150ms ease-out (background-color, box-shadow)',
      'Active press: scale(0.98) with 100ms ease-in',
      'Loading spinner: continuous rotation, respect prefers-reduced-motion',
    ],
    responsive: [
      'Full-width on mobile for primary CTAs',
      'Icon-only on small screens for secondary actions',
      'Stack horizontally on desktop, vertically on mobile for button groups',
    ],
  },

  modal: {
    displayName: 'Modal / Dialog',
    variants: [
      'Alert dialog — requires acknowledgment, non-dismissable',
      'Confirmation — yes/no decision',
      'Form dialog — contains a form',
      'Full-screen (mobile) — takes over viewport on small screens',
    ],
    sizes: ['Small (400px) — confirmations', 'Medium (600px) — forms', 'Large (800px) — complex content'],
    states: [
      'Closed — not rendered or display:none',
      'Opening — enter animation',
      'Open — visible, focused',
      'Closing — exit animation',
    ],
    accessibility: [
      'role="dialog" and aria-modal="true"',
      'aria-labelledby pointing to modal title',
      'aria-describedby for modal description (optional)',
      'Focus trap — Tab cycles within modal only',
      'Focus first interactive element on open',
      'Return focus to trigger element on close',
      'Escape key closes the modal',
      'Backdrop click closes (unless alert dialog)',
      'Scroll lock on <body> while open',
      'Announce opening to screen readers',
    ],
    motion: [
      'Enter: fade in backdrop (200ms) + scale/slide content (250ms ease-out)',
      'Exit: reverse, slightly faster (200ms ease-in)',
      'Respect prefers-reduced-motion — use opacity only',
    ],
    responsive: [
      'Full-screen sheet on mobile (slide up from bottom)',
      'Centered on desktop with max-width',
      'Scrollable content area with sticky header/footer',
    ],
  },

  form: {
    displayName: 'Form',
    variants: [
      'Single-step — all fields visible',
      'Multi-step / Wizard — fields split across steps',
      'Inline editing — edit in place',
      'Search form — simplified, single input',
    ],
    sizes: [],
    states: [
      'Empty — initial state, no user input',
      'Filling — user is entering data',
      'Validating — checking input (inline)',
      'Error — validation failed, show errors',
      'Submitting — async submission in progress',
      'Success — submission completed',
      'Disabled — form not editable',
    ],
    accessibility: [
      'Every input has a visible <label> (not just placeholder)',
      'Labels use htmlFor/for matching input id',
      'Required fields marked with aria-required="true" + visual indicator',
      'Error messages linked with aria-describedby',
      'aria-invalid="true" on invalid fields',
      'Group related fields with <fieldset> and <legend>',
      'Form-level error summary at top on submit',
      'Autofill support (autocomplete attribute)',
      'Logical tab order',
    ],
    motion: [
      'Error shake: subtle horizontal shake (300ms) on validation failure',
      'Field highlight: border-color transition (150ms) on focus',
      'Success checkmark: scale-in animation (200ms)',
      'Multi-step: slide transition between steps (300ms ease-in-out)',
    ],
    responsive: [
      'Single column on mobile',
      'Two columns on desktop for related short fields (first/last name)',
      'Full-width inputs on mobile',
      'Sticky submit button on mobile for long forms',
    ],
  },

  table: {
    displayName: 'Table / Data Grid',
    variants: [
      'Simple table — display only',
      'Sortable table — column sorting',
      'Selectable table — row selection with checkboxes',
      'Editable table — inline cell editing',
    ],
    sizes: [],
    states: [
      'Loading — skeleton rows or spinner',
      'Empty — no data message + illustration',
      'Populated — normal data display',
      'Error — failed to load data',
      'Selecting — one or more rows selected (bulk actions bar)',
      'Sorting — column sort active, show direction indicator',
      'Filtering — active filters applied, show count',
    ],
    accessibility: [
      'Use semantic <table>, <thead>, <tbody>, <tr>, <th>, <td>',
      'scope="col" on column headers, scope="row" on row headers',
      'aria-sort on sortable columns (ascending/descending/none)',
      'aria-label or caption for table purpose',
      'Row selection: checkbox with aria-label',
      'Keyboard navigation: arrow keys between cells (for data grids)',
      'Screen reader announcement for sort changes',
    ],
    motion: [
      'Sort transition: smooth row reorder (300ms ease-in-out)',
      'Row hover: background-color transition (100ms)',
      'Loading: skeleton shimmer animation',
    ],
    responsive: [
      'Horizontal scroll with pinned first column on mobile',
      'Or: card layout on mobile (stacked key-value pairs)',
      'Hide lower-priority columns progressively',
      'Sticky header on scroll',
    ],
  },

  navigation: {
    displayName: 'Navigation',
    variants: [
      'Top bar — horizontal navigation',
      'Sidebar — vertical navigation, expandable',
      'Bottom tabs — mobile tab bar',
      'Breadcrumbs — hierarchical path',
      'Mega menu — large dropdown with sections',
    ],
    sizes: [],
    states: [
      'Default — all items in resting state',
      'Active/Current — currently selected page (aria-current="page")',
      'Hover — cursor over item (desktop)',
      'Focus — keyboard navigation',
      'Expanded — dropdown/submenu open',
      'Collapsed — mobile hamburger menu closed',
      'Open — mobile menu open',
    ],
    accessibility: [
      '<nav> element with aria-label (e.g., "Main navigation")',
      'aria-current="page" on active item',
      'Skip navigation link as first focusable element',
      'Keyboard: arrow keys between items, Enter to select, Escape to close dropdowns',
      'aria-expanded on toggle buttons (hamburger, dropdown triggers)',
      'aria-haspopup="true" on dropdown triggers',
      'Visible focus indicators on all items',
      'Mobile: focus trap within open menu',
    ],
    motion: [
      'Dropdown: slide down + fade in (200ms ease-out)',
      'Mobile menu: slide in from side (300ms ease-in-out)',
      'Active indicator: slide/morph transition (200ms)',
      'Hamburger icon: animate between states (200ms)',
    ],
    responsive: [
      'Top bar → hamburger menu on mobile',
      'Bottom tabs: max 5 items, icons + labels',
      'Sidebar: collapsible to icons-only on tablet',
      'Hide breadcrumbs on mobile or truncate with ellipsis',
    ],
  },

  card: {
    displayName: 'Card',
    variants: [
      'Content card — article/blog preview',
      'Product card — e-commerce product',
      'Action card — clickable, navigates to detail',
      'Stats card — KPI/metric display',
      'Profile card — user/team member',
    ],
    sizes: ['Small — compact grid', 'Medium — standard list', 'Large — featured/hero'],
    states: [
      'Default — resting state',
      'Hover — subtle elevation or border change (if clickable)',
      'Active — pressed state (if clickable)',
      'Focus — keyboard focus (if clickable)',
      'Loading — skeleton state',
      'Selected — visual selection indicator (if selectable)',
    ],
    accessibility: [
      'Clickable cards: use <a> or <button> as the wrapper, or use a stretched link pattern',
      'Heading for card title (appropriate level)',
      'Alt text on card images',
      'If the entire card is clickable, avoid nested interactive elements',
      'Card actions (buttons, links) need sufficient click area',
    ],
    motion: [
      'Hover: translateY(-2px) + subtle shadow increase (150ms ease-out)',
      'Loading: skeleton shimmer (1.5s ease-in-out infinite)',
    ],
    responsive: [
      'Grid: 1 column on mobile, 2-3 on tablet, 3-4 on desktop',
      'Horizontal layout on mobile for list views',
      'Image aspect ratio maintained across sizes',
    ],
  },

  dropdown: {
    displayName: 'Dropdown / Select',
    variants: [
      'Single select — choose one option',
      'Multi-select — choose multiple options',
      'Searchable/Combobox — type to filter options',
      'Grouped — options organized in groups',
    ],
    sizes: ['Small', 'Medium (default)', 'Large'],
    states: [
      'Closed — shows selected value or placeholder',
      'Open — dropdown list visible',
      'Focused — keyboard focus on trigger',
      'Hovering option — option under cursor highlighted',
      'Selected — chosen option(s) displayed',
      'Disabled — non-interactive',
      'Loading — fetching options',
      'Empty — no options match (for searchable)',
      'Error — validation failed',
    ],
    accessibility: [
      'Use <select> for simple cases, or combobox pattern for custom',
      'role="listbox" on the options container',
      'role="option" on each option with aria-selected',
      'aria-expanded on trigger',
      'aria-activedescendant for keyboard-highlighted option',
      'Arrow keys to navigate options, Enter to select, Escape to close',
      'Type-ahead: typing a letter jumps to matching option',
      'Label association (same as form inputs)',
    ],
    motion: [
      'Open: scale from top + fade in (150ms ease-out)',
      'Close: fade out (100ms ease-in)',
      'Option highlight: instant (no transition needed)',
    ],
    responsive: [
      'Native <select> on mobile for better UX (optional)',
      'Full-width on mobile, fixed-width on desktop',
      'Max height with scroll for long option lists',
    ],
  },

  toast: {
    displayName: 'Toast / Notification',
    variants: [
      'Info — neutral information',
      'Success — positive confirmation (green)',
      'Warning — caution (amber/yellow)',
      'Error — something went wrong (red)',
    ],
    sizes: [],
    states: [
      'Entering — slide/fade in animation',
      'Visible — displayed with auto-dismiss timer',
      'Paused — timer paused on hover/focus',
      'Dismissing — exit animation',
      'Dismissed — removed from DOM',
    ],
    accessibility: [
      'role="status" for non-critical (info, success)',
      'role="alert" for critical (error, warning)',
      'aria-live="polite" for info/success, "assertive" for errors',
      'Dismiss button with aria-label="Dismiss notification"',
      'Don\'t auto-dismiss error toasts (user needs time to read)',
      'Action buttons in toasts must be keyboard accessible',
      'Don\'t rely solely on color to convey type (use icons)',
    ],
    motion: [
      'Enter: slide in from edge + fade (300ms ease-out)',
      'Exit: fade out + slide (200ms ease-in)',
      'Stack: push previous toasts up/down (200ms ease-in-out)',
      'Respect prefers-reduced-motion',
    ],
    responsive: [
      'Bottom-center on mobile (full width)',
      'Top-right on desktop',
      'Max-width: 400px on desktop',
      'Stack limit: max 3 visible at once',
    ],
  },

  tabs: {
    displayName: 'Tabs',
    variants: [
      'Horizontal tabs — standard tab bar',
      'Vertical tabs — sidebar-style tabs',
      'Pill tabs — rounded, segmented control style',
      'Scrollable tabs — many tabs, horizontally scrollable',
    ],
    sizes: [],
    states: [
      'Active/Selected — currently visible panel',
      'Hover — cursor over inactive tab',
      'Focus — keyboard focus on tab',
      'Disabled — non-selectable tab',
    ],
    accessibility: [
      'role="tablist" on container',
      'role="tab" on each tab trigger',
      'role="tabpanel" on each content panel',
      'aria-selected="true" on active tab',
      'aria-controls linking tab to its panel',
      'id on panel, referenced by tab\'s aria-controls',
      'Arrow keys to switch between tabs (Left/Right for horizontal, Up/Down for vertical)',
      'Tab key moves focus into the panel, not to the next tab',
      'Home/End keys to go to first/last tab',
    ],
    motion: [
      'Active indicator: slide between tabs (200ms ease-in-out)',
      'Panel transition: crossfade (150ms) or slide',
    ],
    responsive: [
      'Horizontal scroll on mobile (scrollable tabs)',
      'Or: convert to accordion on mobile',
      'Or: dropdown selector on mobile for many tabs',
    ],
  },

  accordion: {
    displayName: 'Accordion',
    variants: [
      'Single — only one panel open at a time',
      'Multiple — any number of panels can be open',
      'Nested — accordions within accordions',
    ],
    sizes: [],
    states: [
      'Collapsed — all panels closed (default)',
      'Expanded — one or more panels open',
      'Hover — cursor over trigger',
      'Focus — keyboard focus on trigger',
      'Disabled — non-expandable panel',
    ],
    accessibility: [
      'Trigger: <button> element (or role="button")',
      'aria-expanded="true/false" on trigger button',
      'aria-controls pointing to panel id',
      'Enter/Space to toggle panel',
      'Content panel: role="region" with aria-labelledby pointing to trigger',
      'Don\'t hide content from screen readers when collapsed (use proper expand/collapse)',
    ],
    motion: [
      'Expand: height auto transition (250ms ease-out) — use max-height or grid technique',
      'Chevron/icon rotation: 180deg rotation (200ms ease-in-out)',
      'Respect prefers-reduced-motion',
    ],
    responsive: [
      'Full-width on all breakpoints',
      'Useful as mobile replacement for tabs',
      'Increase padding on touch for larger tap targets',
    ],
  },

  input: {
    displayName: 'Text Input',
    variants: [
      'Text — single-line text',
      'Password — masked input with toggle',
      'Search — with search icon and clear button',
      'Textarea — multi-line text',
      'Number — numeric input with optional stepper',
    ],
    sizes: ['Small', 'Medium (default)', 'Large'],
    states: [
      'Empty — no value, shows placeholder',
      'Filled — has value',
      'Focused — active input',
      'Disabled — non-editable, reduced opacity',
      'Read-only — non-editable but normal appearance',
      'Error — validation failed, red border',
      'Success — validation passed (optional, green)',
    ],
    accessibility: [
      'Visible <label> element (not just placeholder)',
      'aria-required="true" for required fields',
      'aria-invalid="true" when validation fails',
      'aria-describedby for help text and error messages',
      'autocomplete attribute for common fields (name, email, etc.)',
      'inputmode for mobile keyboards (numeric, email, tel, url)',
      'Minimum touch height: 44px',
    ],
    motion: [
      'Focus: border-color transition (150ms ease)',
      'Error: subtle shake (300ms) or border flash',
      'Character count: fade in when approaching limit',
    ],
    responsive: [
      'Full-width on mobile',
      'Font size >= 16px to prevent iOS zoom',
      'Adequate spacing between stacked inputs',
    ],
  },

  tooltip: {
    displayName: 'Tooltip',
    variants: [
      'Simple — text only',
      'Rich — with formatting, links, or images',
      'Interactive — user can hover/click inside tooltip',
    ],
    sizes: [],
    states: [
      'Hidden — not visible',
      'Showing — enter animation/delay',
      'Visible — fully shown',
      'Hiding — exit animation',
    ],
    accessibility: [
      'Use aria-describedby linking trigger to tooltip content',
      'Or: role="tooltip" on the tooltip element',
      'Show on focus (not just hover) for keyboard users',
      'Escape key dismisses tooltip',
      'Don\'t put essential information only in tooltips',
      'Sufficient delay before showing (500ms) to avoid accidental triggers',
      'Interactive tooltips: don\'t dismiss when moving mouse to tooltip',
    ],
    motion: [
      'Enter: fade in + slight translate (150ms ease-out) after 500ms delay',
      'Exit: fade out (100ms ease-in)',
      'No motion for prefers-reduced-motion (instant show/hide)',
    ],
    responsive: [
      'Reposition to avoid viewport edges',
      'Consider replacing with inline text on mobile (no hover)',
      'Or: show on long-press on touch devices',
    ],
  },
};

async function handler({ component_type, context }) {
  const type = component_type.toLowerCase().replace(/\s+/g, '');
  const spec = findSpec(type);

  let guidance = null;
  if (context) {
    const agents = loadAgents();
    const selectorContext = {
      description: context,
      concerns: [],
      componentType: component_type,
    };
    const selected = selectAgents(selectorContext, agents);
    guidance = extractGuidance(selected, selectorContext);
  }

  const output = formatSpecOutput(component_type, spec, guidance);
  return { content: [{ type: 'text', text: output }] };
}

function findSpec(type) {
  // Direct match
  if (COMPONENT_SPECS[type]) return COMPONENT_SPECS[type];

  // Alias matching
  const aliases = {
    dialog: 'modal',
    select: 'dropdown',
    combobox: 'dropdown',
    menu: 'dropdown',
    notification: 'toast',
    snackbar: 'toast',
    alert: 'toast',
    textfield: 'input',
    textarea: 'input',
    'text-input': 'input',
    checkbox: 'input',
    radio: 'input',
    toggle: 'input',
    switch: 'input',
    breadcrumb: 'navigation',
    navbar: 'navigation',
    sidebar: 'navigation',
    tabbar: 'tabs',
    'tab-bar': 'tabs',
    collapse: 'accordion',
    expandable: 'accordion',
    popover: 'tooltip',
    'data-grid': 'table',
    datagrid: 'table',
    list: 'table',
  };

  if (aliases[type]) return COMPONENT_SPECS[aliases[type]];

  return null;
}

function formatSpecOutput(componentType, spec, guidance) {
  const lines = [];

  if (!spec) {
    lines.push(`## Component Spec: ${componentType}`);
    lines.push('');
    lines.push(`No built-in spec found for "${componentType}". Available types:`);
    lines.push('');
    for (const [key, value] of Object.entries(COMPONENT_SPECS)) {
      lines.push(`- **${key}** — ${value.displayName}`);
    }
    lines.push('');
    lines.push('Try one of these, or provide a more specific component type.');

    if (guidance) {
      lines.push('');
      lines.push('### General Recommendations');
      for (const rec of guidance.recommendations.slice(0, 5)) {
        lines.push(`- ${rec.text} *(${rec.source})*`);
      }
    }

    return lines.join('\n');
  }

  lines.push(`## Component Spec: ${spec.displayName}`);
  lines.push('');

  // Variants
  if (spec.variants.length > 0) {
    lines.push('### Variants');
    for (const v of spec.variants) {
      lines.push(`- ${v}`);
    }
    lines.push('');
  }

  // Sizes
  if (spec.sizes && spec.sizes.length > 0) {
    lines.push('### Sizes');
    for (const s of spec.sizes) {
      lines.push(`- ${s}`);
    }
    lines.push('');
  }

  // States
  if (spec.states.length > 0) {
    lines.push('### States');
    for (const s of spec.states) {
      lines.push(`- [ ] ${s}`);
    }
    lines.push('');
  }

  // Accessibility
  if (spec.accessibility.length > 0) {
    lines.push('### Accessibility');
    for (const a of spec.accessibility) {
      lines.push(`- [ ] ${a}`);
    }
    lines.push('');
  }

  // Motion
  if (spec.motion.length > 0) {
    lines.push('### Motion');
    for (const m of spec.motion) {
      lines.push(`- ${m}`);
    }
    lines.push('');
  }

  // Responsive
  if (spec.responsive.length > 0) {
    lines.push('### Responsive');
    for (const r of spec.responsive) {
      lines.push(`- ${r}`);
    }
    lines.push('');
  }

  // Domain-specific additions from agents
  if (guidance && guidance.recommendations.length > 0) {
    lines.push('### Domain-Specific Recommendations');
    lines.push('');
    for (const rec of guidance.recommendations.slice(0, 5)) {
      lines.push(`- ${rec.text} *(${rec.source})*`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

module.exports = { TOOL_DEFINITION, handler };
