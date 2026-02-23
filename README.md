# Design with Claude - AI-Powered Design Tools & Agents

A code-first design toolkit that turns natural language briefs into production-ready implementations, guided by 29 specialized design agents.

```bash
design-create from-brief "Healthcare dashboard with accessibility"
```

The CLI dynamically selects the right design experts for your brief, extracts structured guidance from their knowledge, and uses it to generate tokens, components, and layouts that reflect real design expertise.

## How It Works

Every brief flows through a four-stage pipeline:

```
agents/*.md  →  AgentLoader  →  AgentSelector  →  AgentKnowledge  →  Generators
                 (parse 29)     (score & pick)    (extract guidance)   (use it)
```

### Stage 1: Parse the Brief

The brief parser extracts structured signals from natural language:

```
"Healthcare dashboard with accessibility"
  → style: clean
  → type: dashboard
  → industry: health
  → concerns: [accessible, accessibility]
```

### Stage 2: Select Agents

AgentSelector scores all 29 agents against your brief using keyword matching, category boosts, industry mapping, and concern detection. The top 5 are selected with roles:

| Brief | Selected Agents |
|-------|----------------|
| "Modern SaaS landing page" | design-system-architect, ui-designer, visual-designer, brand-strategist, marketing-designer |
| "Healthcare dashboard with accessibility" | accessibility-specialist, ui-designer, design-system-architect, dashboard-designer, healthcare-ux |
| "Dark mode crypto dashboard with animation" | dashboard-designer, ui-designer, design-system-architect, motion-designer, product-designer |

Different briefs get different experts. The selection is dynamic, not hardcoded.

### Stage 3: Extract Knowledge

AgentKnowledge transforms each selected agent's expertise into structured guidance:

```
accessibility-specialist  →  contrast: "AAA", ARIA requirements, touch targets >= 44px
motion-designer           →  animation durations, easing curves, transition specs
dashboard-designer        →  grid: 12-col, max-width: 1440px, gutterSize: 24px
design-system-architect   →  button variants, shadow depth, component token hierarchy
```

### Stage 4: Generate

Generators consume the guidance to produce informed output:
- **Token Generator** — colors, typography, spacing, shadows, border-radius, and motion tokens (when motion-designer is selected)
- **Component Generator** — buttons with agent-suggested variants, ARIA attributes from accessibility-specialist, transition timing from motion-designer
- **Layout Generator** — grid systems and breakpoints from layout guidance

### Two Modes

- **Local** (default) — agent knowledge drives generators deterministically. No API key needed.
- **API** (when `ANTHROPIC_API_KEY` is set) — the primary agent's full markdown becomes Claude's system prompt for richer plan generation. Falls back to local on failure.

## Quick Start

```bash
# Clone and install
git clone https://github.com/imsaif/design-with-claude.git
cd design-with-claude
npm install

# Initialize a project
node bin/design-create.js init my-project
cd my-project

# Generate from a brief
design-create from-brief "Modern SaaS landing page with pricing section"

# Or generate specific pieces
design-create tokens --mode light --primary "#6366F1"
design-create component button
design-create layout landing-page
design-create generate icons --set basic
```

### Optional: Enable API Mode

```bash
export ANTHROPIC_API_KEY=your-key-here
design-create from-brief "Modern SaaS landing page"
# → Uses Claude to generate a richer design plan
```

The `@anthropic-ai/sdk` is an optional dependency. The CLI works fully without it.

## Available Commands

| Command | Description |
|---------|-------------|
| `init [name]` | Initialize a new design project with full structure |
| `from-brief <brief>` | Generate complete design from natural language description |
| `tokens` | Generate design token system (colors, typography, spacing, shadows) |
| `component <name>` | Generate a production-ready component (button, input, modal, etc.) |
| `layout <type>` | Generate page layouts (landing-page, dashboard, documentation) |
| `generate icons` | Generate SVG icon sets with React components |
| `generate placeholders` | Generate placeholder images and avatars |

### What Gets Generated

```
my-project/
├── tokens/
│   ├── tokens.json          # Full token system as JSON
│   └── variables.css        # CSS custom properties
├── src/
│   └── components/
│       ├── Button.jsx       # With variants, sizes, loading, ARIA
│       ├── Button.css       # Agent-informed styles
│       ├── Card.jsx
│       ├── Hero.jsx
│       ├── Input.jsx        # Form components
│       ├── Modal.jsx        # Interactive components
│       ├── Header.jsx       # Navigation
│       └── ...
└── ...
```

**Token system includes:** full color scales (50-900) for primary/secondary/neutral/semantic, typography (10 sizes, 9 weights), spacing (18 values), shadows (8 levels), border-radius, and motion tokens when a motion-designer agent is selected.

**Components include:** Button (up to 5 variants x 3 sizes x 5 states), forms (Input, Select, Checkbox, Radio, Textarea), navigation (Header, Sidebar, Breadcrumb), interactive (Modal, Dropdown, Tooltip, Tabs), and basic templates (Card, Hero, FeatureSection).

## The 29 Design Agents

Agents live in `agents/` as markdown files with YAML frontmatter, structured sections, and cross-references. The CLI parses them at runtime — no manual registration needed.

