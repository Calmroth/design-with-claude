const fs = require('fs');
const path = require('path');
const { analyzeFile } = require('../analyzers/code-analyzer');
const { checkColorPair } = require('../analyzers/contrast-checker');
const { loadAgents } = require('../../agents/agent-loader');
const { extractGuidance } = require('../../agents/agent-knowledge');

const TOOL_DEFINITION = {
  name: 'check_accessibility',
  description:
    'Focused accessibility review of a component file. Checks ARIA attributes, keyboard navigation, focus indicators, color contrast, touch targets, alt text, form labels, and heading hierarchy. Returns issues with WCAG references.',
  inputSchema: {
    type: 'object',
    properties: {
      file_path: {
        type: 'string',
        description: 'Path to the file to check',
      },
    },
    required: ['file_path'],
  },
};

async function handler({ file_path }) {
  if (!fs.existsSync(file_path)) {
    return { content: [{ type: 'text', text: `File not found: ${file_path}` }], isError: true };
  }

  const analysis = analyzeFile(file_path);
  const content = fs.readFileSync(file_path, 'utf-8');

  // Force-select accessibility-specialist agent
  const agents = loadAgents();
  const a11yAgent = agents.get('accessibility-specialist');
  const selected = {
    primary: a11yAgent || { name: 'accessibility-specialist', checklist: [], antiPatterns: [], expertise: [], guidelines: {}, principles: [] },
    supporting: [],
  };
  const guidance = extractGuidance(selected, { description: 'accessibility audit', concerns: ['accessibility'] });

  const issues = [];

  // 1. ARIA labels on interactive elements
  checkAriaLabels(analysis, content, issues);

  // 2. Keyboard navigation support
  checkKeyboardNav(analysis, content, issues);

  // 3. Focus indicators
  checkFocusIndicators(analysis, content, issues);

  // 4. Color contrast
  checkColorContrast(analysis, content, issues);

  // 5. Touch targets
  checkTouchTargets(analysis, issues);

  // 6. Alt text on images
  checkAltText(analysis, issues);

  // 7. Form labels
  checkFormLabels(analysis, issues);

  // 8. Heading hierarchy
  checkHeadingHierarchy(analysis, issues);

  // 9. Language and ARIA landmarks
  checkLandmarks(content, issues);

  // 10. Reduced motion
  checkReducedMotion(analysis, content, issues);

  const output = formatAccessibilityOutput(analysis, issues, guidance);
  return { content: [{ type: 'text', text: output }] };
}

function checkAriaLabels(analysis, content, issues) {
  // Check for interactive elements without ARIA labels
  const interactivePatterns = [
    { regex: /<button[^>]*(?!.*aria-label)(?!.*aria-labelledby)[^>]*>/gi, element: 'button' },
    { regex: /<a[^>]*(?!.*aria-label)[^>]*href[^>]*>[^<]*<\/a>/gi, element: 'link' },
    { regex: /<div[^>]*onClick[^>]*(?!.*role)[^>]*>/gi, element: 'clickable div' },
    { regex: /<span[^>]*onClick[^>]*(?!.*role)[^>]*>/gi, element: 'clickable span' },
  ];

  // Check for clickable divs/spans without role
  const clickableDivs = content.match(/<(?:div|span)[^>]*onClick[^>]*>/gi) || [];
  for (const match of clickableDivs) {
    if (!/role=/.test(match)) {
      issues.push({
        type: 'ARIA',
        severity: 'high',
        message: 'Clickable element without role attribute',
        wcag: '4.1.2 Name, Role, Value (Level A)',
        suggestion: 'Add role="button" to clickable non-button elements, or use a <button> instead.',
        code: match.slice(0, 80),
      });
    }
  }

  // Check icon buttons without labels
  const iconButtons = content.match(/<button[^>]*>[\s]*<(?:svg|img|i|Icon)[^>]*>[\s]*<\/button>/gi) || [];
  for (const match of iconButtons) {
    if (!/aria-label/.test(match)) {
      issues.push({
        type: 'ARIA',
        severity: 'high',
        message: 'Icon-only button without aria-label',
        wcag: '1.1.1 Non-text Content (Level A)',
        suggestion: 'Add aria-label describing the button\'s action (e.g., aria-label="Close").',
        code: match.slice(0, 80),
      });
    }
  }
}

