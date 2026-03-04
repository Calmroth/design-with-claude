const { loadAgents } = require('../../agents/agent-loader');
const { selectAgents } = require('../../agents/agent-selector');
const { extractGuidance } = require('../../agents/agent-knowledge');
const { parseBrief } = require('../../ai-orchestrator/brief-parser');

const TOOL_DEFINITION = {
  name: 'suggest_tokens',
  description:
    'Recommend a design token system for a project. Returns a complete token structure with colors, typography, spacing, shadows, border-radius, and motion tokens as ready-to-use CSS custom properties.',
  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        description:
          "Project description (e.g. 'modern SaaS analytics platform', 'healthcare patient portal')",
      },
      preferences: {
        type: 'object',
        description: 'Optional style preferences',
        properties: {
          style: { type: 'string', description: "e.g. 'modern', 'minimal', 'playful', 'corporate'" },
          primaryColor: { type: 'string', description: "e.g. '#3B82F6', 'blue'" },
          darkMode: { type: 'boolean', description: 'Whether to include dark mode tokens' },
        },
      },
    },
    required: ['description'],
  },
};

/** Predefined color palettes by style/industry */
const COLOR_PALETTES = {
  modern: {
    primary: { light: '#3B82F6', dark: '#60A5FA' },
    secondary: { light: '#8B5CF6', dark: '#A78BFA' },
    neutral: generateNeutralScale('#64748B'),
    rationale: 'Blue primary conveys trust and professionalism. Purple secondary adds modern energy.',
  },
  minimal: {
    primary: { light: '#18181B', dark: '#FAFAFA' },
    secondary: { light: '#71717A', dark: '#A1A1AA' },
    neutral: generateNeutralScale('#71717A'),
    rationale: 'Near-black primary for maximum contrast and minimal aesthetic. Zinc neutrals for sophistication.',
  },
  playful: {
    primary: { light: '#F97316', dark: '#FB923C' },
    secondary: { light: '#06B6D4', dark: '#22D3EE' },
    neutral: generateNeutralScale('#78716C'),
    rationale: 'Warm orange primary for energy and enthusiasm. Cyan secondary for contrast and playfulness.',
  },
  corporate: {
    primary: { light: '#1E40AF', dark: '#3B82F6' },
    secondary: { light: '#0F766E', dark: '#14B8A6' },
    neutral: generateNeutralScale('#6B7280'),
    rationale: 'Deep blue primary for authority and trust. Teal secondary for innovation within stability.',
  },
  healthcare: {
    primary: { light: '#0891B2', dark: '#22D3EE' },
    secondary: { light: '#059669', dark: '#34D399' },
    neutral: generateNeutralScale('#6B7280'),
    rationale: 'Calming cyan primary for clinical trust. Green secondary for health and wellbeing associations.',
  },
  finance: {
    primary: { light: '#1E3A5F', dark: '#3B82F6' },
    secondary: { light: '#047857', dark: '#10B981' },
    neutral: generateNeutralScale('#64748B'),
    rationale: 'Deep navy primary for stability and trust. Green secondary for growth and financial success.',
  },
  luxury: {
    primary: { light: '#1C1917', dark: '#F5F5F4' },
    secondary: { light: '#92400E', dark: '#D97706' },
    neutral: generateNeutralScale('#78716C'),
    rationale: 'Rich black primary for elegance. Amber/gold secondary for luxury and premium feel.',
  },
};

function generateNeutralScale(base) {
  // Generate a simple neutral scale based on a base color
  return {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: base,
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  };
}

/** Typography presets */
const TYPE_PRESETS = {
  modern: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: "'JetBrains Mono', 'Fira Code', monospace",
    scale: [12, 14, 16, 18, 20, 24, 30, 36, 48, 60],
    baseSize: 16,
    rationale: 'Inter is highly legible, modern, and free. Same font for heading/body creates a clean, unified look.',
  },
  minimal: {
    heading: "'DM Sans', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
    mono: "'DM Mono', 'Fira Code', monospace",
    scale: [12, 14, 16, 20, 24, 32, 40, 48],
    baseSize: 16,
    rationale: 'DM Sans is geometric and clean, reinforcing the minimal aesthetic.',
  },
  corporate: {
    heading: "'IBM Plex Sans', system-ui, sans-serif",
    body: "'IBM Plex Sans', system-ui, sans-serif",
    mono: "'IBM Plex Mono', monospace",
    scale: [12, 14, 16, 18, 20, 24, 30, 36, 48],
    baseSize: 16,
    rationale: 'IBM Plex is professional, highly legible, and works well for data-heavy interfaces.',
  },
  playful: {
    heading: "'Plus Jakarta Sans', system-ui, sans-serif",
    body: "'Plus Jakarta Sans', system-ui, sans-serif",
    mono: "'Fira Code', monospace",
    scale: [12, 14, 16, 18, 20, 24, 30, 36, 48, 64],
    baseSize: 16,
    rationale: 'Plus Jakarta Sans has friendly, rounded letterforms that convey approachability.',
  },
  default: {
    heading: 'system-ui, -apple-system, sans-serif',
    body: 'system-ui, -apple-system, sans-serif',
    mono: "'SFMono-Regular', Consolas, monospace",
    scale: [12, 14, 16, 18, 20, 24, 30, 36, 48],
    baseSize: 16,
    rationale: 'System fonts for optimal performance and native feel. No external font loading required.',
  },
};

