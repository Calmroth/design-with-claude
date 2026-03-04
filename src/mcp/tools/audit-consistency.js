const path = require('path');
const { analyzeFile, aggregateAnalysis } = require('../analyzers/code-analyzer');
const { loadAgents } = require('../../agents/agent-loader');
const { selectAgents } = require('../../agents/agent-selector');
const { extractGuidance } = require('../../agents/agent-knowledge');

let glob;
try {
  glob = require('glob');
} catch {
  glob = null;
}

const TOOL_DEFINITION = {
  name: 'audit_consistency',
  description:
    'Scan a directory of component files for design inconsistencies. Detects drift in colors, spacing, border-radius, typography, and animation values across files.',
  inputSchema: {
    type: 'object',
    properties: {
      directory: {
        type: 'string',
        description: 'Path to the components directory to audit',
      },
      file_pattern: {
        type: 'string',
        description: "Optional glob pattern (default: '**/*.{jsx,tsx,css}')",
      },
    },
    required: ['directory'],
  },
};

async function handler({ directory, file_pattern }) {
  const fs = require('fs');
  if (!fs.existsSync(directory)) {
    return { content: [{ type: 'text', text: `Directory not found: ${directory}` }], isError: true };
  }

  const pattern = file_pattern || '**/*.{jsx,tsx,css,html,vue,svelte}';
  const files = findFiles(directory, pattern);

  if (files.length === 0) {
    return {
      content: [{ type: 'text', text: `No files matching "${pattern}" found in ${directory}` }],
    };
  }

  const analyses = [];
  const errors = [];
  for (const file of files) {
    try {
      analyses.push(analyzeFile(file));
    } catch (err) {
      errors.push({ file, error: err.message });
    }
  }

  if (analyses.length === 0) {
    return {
      content: [{ type: 'text', text: 'Could not analyze any files.' }],
      isError: true,
    };
  }

  const aggregate = aggregateAnalysis(analyses);
  const inconsistencies = detectInconsistencies(aggregate);

  // Get agent guidance for consistency
  const agents = loadAgents();
  const context = {
    description: 'design system consistency audit',
    concerns: ['consistency', 'design-system'],
  };
  const selected = selectAgents(context, agents);
  const guidance = extractGuidance(selected, context);

  const output = formatAuditOutput(directory, analyses, aggregate, inconsistencies, guidance, errors);
  return { content: [{ type: 'text', text: output }] };
}

function findFiles(directory, pattern) {
  if (glob && glob.sync) {
    return glob.sync(pattern, { cwd: directory, absolute: true, nodir: true });
  }

  // Fallback: recursive file walk with simple extension matching
  const fs = require('fs');
  const extensions = ['.jsx', '.tsx', '.css', '.html', '.vue', '.svelte'];
  const results = [];

  function walk(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          walk(fullPath);
        } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
          results.push(fullPath);
        }
      }
    } catch {
      // skip inaccessible directories
    }
  }

  walk(directory);
  return results;
}

