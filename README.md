# Design with Claude

29 specialized design agents, available as Claude Code commands. Bring senior design expertise into every coding session.

No runtime. No dependencies. No API keys. Just markdown files that give Claude deep design knowledge.

## What This Is

A collection of 29 design agent files — each one a specialist in a specific design domain (accessibility, motion design, color theory, checkout flows, etc). Install them as Claude Code custom commands, and you get expert-level design guidance directly in your coding workflow.

Each agent contains structured domain knowledge: WCAG specifics, token architecture patterns, motion timing curves, healthcare UX compliance rules, checkout conversion best practices. This isn't generic "help me design" prompting — it's deep, opinionated expertise.

## Install

```bash
# Clone the repo
git clone https://github.com/imsaif/design-with-claude.git ~/.design-with-claude

# Add the commands to Claude Code
claude config add commandDirs ~/.design-with-claude/.claude/commands
```

That's it. Open Claude Code and type `/` to see all 30 commands — each one named after the design role it embodies.

## Quick Start

```
/design-brief Build a SaaS analytics dashboard with dark mode and accessibility focus
```

The `/design-brief` command analyzes your brief, identifies the relevant design domains (out of 29), and returns structured guidance — token recommendations, component specs, layout decisions, and implementation notes.

When invoked inside a code project, commands are context-aware: they detect your stack, read your existing files, and generate output that matches your conventions.

## Commands

### Master Command

| Command | What it does |
|---|---|
| `/design-brief` | Takes a natural language brief → identifies relevant agents → outputs comprehensive design guidance |

### Core Design

| Command | Use when... |
|---|---|
| `/visual-hierarchy-specialist` | Layout, hierarchy, spacing, focal points |
| `/interaction-designer` | User flows, states, gestures, feedback |
| `/design-system-architect` | Tokens, component APIs, theming |
| `/accessibility-specialist` | WCAG compliance, ARIA, keyboard nav |

### Visual Design

| Command | Use when... |
|---|---|
| `/typography-specialist` | Type scales, font pairing, vertical rhythm |
| `/color-specialist` | Color systems, palettes, semantic colors |
| `/spacing-layout-specialist` | Grid systems, spacing scales, density |

### Interaction Design

| Command | Use when... |
|---|---|
| `/motion-designer` | Transitions, timing curves, micro-interactions |
| `/form-designer` | Input layout, validation, multi-step forms |
| `/navigation-specialist` | Nav patterns, wayfinding, menus |

### Product Design

| Command | Use when... |
|---|---|
| `/dashboard-designer` | Data display, charts, KPI cards |
| `/mobile-specialist` | iOS/Android patterns, touch, thumb zones |
| `/responsive-design-specialist` | Breakpoints, fluid layouts, adaptive patterns |
| `/landing-page-specialist` | Hero sections, CTAs, conversion layout |

### Specialized

| Command | Use when... |
|---|---|
| `/dark-mode-specialist` | Dark theme tokens, surface hierarchy |
| `/error-handling-specialist` | Error states, empty states, recovery flows |
| `/onboarding-specialist` | First-run experience, progressive onboarding |
| `/performance-specialist` | Skeleton screens, loading states, perceived speed |
| `/data-visualization-specialist` | Chart types, axis design, data-ink ratio |
| `/table-designer` | Data tables, sorting, filtering, pagination |
| `/search-specialist` | Search UX, filters, faceted navigation |
| `/healthcare-ux-specialist` | Clinical workflows, HIPAA, medical UI |
| `/b2b-saas-specialist` | Enterprise patterns, multi-tenant, admin UIs |
| `/ecommerce-specialist` | Product pages, cart, checkout flows |
| `/checkout-specialist` | Cart UX, payment forms, trust signals |
| `/brand-designer` | Visual identity, brand systems |
| `/content-strategist` | Microcopy, tone of voice, content hierarchy |
| `/information-architect` | Navigation, taxonomy, content structure |
| `/conversational-ui-designer` | Chat interfaces, voice UI |

## Examples

```bash
# Get a full design brief for a new product
/design-brief Healthcare patient portal with HIPAA compliance and mobile support

# Deep-dive into a specific domain
/accessibility-specialist Audit this login form for WCAG AA compliance
/design-system-architect Create a token architecture for our React component library
/motion-designer Define transition specs for our modal and dropdown components
/dashboard-designer Design a KPI overview page for a logistics platform

# Combine agents for thorough coverage
/form-designer Multi-step onboarding form with file uploads
/color-specialist Define a semantic color system for light and dark themes
/checkout-specialist Guest checkout flow for a subscription product
```

## How It Works

Each command file is a markdown document containing a specialized design agent's complete knowledge. When you invoke a command, Claude loads that agent as context — giving it deep, structured expertise in that domain.

There's no code running, no API calls, no build step. The `.claude/commands/` directory IS the product. Claude's intelligence does the rest.

## Alternative Install: Project-Local Commands

If you prefer commands scoped to a single project:

```bash
cp -r ~/.design-with-claude/.claude/commands/ your-project/.claude/commands/
```

## Contributing

### Adding a new agent

1. Create `agents/your-agent-name.md` following the structure of existing agents
2. Convert to a command in `.claude/commands/` with YAML frontmatter, role statement using `$ARGUMENTS`, expertise sections, response format, and clarifying questions
3. Add to the command table in this README and to `design-brief.md`

## License

MIT