function checkKeyboardNav(analysis, content, issues) {
  const hasOnClick = analysis.eventHandlers.some(h => /onClick/i.test(h.handler));
  const hasOnKeyDown = analysis.eventHandlers.some(h => /onKeyDown|onKeyUp|onKeyPress/i.test(h.handler));

  if (hasOnClick && !hasOnKeyDown) {
    // Check if all onClick are on native interactive elements
    const clickOnNonInteractive = content.match(/<(?:div|span|li|td|tr|p)[^>]*onClick/gi) || [];
    if (clickOnNonInteractive.length > 0) {
      issues.push({
        type: 'Keyboard',
        severity: 'high',
        message: `${clickOnNonInteractive.length} non-interactive element(s) with click handlers but no keyboard handlers`,
        wcag: '2.1.1 Keyboard (Level A)',
        suggestion: 'Add onKeyDown handler for Enter/Space keys, or use <button> which handles this natively.',
      });
    }
  }

  // Check for tabIndex misuse
  const tabIndexes = content.match(/tabIndex=\{?["']?(-?\d+)["']?\}?/gi) || [];
  for (const match of tabIndexes) {
    const value = parseInt(match.match(/-?\d+/)[0], 10);
    if (value > 0) {
      issues.push({
        type: 'Keyboard',
        severity: 'medium',
        message: `tabIndex="${value}" disrupts natural tab order`,
        wcag: '2.4.3 Focus Order (Level A)',
        suggestion: 'Use tabIndex="0" to add to natural tab order, or tabIndex="-1" for programmatic focus only. Never use positive values.',
      });
    }
  }
}

function checkFocusIndicators(analysis, content, issues) {
  if (!analysis.states.focus && !analysis.states.focusVisible) {
    const hasInteractive = analysis.eventHandlers.length > 0 || analysis.formElements.length > 0;
    if (hasInteractive) {
      issues.push({
        type: 'Focus',
        severity: 'high',
        message: 'No focus styles found for interactive component',
        wcag: '2.4.7 Focus Visible (Level AA)',
        suggestion: 'Add :focus-visible styles with a visible outline (at least 2px solid, 3:1 contrast against background).',
      });
    }
  }

  // Check for outline: none without replacement
  if (/outline:\s*(?:none|0)/i.test(content) && !/outline.*focus/i.test(content)) {
    if (!/box-shadow.*focus/i.test(content) && !/ring/i.test(content)) {
      issues.push({
        type: 'Focus',
        severity: 'high',
        message: 'outline: none found without alternative focus indicator',
        wcag: '2.4.7 Focus Visible (Level AA)',
        suggestion: 'If removing the default outline, provide an alternative focus indicator (e.g., box-shadow, border, or custom outline).',
      });
    }
  }
}

function checkColorContrast(analysis, content, issues) {
  // Try to find foreground/background color pairs
  const bgColors = analysis.colors.filter(c =>
    /background|bg-/.test(c.property || '')
  );
  const fgColors = analysis.colors.filter(c =>
    /^color$|text-/.test(c.property || '')
  );

  for (const bg of bgColors) {
    for (const fg of fgColors) {
      try {
        const result = checkColorPair(fg.value, bg.value);
        if (result && !result.AA) {
          issues.push({
            type: 'Contrast',
            severity: 'high',
            message: `Insufficient contrast ratio: ${result.ratio.toFixed(2)}:1 (${fg.value} on ${bg.value})`,
            wcag: '1.4.3 Contrast (Minimum) (Level AA)',
            suggestion: `Normal text requires 4.5:1, large text requires 3:1. Current ratio is ${result.ratio.toFixed(2)}:1.`,
          });
        }
      } catch {
        // Skip unparseable colors
      }
    }
  }

  // Check for low-contrast placeholders (common issue)
  if (/placeholder/.test(content)) {
    issues.push({
      type: 'Contrast',
      severity: 'low',
      message: 'Placeholder text detected — verify contrast ratio',
      wcag: '1.4.3 Contrast (Minimum) (Level AA)',
      suggestion: 'Placeholder text must meet 4.5:1 contrast ratio. Consider using labels instead of relying on placeholders.',
    });
  }
}

function checkTouchTargets(analysis, issues) {
  const smallTargets = analysis.touchTargets.filter(t => !t.sufficient);
  for (const target of smallTargets) {
    issues.push({
      type: 'Touch Target',
      severity: 'medium',
      message: `${target.element} may have insufficient touch target size (~${target.estimatedSize}px)`,
      wcag: '2.5.8 Target Size (Minimum) (Level AA)',
      suggestion: 'Ensure interactive elements are at least 24x24px (WCAG 2.2) or 48x48px (recommended). Use padding to increase touch area.',
    });
  }
}

function checkAltText(analysis, issues) {
  const imagesWithoutAlt = analysis.images.filter(img => !img.hasAlt);
  for (const img of imagesWithoutAlt) {
    issues.push({
      type: 'Images',
      severity: 'high',
      message: `Image missing alt text${img.src ? `: ${path.basename(img.src)}` : ''}`,
      wcag: '1.1.1 Non-text Content (Level A)',
      suggestion: 'Add descriptive alt text, or alt="" if the image is purely decorative.',
    });
  }

  // Check for generic alt text
  const genericAlts = analysis.images.filter(img =>
    img.hasAlt && /^(image|photo|picture|icon|logo|img|banner)$/i.test((img.altText || '').trim())
  );
  for (const img of genericAlts) {
    issues.push({
      type: 'Images',
      severity: 'medium',
      message: `Non-descriptive alt text: "${img.altText}"`,
      wcag: '1.1.1 Non-text Content (Level A)',
      suggestion: 'Alt text should describe the content or function of the image, not just its type.',
    });
  }
}

function checkFormLabels(analysis, issues) {
  for (const form of analysis.formElements) {
    if (!form.hasLabel && !form.hasAriaLabel) {
      issues.push({
        type: 'Forms',
        severity: 'high',
        message: `${form.type || 'Input'} element without associated label`,
        wcag: '1.3.1 Info and Relationships (Level A)',
        suggestion: 'Associate a <label> with the input using htmlFor/for attribute, or add aria-label/aria-labelledby.',
      });
    }

    if (form.hasPlaceholder && !form.hasLabel && !form.hasAriaLabel) {
      issues.push({
        type: 'Forms',
        severity: 'high',
        message: 'Input relies on placeholder as only label',
        wcag: '3.3.2 Labels or Instructions (Level A)',
        suggestion: 'Placeholders disappear when typing and are not reliable labels. Use a visible <label> element.',
      });
    }
  }
}

function checkHeadingHierarchy(analysis, issues) {
  if (analysis.headings.length === 0) return;

  const levels = analysis.headings.map(h => h.level);

  // Check for skipped levels
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      issues.push({
        type: 'Structure',
        severity: 'medium',
        message: `Heading hierarchy skips from h${levels[i - 1]} to h${levels[i]}`,
        wcag: '1.3.1 Info and Relationships (Level A)',
        suggestion: 'Use sequential heading levels (h1 → h2 → h3). Don\'t skip levels.',
      });
      break;
    }
  }

  // Check for multiple h1s
  const h1Count = levels.filter(l => l === 1).length;
  if (h1Count > 1) {
    issues.push({
      type: 'Structure',
      severity: 'low',
      message: `${h1Count} h1 headings found in the same file`,
      wcag: '1.3.1 Info and Relationships (Level A)',
      suggestion: 'Components typically should not contain h1. Use h2+ and let the page provide the h1.',
    });
  }
}

function checkLandmarks(content, issues) {
  // Check for <main>, <nav>, <aside>, <header>, <footer> or ARIA landmarks
  const hasLandmarks = /role="(main|navigation|complementary|banner|contentinfo)"/.test(content) ||
    /<(main|nav|aside|header|footer)[\s>]/i.test(content);

  // Only flag for page-level components (skip small components)
  const lineCount = content.split('\n').length;
  if (lineCount > 100 && !hasLandmarks) {
    issues.push({
      type: 'Structure',
      severity: 'low',
      message: 'Large component without ARIA landmarks',
      wcag: '1.3.1 Info and Relationships (Level A)',
      suggestion: 'Use semantic HTML elements (<main>, <nav>, <aside>) or ARIA landmark roles for page regions.',
    });
  }
}

function checkReducedMotion(analysis, content, issues) {
  const hasAnimations = analysis.animations.transitions.length > 0 ||
    analysis.animations.keyframes.length > 0;

  if (hasAnimations) {
    const hasReducedMotion = /prefers-reduced-motion/i.test(content) ||
      /motion-safe:|motion-reduce:/i.test(content);

    if (!hasReducedMotion) {
      issues.push({
        type: 'Motion',
        severity: 'medium',
        message: 'Animations without prefers-reduced-motion support',
        wcag: '2.3.3 Animation from Interactions (Level AAA)',
        suggestion: 'Add @media (prefers-reduced-motion: reduce) to disable or simplify animations. In Tailwind, use motion-reduce: prefix.',
      });
    }
  }
}

function formatAccessibilityOutput(analysis, issues, guidance) {
  const lines = [];

  lines.push(`## Accessibility Review: ${path.basename(analysis.filePath)}`);
  lines.push('');

  // Summary
  const highCount = issues.filter(i => i.severity === 'high').length;
  const medCount = issues.filter(i => i.severity === 'medium').length;
  const lowCount = issues.filter(i => i.severity === 'low').length;

  if (issues.length === 0) {
    lines.push('No accessibility issues detected. Good work!');
    lines.push('');
    lines.push('*Note: Automated checks cannot catch all accessibility issues. Manual testing with screen readers and keyboard navigation is still recommended.*');
    return lines.join('\n');
  }

  lines.push(`**${issues.length} issue(s) found:** ${highCount} high, ${medCount} medium, ${lowCount} low`);
  lines.push('');

  // Group by type
  const byType = {};
  for (const issue of issues) {
    if (!byType[issue.type]) byType[issue.type] = [];
    byType[issue.type].push(issue);
  }

  // Sort types by highest severity issue
  const severityOrder = { high: 0, medium: 1, low: 2 };
  const sortedTypes = Object.entries(byType).sort(([, a], [, b]) => {
    const aMin = Math.min(...a.map(i => severityOrder[i.severity]));
    const bMin = Math.min(...b.map(i => severityOrder[i.severity]));
    return aMin - bMin;
  });

  for (const [type, typeIssues] of sortedTypes) {
    lines.push(`### ${type}`);
    lines.push('');
    for (const issue of typeIssues) {
      const icon = issue.severity === 'high' ? '[HIGH]' : issue.severity === 'medium' ? '[MEDIUM]' : '[LOW]';
      lines.push(`${icon} ${issue.message}`);
      lines.push(`  WCAG: ${issue.wcag}`);
      lines.push(`  → ${issue.suggestion}`);
      if (issue.code) {
        lines.push(`  Code: \`${issue.code}\``);
      }
      lines.push('');
    }
  }

  // Agent checklist
  if (guidance.checklist.length > 0) {
    lines.push('### Accessibility Checklist');
    lines.push('');
    for (const item of guidance.checklist.slice(0, 10)) {
      lines.push(`- [ ] ${item.item}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('*Automated checks cannot catch all accessibility issues. Test with screen readers (VoiceOver, NVDA) and keyboard navigation.*');

  return lines.join('\n');
}

module.exports = { TOOL_DEFINITION, handler };