function detectInconsistencies(aggregate) {
  const inconsistencies = [];

  // Color inconsistencies
  if (aggregate.uniqueColors.length > 15) {
    inconsistencies.push({
      category: 'Colors',
      severity: 'high',
      message: `${aggregate.uniqueColors.length} unique color values found across files`,
      details: `Unique colors: ${aggregate.uniqueColors.slice(0, 10).join(', ')}${aggregate.uniqueColors.length > 10 ? ` (+${aggregate.uniqueColors.length - 10} more)` : ''}`,
      suggestion: 'Consolidate colors into a design token system. Most projects need 8-12 core colors.',
    });
  }

  // Similar colors (colors that are close but not identical)
  const similarGroups = findSimilarColors(aggregate.uniqueColors);
  if (similarGroups.length > 0) {
    inconsistencies.push({
      category: 'Colors',
      severity: 'medium',
      message: `${similarGroups.length} group(s) of similar but non-identical colors`,
      details: similarGroups
        .slice(0, 5)
        .map(g => `${g.join(' ≈ ')}`)
        .join('\n'),
      suggestion: 'Unify similar colors into single token values.',
    });
  }

  // Spacing inconsistencies
  const spacingValues = aggregate.uniqueSpacing.filter(v => /^\d+/.test(v));
  const offGridValues = spacingValues.filter(v => {
    const num = parseInt(v, 10);
    return num > 0 && num % 4 !== 0;
  });
  if (offGridValues.length > 0) {
    inconsistencies.push({
      category: 'Spacing',
      severity: 'medium',
      message: `${offGridValues.length} spacing value(s) not on a 4px grid`,
      details: `Off-grid values: ${offGridValues.join(', ')}`,
      suggestion: 'Align all spacing to a 4px (or 8px) grid system.',
    });
  }

  if (aggregate.uniqueSpacing.length > 10) {
    inconsistencies.push({
      category: 'Spacing',
      severity: 'medium',
      message: `${aggregate.uniqueSpacing.length} unique spacing values found`,
      details: `Values: ${aggregate.uniqueSpacing.slice(0, 15).join(', ')}`,
      suggestion: 'Use a spacing scale (e.g., 4, 8, 12, 16, 24, 32, 48, 64).',
    });
  }

  // Border-radius inconsistencies
  if (aggregate.uniqueBorderRadius.length > 5) {
    inconsistencies.push({
      category: 'Border Radius',
      severity: 'low',
      message: `${aggregate.uniqueBorderRadius.length} unique border-radius values`,
      details: `Values: ${aggregate.uniqueBorderRadius.join(', ')}`,
      suggestion: 'Standardize to 3-4 border-radius tokens (e.g., sm: 4px, md: 8px, lg: 16px, full: 9999px).',
    });
  }

  // Typography inconsistencies
  if (aggregate.uniqueFontSizes.length > 8) {
    inconsistencies.push({
      category: 'Typography',
      severity: 'medium',
      message: `${aggregate.uniqueFontSizes.length} unique font sizes found`,
      details: `Sizes: ${aggregate.uniqueFontSizes.join(', ')}`,
      suggestion: 'Use a type scale (e.g., 12, 14, 16, 18, 20, 24, 30, 36, 48).',
    });
  }

  // Animation duration inconsistencies
  if (aggregate.uniqueDurations.length > 4) {
    inconsistencies.push({
      category: 'Motion',
      severity: 'low',
      message: `${aggregate.uniqueDurations.length} unique animation durations`,
      details: `Durations: ${aggregate.uniqueDurations.join(', ')}`,
      suggestion: 'Standardize motion durations (e.g., fast: 100ms, normal: 200ms, slow: 300ms, slower: 500ms).',
    });
  }

  // Token adoption
  if (aggregate.overallTokenPercentage < 50 && aggregate.totalValues > 10) {
    inconsistencies.push({
      category: 'Token Adoption',
      severity: 'high',
      message: `Only ${aggregate.overallTokenPercentage}% of design values use tokens`,
      details: `${aggregate.totalTokenRefs} token references vs ${aggregate.totalHardcoded} hardcoded values`,
      suggestion: 'Migrate hardcoded values to design tokens for maintainability.',
    });
  }

  // Files without focus styles
  if (aggregate.filesWithoutFocusStyles.length > 0 && aggregate.filesWithFocusStyles.length > 0) {
    inconsistencies.push({
      category: 'Accessibility',
      severity: 'high',
      message: `${aggregate.filesWithoutFocusStyles.length} file(s) lack focus styles while ${aggregate.filesWithFocusStyles.length} have them`,
      details: `Missing focus styles: ${aggregate.filesWithoutFocusStyles.slice(0, 5).map(f => path.basename(f)).join(', ')}`,
      suggestion: 'Ensure all interactive components have :focus-visible styles.',
    });
  }

  return inconsistencies;
}