### Core Design
| Agent | Expertise |
|-------|-----------|
| `ui-designer` | Visual hierarchy, layout composition, grid systems, dark mode |
| `ux-design-expert` | User experience optimization, usability, research methods |
| `design-system-architect` | Token architecture, component APIs, governance, versioning |
| `accessibility-specialist` | WCAG compliance, screen readers, keyboard navigation, ARIA |

### Visual Design
| Agent | Expertise |
|-------|-----------|
| `visual-designer` | Typography, color theory, composition, visual storytelling |
| `motion-designer` | Animation, transitions, micro-interactions, performance |
| `icon-designer` | Icon systems, consistency, scalability |
| `illustration-designer` | Custom illustrations, visual narratives |

### Product Design
| Agent | Expertise |
|-------|-----------|
| `product-designer` | End-to-end product design, user needs, business goals |
| `web-designer` | Responsive web design, layouts, performance |
| `mobile-designer` | iOS/Android design, touch interactions, platform guidelines |
| `dashboard-designer` | Data visualization, analytics interfaces, chart selection |

### Brand Identity
| Agent | Expertise |
|-------|-----------|
| `brand-strategist` | Brand positioning, architecture, personality, messaging |
| `logo-designer` | Logo design, visual identity marks |
| `brand-guidelines-creator` | Comprehensive brand documentation |
| `marketing-designer` | Campaign creative, conversion optimization |

### Interaction Design
| Agent | Expertise |
|-------|-----------|
| `interaction-designer` | Micro-interactions, user feedback systems |
| `prototyping-expert` | Rapid prototyping, fidelity levels |
| `gesture-designer` | Touch, gesture, spatial interactions |
| `voice-ui-designer` | Conversational interfaces, voice experiences |

### Research & Strategy
| Agent | Expertise |
|-------|-----------|
| `ux-researcher` | Qualitative and quantitative research methods |
| `information-architect` | Content organization, navigation, taxonomy |
| `design-strategist` | Design vision, business alignment |
| `service-designer` | Service blueprints, customer journeys |

### Specialized
| Agent | Expertise |
|-------|-----------|
| `game-ui-designer` | Game interfaces, HUD systems, menus |
| `healthcare-ux` | Medical interfaces, HIPAA compliance, clinical workflows |
| `ar-vr-designer` | Augmented/virtual reality experiences |
| `automotive-ux` | In-vehicle infotainment, digital clusters |
| `design-implementation-guide` | Practical implementation guidance |

## Using Agents Standalone

Agents work independently of the CLI too:

### With Claude CLI
```bash
claude --agent ui-designer "Help me design a landing page"
```

### With Claude Web Interface
Copy the content of any agent file and paste it at the start of your conversation.

### Combining Agents
```bash
@design-strategist and @product-designer Help me plan a new feature rollout
@visual-designer and @motion-designer Create an animated hero section
```

## Architecture

```
design-with-claude/
├── agents/                        # 29 agent markdown files
│   ├── core-design/              # ui-designer, ux-expert, design-system, accessibility
│   ├── visual-design/            # visual, motion, icon, illustration
│   ├── product-design/           # product, web, mobile, dashboard
│   ├── brand-identity/           # brand-strategist, logo, guidelines, marketing
│   ├── interaction-design/       # interaction, prototyping, gesture, voice
│   ├── research-strategy/        # researcher, IA, strategist, service
│   └── specialized/              # game, healthcare, AR/VR, automotive, implementation
│
├── src/
│   ├── agents/                   # Agent pipeline (new)
│   │   ├── agent-loader.js       # Parse markdown → structured data
│   │   ├── agent-selector.js     # Score & select relevant agents
│   │   └── agent-knowledge.js    # Extract guidance for generators
│   │
│   ├── ai-orchestrator/          # Orchestration
│   │   ├── orchestrator.js       # Pipeline coordinator + optional API mode
│   │   └── brief-parser.js       # NLP brief → structured data
│   │
│   ├── generators/               # Code generation
│   │   ├── token-generator.js    # Design tokens (CSS + JSON)
│   │   ├── component-generator.js # Component routing
│   │   └── components/           # Button, Form, Navigation, Interactive
│   │
│   └── cli/                      # CLI commands
│       ├── from-brief.js         # Brief → full generation
│       ├── init.js               # Project scaffolding
│       └── ...
│
├── __tests__/                    # Jest tests (49 tests, 7 suites)
└── bin/design-create.js          # CLI entry point
```

## Why This Exists

Tools like Figma AI and V0 generate visuals. This tool generates **engineering artifacts** — tokens, components, and systems that a senior engineer would approve.

| | Visual Tools (Figma/V0) | Design with Claude |
|---|---|---|
| **Output** | Screenshots or spaghetti code | Production-ready architecture |
| **Structure** | Single file, copy-paste | Full project scaffolding |
| **Logic** | Hardcoded values | Props, variants, semantic tokens |
| **Context** | "Here is the result" | "Here is why" (agent reasoning) |
| **Workflow** | Switch to design tool | Stay in your terminal |

## Development

```bash
npm test              # Run all 49 tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run lint          # ESLint
npm run format        # Prettier
```

## Contributing

1. Fork the repository
2. Create your agent in the appropriate category folder following the standard structure
3. The CLI picks it up automatically — no registration needed
4. Submit a pull request

## License

ISC
