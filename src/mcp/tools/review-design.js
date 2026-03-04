const fs = require('fs');
const path = require('path');
const { analyzeFile } = require('../analyzers/code-analyzer');
const { loadAgents } = require('../../agents/agent-loader');
const { selectAgents } = require('../../agents/agent-selector');
const { extractGuidance } = require('../../agents/agent-knowledge');

const TOOL_DEFINITION = {
  name: 'review_design',
  description:
    'Review a component file for design quality. Reads the file, selects relevant design agents, and returns expert feedback on states, accessibility, consistency, and best practices.',
  inputSchema: {
    type: 'object',
    properties: {
      file_path: {
        type: 'string',
        description: 'Path to the component file to review',
      },
      context: {
        type: 'string',
        description:
          "Optional project context (e.g. 'healthcare dashboard', 'e-commerce checkout')",
      },
    },
    required: ['file_path'],
  },
};

async function handler({ file_path, context }) {
  if (!fs.existsSync(file_path)) {
    return { content: [{ type: 'text', text: `File not found: ${file_path}` }], isError: true };
  }

  const analysis = analyzeFile(file_path);
  const agents = loadAgents();

  const selectorContext = {
    description: context || '',
    concerns: [],
    componentType: detectComponentType(analysis),
    framework: detectFramework(analysis),
    fileContent: fs.readFileSync(file_path, 'utf-8'),
  };

  if (analysis.ariaAttributes.length === 0) selectorContext.concerns.push('accessibility');
  if (analysis.animations.transitions.length > 0) selectorContext.concerns.push('animation');
  if (analysis.formElements.length > 0) selectorContext.concerns.push('forms');
  if (analysis.states.hover || analysis.states.focus) selectorContext.concerns.push('interaction');

  const selected = selectAgents(selectorContext, agents);
  const guidance = extractGuidance(selected, selectorContext);

  const findings = generateFindings(analysis, guidance);
  const output = formatReviewOutput(analysis, selected, findings, guidance);

  return { content: [{ type: 'text', text: output }] };
}

function detectComponentType(analysis) {
  if (analysis.formElements.length > 0) return 'form';
  if (analysis.components.some(c => /table|grid|list/i.test(c.name))) return 'table';
  if (analysis.components.some(c => /modal|dialog|drawer/i.test(c.name))) return 'modal';
  if (analysis.components.some(c => /nav|menu|sidebar/i.test(c.name))) return 'navigation';
  if (analysis.components.some(c => /button|btn/i.test(c.name))) return 'button';
  if (analysis.components.some(c => /card/i.test(c.name))) return 'card';
  if (analysis.components.some(c => /chart|graph/i.test(c.name))) return 'data-visualization';
  return 'component';
}