function findSimilarColors(colors) {
  const hexColors = colors
    .filter(c => /^#[0-9a-f]{6}$/i.test(c))
    .map(c => ({
      hex: c.toLowerCase(),
      r: parseInt(c.slice(1, 3), 16),
      g: parseInt(c.slice(3, 5), 16),
      b: parseInt(c.slice(5, 7), 16),
    }));

  const groups = [];
  const used = new Set();

  for (let i = 0; i < hexColors.length; i++) {
    if (used.has(i)) continue;
    const group = [hexColors[i].hex];

    for (let j = i + 1; j < hexColors.length; j++) {
      if (used.has(j)) continue;
      const distance = Math.sqrt(
        Math.pow(hexColors[i].r - hexColors[j].r, 2) +
        Math.pow(hexColors[i].g - hexColors[j].g, 2) +
        Math.pow(hexColors[i].b - hexColors[j].b, 2)
      );
      if (distance > 0 && distance < 30) {
        group.push(hexColors[j].hex);
        used.add(j);
      }
    }

    if (group.length > 1) {
      used.add(i);
      groups.push(group);
    }
  }

  return groups;
}

function formatAuditOutput(directory, analyses, aggregate, inconsistencies, guidance, errors) {
  const lines = [];

  lines.push(`## Design Consistency Audit`);
  lines.push(`**Directory:** ${directory}`);
  lines.push(`**Files analyzed:** ${analyses.length}`);
  if (errors.length > 0) {
    lines.push(`**Errors:** ${errors.length} file(s) could not be analyzed`);
  }
  lines.push('');

  // Overall stats
  lines.push('### Overview');
  lines.push(`- Unique colors: ${aggregate.uniqueColors.length}`);
  lines.push(`- Unique spacing values: ${aggregate.uniqueSpacing.length}`);
  lines.push(`- Unique border-radius values: ${aggregate.uniqueBorderRadius.length}`);
  lines.push(`- Unique font sizes: ${aggregate.uniqueFontSizes.length}`);
  lines.push(`- Token adoption: ${aggregate.overallTokenPercentage}%`);
  lines.push('');

  // Inconsistencies
  if (inconsistencies.length > 0) {
    lines.push(`### Issues Found (${inconsistencies.length})`);
    lines.push('');

    const bySeverity = ['high', 'medium', 'low'];
    for (const severity of bySeverity) {
      const items = inconsistencies.filter(i => i.severity === severity);
      for (const item of items) {
        const icon = severity === 'high' ? '[HIGH]' : severity === 'medium' ? '[MEDIUM]' : '[LOW]';
        lines.push(`${icon} **${item.category}**: ${item.message}`);
        if (item.details) {
          lines.push(`  ${item.details}`);
        }
        lines.push(`  → ${item.suggestion}`);
        lines.push('');
      }
    }
  } else {
    lines.push('### No major inconsistencies found');
    lines.push('');
  }

  // Recommendations from agents
  if (guidance.recommendations.length > 0) {
    lines.push('### Expert Recommendations');
    lines.push('');
    for (const rec of guidance.recommendations.slice(0, 5)) {
      lines.push(`- ${rec.text} *(${rec.source})*`);
    }
    lines.push('');
  }

  // File-by-file breakdown
  lines.push('### File Summary');
  lines.push('');
  for (const a of analyses.slice(0, 20)) {
    const basename = path.basename(a.filePath);
    const stats = [];
    if (a.colors.length > 0) stats.push(`${a.colors.length} colors`);
    if (a.components.length > 0) stats.push(`${a.components.length} components`);
    if (a.formElements.length > 0) stats.push(`${a.formElements.length} form elements`);
    const focusStatus = a.states.focus || a.states.focusVisible ? 'focus: yes' : 'focus: no';
    stats.push(focusStatus);
    lines.push(`- **${basename}**: ${stats.join(', ')}`);
  }
  if (analyses.length > 20) {
    lines.push(`  *(+ ${analyses.length - 20} more files)*`);
  }

  return lines.join('\n');
}

module.exports = { TOOL_DEFINITION, handler };
