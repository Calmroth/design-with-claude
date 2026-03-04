const { loadAgents } = require('../../agents/agent-loader');
const { selectAgents } = require('../../agents/agent-selector');
const { extractGuidance } = require('../../agents/agent-knowledge');
const { parseBrief } = require('../../ai-orchestrator/brief-parser');

const TOOL_DEFINITION = {
  name: 'get_design_guidance',
  description:
    'Get domain-specific design recommendations for what you\'re building. Returns expert guidance on color, typography, layout, accessibility, and domain-specific considerations from 29 specialized design agents.',
  inputSchema: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        description:
          "What you're building (e.g. 'healthcare patient portal', 'e-commerce checkout flow')",
      },
      concerns: {
        type: 'array',
        items: { type: 'string' },
        description:
          "Optional specific concerns (e.g. ['accessibility', 'dark mode', 'mobile'])",
      },
    },
    required: ['description'],
  },
};

async function handler({ description, concerns }) {
  const brief = parseBrief(description);
  const agents = loadAgents();

  const context = {
    description,
    concerns: [...(concerns || []), ...brief.concerns],
    industry: brief.industry,
    componentType: brief.type,
    framework: '',
    fileContent: '',
  };

  const selected = selectAgents(context, agents);
  const guidance = extractGuidance(selected, context);

  const output = formatGuidanceOutput(description, brief, selected, guidance);
  return { content: [{ type: 'text', text: output }] };
}

function formatGuidanceOutput(description, brief, selected, guidance) {
  const lines = [];

  lines.push(`## Design Guidance: ${description}`);
  lines.push('');

  // Context detected
  lines.push('### Context');
  if (brief.style) lines.push(`- **Style:** ${brief.style}`);
  if (brief.type) lines.push(`- **Type:** ${brief.type}`);
  if (brief.industry) lines.push(`- **Industry:** ${brief.industry}`);
  if (brief.audience) lines.push(`- **Audience:** ${brief.audience}`);
  if (brief.concerns.length > 0) lines.push(`- **Concerns:** ${brief.concerns.join(', ')}`);
  lines.push('');

  // Agents consulted
  lines.push(`**Primary agent:** ${selected.primary.name}`);
  if (selected.supporting.length > 0) {
    lines.push(`**Supporting:** ${selected.supporting.map(a => a.name).join(', ')}`);
  }
  lines.push('');

  // Principles
  if (guidance.principles.length > 0) {
    lines.push('### Design Principles');
    lines.push('');
    for (const p of guidance.principles) {
      lines.push(`- **${p.text}** *(${p.source})*`);
    }
    lines.push('');
  }

  // Recommendations
  if (guidance.recommendations.length > 0) {
    lines.push('### Recommendations');
    lines.push('');

    // Group by source
    const bySource = {};
    for (const rec of guidance.recommendations) {
      if (!bySource[rec.source]) bySource[rec.source] = [];
      bySource[rec.source].push(rec);
    }

    for (const [source, recs] of Object.entries(bySource)) {
      lines.push(`**From ${source}:**`);
      for (const rec of recs) {
        lines.push(`- ${rec.text}`);
      }
      lines.push('');
    }
  }

  // Checklist
  if (guidance.checklist.length > 0) {
    lines.push('### Design Checklist');
    lines.push('');

    // Group by category
    const byCategory = {};
    for (const item of guidance.checklist) {
      const cat = item.category || 'General';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(item);
    }

    for (const [category, items] of Object.entries(byCategory)) {
      lines.push(`**${category}:**`);
      for (const item of items) {
        lines.push(`- [ ] ${item.item}`);
      }
      lines.push('');
    }
  }

  // Anti-patterns
  if (guidance.antiPatterns.length > 0) {
    lines.push('### Avoid These');
    lines.push('');
    for (const ap of guidance.antiPatterns) {
      lines.push(`- ${ap.pattern} *(${ap.source})*`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

module.exports = { TOOL_DEFINITION, handler };