async function handler({ description, preferences = {} }) {
  const brief = parseBrief(description);
  const agents = loadAgents();

  const context = {
    description,
    concerns: brief.concerns,
    industry: brief.industry,
  };

  const selected = selectAgents(context, agents);
  const guidance = extractGuidance(selected, context);

  const style = preferences.style || brief.style || 'modern';
  const includeDarkMode = preferences.darkMode !== false;

  const tokens = generateTokenSystem(style, brief, preferences, includeDarkMode);
  const output = formatTokenOutput(description, style, tokens, selected, guidance, includeDarkMode);

  return { content: [{ type: 'text', text: output }] };
}

function generateTokenSystem(style, brief, preferences, includeDarkMode) {
  const paletteKey = brief.industry && COLOR_PALETTES[brief.industry]
    ? brief.industry
    : COLOR_PALETTES[style] ? style : 'modern';

  const palette = { ...COLOR_PALETTES[paletteKey] };

  // Override primary if user specified
  if (preferences.primaryColor) {
    palette.primary = { light: preferences.primaryColor, dark: lightenColor(preferences.primaryColor) };
  }

  const typeKey = TYPE_PRESETS[style] ? style : 'default';
  const typography = TYPE_PRESETS[typeKey];

  return {
    colors: {
      palette,
      semantic: {
        success: { light: '#16A34A', dark: '#4ADE80' },
        warning: { light: '#D97706', dark: '#FBBF24' },
        error: { light: '#DC2626', dark: '#F87171' },
        info: { light: '#2563EB', dark: '#60A5FA' },
      },
      surface: {
        background: { light: '#FFFFFF', dark: '#0A0A0A' },
        foreground: { light: '#09090B', dark: '#FAFAFA' },
        card: { light: '#FFFFFF', dark: '#18181B' },
        cardForeground: { light: '#09090B', dark: '#FAFAFA' },
        muted: { light: '#F4F4F5', dark: '#27272A' },
        mutedForeground: { light: '#71717A', dark: '#A1A1AA' },
        border: { light: '#E4E4E7', dark: '#27272A' },
        input: { light: '#E4E4E7', dark: '#27272A' },
        ring: { light: palette.primary.light, dark: palette.primary.dark },
      },
    },
    typography,
    spacing: {
      base: 4,
      scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64],
      values: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 256],
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
    motion: {
      durations: {
        fast: '100ms',
        normal: '200ms',
        slow: '300ms',
        slower: '500ms',
      },
      easings: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
    includeDarkMode,
  };
}