function detectFramework(analysis) {
  const content = fs.readFileSync(analysis.filePath, 'utf-8');
  if (/from ['"]react['"]/.test(content) || /import React/.test(content)) return 'react';
  if (/from ['"]vue['"]/.test(content)) return 'vue';
  if (/from ['"]svelte['"]/.test(content)) return 'svelte';
  if (/from ['"]@angular/.test(content)) return 'angular';
  return 'unknown';
}

function generateFindings(analysis, guidance) {
  const findings = [];

  // Missing states
  const missingStates = [];
  if (!analysis.states.hover) missingStates.push('hover');
  if (!analysis.states.focus && !analysis.states.focusVisible) missingStates.push('focus');
  if (!analysis.states.disabled) missingStates.push('disabled');
  if (missingStates.length > 0) {
    findings.push({
      category: 'States',
      severity: 'medium',
      message: `Missing interactive states: ${missingStates.join(', ')}`,
      suggestion: `Add ${missingStates.map(s => s === 'focus' ? ':focus-visible' : `:${s}`).join(', ')} styles for interactive elements.`,
    });
  }

  // Focus visible specifically
  if (analysis.states.focus && !analysis.states.focusVisible) {
    findings.push({
      category: 'Accessibility',
      severity: 'medium',
      message: 'Uses :focus instead of :focus-visible',
      suggestion: 'Prefer :focus-visible to only show focus rings for keyboard navigation, not mouse clicks.',
    });
  }

  // Accessibility issues
  if (analysis.ariaAttributes.length === 0 && analysis.components.length > 0) {
    findings.push({
      category: 'Accessibility',
      severity: 'high',
      message: 'No ARIA attributes found',
      suggestion: 'Add appropriate ARIA labels, roles, and states to interactive elements.',
    });
  }

  // Images without alt text
  const imagesWithoutAlt = analysis.images.filter(img => !img.hasAlt);
  if (imagesWithoutAlt.length > 0) {
    findings.push({
      category: 'Accessibility',
      severity: 'high',
      message: `${imagesWithoutAlt.length} image(s) missing alt text`,
      suggestion: 'Add descriptive alt text to all images, or alt="" for decorative images.',
    });
  }

  // Form elements without labels
  const unlabeledForms = analysis.formElements.filter(f => !f.hasLabel && !f.hasAriaLabel);
  if (unlabeledForms.length > 0) {
    findings.push({
      category: 'Accessibility',
      severity: 'high',
      message: `${unlabeledForms.length} form element(s) without labels`,
      suggestion: 'Add <label> elements or aria-label/aria-labelledby to all form inputs.',
    });
  }

  // Keyboard navigation
  const hasKeyboardHandlers = analysis.eventHandlers.some(h =>
    /onKeyDown|onKeyUp|onKeyPress/i.test(h.handler)
  );
  const hasClickHandlers = analysis.eventHandlers.some(h => /onClick/i.test(h.handler));
  if (hasClickHandlers && !hasKeyboardHandlers) {
    findings.push({
      category: 'Accessibility',
      severity: 'medium',
      message: 'Click handlers without keyboard equivalents',
      suggestion: 'Add onKeyDown handlers for Enter/Space on clickable non-button elements, or use <button> instead.',
    });
  }

  // Hardcoded colors
  const hardcodedColors = analysis.colors.filter(c => !c.isToken);
  if (hardcodedColors.length > 3) {
    findings.push({
      category: 'Consistency',
      severity: 'low',
      message: `${hardcodedColors.length} hardcoded color values found`,
      suggestion: 'Consider using design tokens (CSS custom properties or theme variables) for consistent color usage.',
    });
  }

  // Touch targets
  const smallTargets = analysis.touchTargets.filter(t => !t.sufficient);
  if (smallTargets.length > 0) {
    findings.push({
      category: 'Accessibility',
      severity: 'medium',
      message: `${smallTargets.length} element(s) may have insufficient touch targets (<48px)`,
      suggestion: 'Ensure interactive elements are at least 48x48px for touch accessibility.',
    });
  }

  // Heading hierarchy
  if (analysis.headings.length > 0) {
    const levels = analysis.headings.map(h => h.level);
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) {
        findings.push({
          category: 'Accessibility',
          severity: 'low',
          message: `Heading hierarchy skips from h${levels[i - 1]} to h${levels[i]}`,
          suggestion: 'Maintain sequential heading levels for screen reader navigation.',
        });
        break;
      }
    }
  }

  // Token usage
  if (analysis.tokenUsage.tokenPercentage < 50 && analysis.colors.length > 0) {
    findings.push({
      category: 'Consistency',
      severity: 'low',
      message: `Only ${analysis.tokenUsage.tokenPercentage}% of values use design tokens`,
      suggestion: 'Increase design token adoption for better maintainability and consistency.',
    });
  }

  return findings;
}

function formatReviewOutput(analysis, selected, findings, guidance) {
  const lines = [];

  lines.push(`## Design Review: ${path.basename(analysis.filePath)}`);
  lines.push('');

  // Agent attribution
  lines.push(`**Reviewed by:** ${selected.primary.name} (primary)`);
  if (selected.supporting.length > 0) {
    lines.push(`**Supporting expertise:** ${selected.supporting.map(a => a.name).join(', ')}`);
  }
  lines.push('');

  // Summary
  const highCount = findings.filter(f => f.severity === 'high').length;
  const medCount = findings.filter(f => f.severity === 'medium').length;
  const lowCount = findings.filter(f => f.severity === 'low').length;
  lines.push(`### Summary`);
  lines.push(`- ${findings.length} finding(s): ${highCount} high, ${medCount} medium, ${lowCount} low`);
  lines.push(`- Components detected: ${analysis.components.length}`);
  lines.push(`- Token usage: ${analysis.tokenUsage.tokenPercentage}%`);
  lines.push('');

  // Findings
  if (findings.length > 0) {
    lines.push('### Findings');
    lines.push('');
    const bySeverity = ['high', 'medium', 'low'];
    for (const severity of bySeverity) {
      const items = findings.filter(f => f.severity === severity);
      for (const item of items) {
        const icon = severity === 'high' ? '[HIGH]' : severity === 'medium' ? '[MEDIUM]' : '[LOW]';
        lines.push(`${icon} **${item.category}**: ${item.message}`);
        lines.push(`  → ${item.suggestion}`);
        lines.push('');
      }
    }
  }

  // Agent recommendations
  if (guidance.recommendations.length > 0) {
    lines.push('### Expert Recommendations');
    lines.push('');
    for (const rec of guidance.recommendations) {
      lines.push(`- ${rec.text} *(${rec.source})*`);
    }
    lines.push('');
  }

  // Checklist
  if (guidance.checklist.length > 0) {
    lines.push('### Checklist');
    lines.push('');
    for (const item of guidance.checklist.slice(0, 10)) {
      lines.push(`- [ ] ${item.item} *(${item.source})*`);
    }
    lines.push('');
  }

  // Anti-patterns
  if (guidance.antiPatterns.length > 0) {
    lines.push('### Watch Out For');
    lines.push('');
    for (const ap of guidance.antiPatterns.slice(0, 5)) {
      lines.push(`- ${ap.pattern} *(${ap.source})*`);
    }
  }

  return lines.join('\n');
}

module.exports = { TOOL_DEFINITION, handler };