function lightenColor(hex) {
  const clean = hex.replace('#', '');
  const r = Math.min(255, parseInt(clean.slice(0, 2), 16) + 60);
  const g = Math.min(255, parseInt(clean.slice(2, 4), 16) + 60);
  const b = Math.min(255, parseInt(clean.slice(4, 6), 16) + 60);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function formatTokenOutput(description, style, tokens, selected, guidance, includeDarkMode) {
  const lines = [];

  lines.push(`## Design Token System`);
  lines.push(`**For:** ${description}`);
  lines.push(`**Style:** ${style}`);
  lines.push(`**Agents consulted:** ${selected.primary.name}${selected.supporting.length > 0 ? ', ' + selected.supporting.map(a => a.name).join(', ') : ''}`);
  lines.push('');

  // Color rationale
  lines.push('### Colors');
  lines.push('');
  lines.push(`*${tokens.colors.palette.rationale}*`);
  lines.push('');

  // Typography rationale
  lines.push('### Typography');
  lines.push('');
  lines.push(`*${tokens.typography.rationale}*`);
  lines.push(`- Heading: ${tokens.typography.heading}`);
  lines.push(`- Body: ${tokens.typography.body}`);
  lines.push(`- Mono: ${tokens.typography.mono}`);
  lines.push(`- Scale: ${tokens.typography.scale.map(s => s + 'px').join(', ')}`);
  lines.push('');

  // CSS Custom Properties
  lines.push('### CSS Custom Properties');
  lines.push('');
  lines.push('```css');
  lines.push(':root {');
  lines.push('  /* Colors — Primary */');
  lines.push(`  --color-primary: ${tokens.colors.palette.primary.light};`);
  lines.push(`  --color-secondary: ${tokens.colors.palette.secondary.light};`);
  lines.push('');
  lines.push('  /* Colors — Semantic */');
  lines.push(`  --color-success: ${tokens.colors.semantic.success.light};`);
  lines.push(`  --color-warning: ${tokens.colors.semantic.warning.light};`);
  lines.push(`  --color-error: ${tokens.colors.semantic.error.light};`);
  lines.push(`  --color-info: ${tokens.colors.semantic.info.light};`);
  lines.push('');
  lines.push('  /* Colors — Surfaces */');
  for (const [name, val] of Object.entries(tokens.colors.surface)) {
    lines.push(`  --color-${camelToKebab(name)}: ${val.light};`);
  }
  lines.push('');
  lines.push('  /* Colors — Neutral Scale */');
  for (const [step, val] of Object.entries(tokens.colors.palette.neutral)) {
    lines.push(`  --color-neutral-${step}: ${val};`);
  }
  lines.push('');
  lines.push('  /* Typography */');
  lines.push(`  --font-heading: ${tokens.typography.heading};`);
  lines.push(`  --font-body: ${tokens.typography.body};`);
  lines.push(`  --font-mono: ${tokens.typography.mono};`);
  lines.push('');
  const sizeNames = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
  for (let i = 0; i < tokens.typography.scale.length && i < sizeNames.length; i++) {
    lines.push(`  --text-${sizeNames[i]}: ${tokens.typography.scale[i]}px;`);
  }
  lines.push('');
  lines.push('  /* Spacing (4px base) */');
  const spacingNames = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24', '32', '40', '48', '64'];
  for (let i = 0; i < tokens.spacing.values.length && i < spacingNames.length; i++) {
    lines.push(`  --space-${spacingNames[i]}: ${tokens.spacing.values[i]}px;`);
  }
  lines.push('');
  lines.push('  /* Shadows */');
  for (const [name, val] of Object.entries(tokens.shadows)) {
    lines.push(`  --shadow-${name}: ${val};`);
  }
  lines.push('');
  lines.push('  /* Border Radius */');
  for (const [name, val] of Object.entries(tokens.borderRadius)) {
    lines.push(`  --radius-${name}: ${val};`);
  }
  lines.push('');
  lines.push('  /* Motion */');
  for (const [name, val] of Object.entries(tokens.motion.durations)) {
    lines.push(`  --duration-${name}: ${val};`);
  }
  for (const [name, val] of Object.entries(tokens.motion.easings)) {
    lines.push(`  --ease-${name}: ${val};`);
  }
  lines.push('}');

  if (includeDarkMode) {
    lines.push('');
    lines.push('@media (prefers-color-scheme: dark) {');
    lines.push('  :root {');
    lines.push(`    --color-primary: ${tokens.colors.palette.primary.dark};`);
    lines.push(`    --color-secondary: ${tokens.colors.palette.secondary.dark};`);
    lines.push(`    --color-success: ${tokens.colors.semantic.success.dark};`);
    lines.push(`    --color-warning: ${tokens.colors.semantic.warning.dark};`);
    lines.push(`    --color-error: ${tokens.colors.semantic.error.dark};`);
    lines.push(`    --color-info: ${tokens.colors.semantic.info.dark};`);
    for (const [name, val] of Object.entries(tokens.colors.surface)) {
      lines.push(`    --color-${camelToKebab(name)}: ${val.dark};`);
    }
    lines.push('  }');
    lines.push('}');
  }

  lines.push('```');
  lines.push('');

  // Agent recommendations
  if (guidance.recommendations.length > 0) {
    lines.push('### Expert Notes');
    lines.push('');
    for (const rec of guidance.recommendations.slice(0, 5)) {
      lines.push(`- ${rec.text} *(${rec.source})*`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function camelToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

module.exports = { TOOL_DEFINITION, handler };
