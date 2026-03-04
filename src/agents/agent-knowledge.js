/**
 * Agent Knowledge - Extracts specific guidance from selected design agents.
 *
 * Takes selected agents (primary + supporting) and a project context,
 * then filters, merges, and deduplicates their guidance into a unified
 * set of recommendations, checklist items, anti-patterns, and principles.
 *
 * @module agent-knowledge
 */

// ---------------------------------------------------------------------------
// Priority Levels
// ---------------------------------------------------------------------------

/** @enum {string} */
const PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// ---------------------------------------------------------------------------
// Relevance Filtering
// ---------------------------------------------------------------------------

/**
 * Determine if a text string is relevant to the given context.
 * Uses keyword overlap to estimate relevance.
 *
 * @param {string} text - Text to evaluate
 * @param {{ description?: string, concerns?: string[], componentType?: string, industry?: string }} context
 * @returns {boolean}
 */
function isRelevant(text, context) {
  if (!text) return false;
  if (!context) return true; // No context means include everything

  const lowerText = text.toLowerCase();

  // Always relevant if it mentions accessibility (universal concern)
  if (/\baccessib/i.test(lowerText) || /\bwcag\b/i.test(lowerText) || /\baria\b/i.test(lowerText)) {
    return true;
  }

  // Check against concerns
  if (context.concerns && context.concerns.length > 0) {
    for (const concern of context.concerns) {
      if (lowerText.includes(concern.toLowerCase())) return true;
    }
  }

  // Check against component type
  if (context.componentType && lowerText.includes(context.componentType.toLowerCase())) {
    return true;
  }

  // Check against description keywords
  if (context.description) {
    const descWords = context.description.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const matchCount = descWords.filter(w => lowerText.includes(w)).length;
    if (matchCount >= 2) return true;
  }

  // Check against industry
  if (context.industry && lowerText.includes(context.industry.toLowerCase())) {
    return true;
  }

  // If no specific filter matched but text is short, include it anyway
  // (short checklist items are usually universally applicable)
  if (text.length < 80) return true;

  return false;
}

/**
 * Compute a similarity score between two text strings using word overlap.
 * Returns a value between 0 and 1.
 *
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Similarity score (0-1)
 */
function textSimilarity(a, b) {
  if (!a || !b) return 0;

  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) intersection++;
  }

  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union; // Jaccard similarity
}

/**
 * Deduplicate a list of text items, removing entries that are too similar.
 * @param {{ text: string, source: string }[]} items - Items to deduplicate
 * @param {number} [threshold=0.6] - Similarity threshold for deduplication
 * @returns {{ text: string, source: string }[]}
 */
function deduplicateItems(items, threshold) {
  const similarityThreshold = threshold || 0.6;
  const unique = [];

  for (const item of items) {
    const isDuplicate = unique.some(
      existing => textSimilarity(existing.text, item.text) >= similarityThreshold
    );
    if (!isDuplicate) {
      unique.push(item);
    }
  }

  return unique;
}

// ---------------------------------------------------------------------------
// Guidance Extraction
// ---------------------------------------------------------------------------

/**
 * Extract guidelines content from an agent's guidelines object.
 * Filters to only relevant subsections based on context.
 *
 * @param {Record<string, string>} guidelines - Agent guidelines (subsection key -> content)
 * @param {string} agentName - Name of the agent
 * @param {object} context - Project context
 * @returns {{ text: string, source: string, priority: string }[]}
 */
function extractGuidelinesRecommendations(guidelines, agentName, context) {
  const recommendations = [];

  if (!guidelines) return recommendations;

  for (const [subsection, content] of Object.entries(guidelines)) {
    if (!content || !content.trim()) continue;

    // Split content into individual points (by line or bullet)
    const points = content
      .split('\n')
      .map(line => line.replace(/^\s*[-*]\s*/, '').trim())
      .filter(line => line.length > 0);

    for (const point of points) {
      if (isRelevant(point, context)) {
        // Determine priority based on keywords in the content
        let priority = PRIORITY.MEDIUM;
        if (/\bmust\b|\brequired\b|\bcritical\b|\bessential\b|\balways\b/i.test(point)) {
          priority = PRIORITY.HIGH;
        } else if (/\bconsider\b|\bmay\b|\boptional\b|\bnice.to.have\b/i.test(point)) {
          priority = PRIORITY.LOW;
        }

        recommendations.push({
          text: `According to ${agentName}: ${point}`,
          source: agentName,
          priority,
        });
      }
    }
  }

  return recommendations;
}

/**
 * Extract checklist items from an agent.
 * @param {{ text: string, checked: boolean }[]} checklist - Agent checklist
 * @param {string} agentName - Name of the agent
 * @param {object} context - Project context
 * @returns {{ item: string, source: string, category: string }[]}
 */
function extractChecklistItems(checklist, agentName, context) {
  const items = [];

  if (!checklist) return items;

  for (const check of checklist) {
    if (isRelevant(check.text, context)) {
      // Infer category from the checklist item text
      let category = 'general';
      const lowerText = check.text.toLowerCase();

      if (/\bcolor\b|\bcontrast\b|\bpalette\b/i.test(lowerText)) {
        category = 'color';
      } else if (/\bspacing\b|\bpadding\b|\bmargin\b|\blayout\b|\balignment\b/i.test(lowerText)) {
        category = 'spacing';
      } else if (/\bfont\b|\btypograph\b|\btext\b|\bheading\b|\breadab/i.test(lowerText)) {
        category = 'typography';
      } else if (/\banimation\b|\btransition\b|\bmotion\b/i.test(lowerText)) {
        category = 'motion';
      } else if (/\baccessib\b|\baria\b|\bwcag\b|\bscreen.reader\b|\bkeyboard\b/i.test(lowerText)) {
        category = 'accessibility';
      } else if (/\brespons\b|\bmobile\b|\bbreakpoint\b|\btouch\b/i.test(lowerText)) {
        category = 'responsive';
      } else if (/\bperform\b|\boptimiz\b|\bload\b|\bspeed\b|\bbundle\b/i.test(lowerText)) {
        category = 'performance';
      } else if (/\bdark\b|\btheme\b|\blight\b|\bmode\b/i.test(lowerText)) {
        category = 'theming';
      } else if (/\bform\b|\binput\b|\bvalidat\b|\blabel\b|\bfield\b/i.test(lowerText)) {
        category = 'forms';
      } else if (/\bcomponent\b|\breusab\b|\bpattern\b|\bconsisten/i.test(lowerText)) {
        category = 'components';
      } else if (/\bstate\b|\berror\b|\bloading\b|\bempty\b|\bfeedback\b/i.test(lowerText)) {
        category = 'states';
      }

      items.push({
        item: check.text,
        source: agentName,
        category,
      });
    }
  }

  return items;
}

/**
 * Extract anti-patterns from an agent.
 * @param {string[]} antiPatterns - Agent anti-patterns
 * @param {string} agentName - Name of the agent
 * @returns {{ pattern: string, source: string }[]}
 */
function extractAntiPatterns(antiPatterns, agentName) {
  if (!antiPatterns) return [];

  return antiPatterns.map(pattern => ({
    pattern: pattern,
    source: agentName,
  }));
}

/**
 * Extract principles from an agent.
 * @param {{ number: number, title: string, description: string }[]} principles - Agent principles
 * @param {string} agentName - Name of the agent
 * @returns {{ text: string, source: string }[]}
 */
function extractPrinciples(principles, agentName) {
  if (!principles) return [];

  return principles.map(p => ({
    text: p.description ? `${p.title}: ${p.description}` : p.title,
    source: agentName,
  }));
}

// ---------------------------------------------------------------------------
// Main Extraction Function
// ---------------------------------------------------------------------------

/**
 * Extract unified guidance from selected agents (primary + supporting).
 *
 * Filters agent guidelines to only relevant subsections,
 * merges checklists from all selected agents, deduplicates similar
 * recommendations, and adds agent attribution.
 *
 * @param {{ primary: object, supporting: object[] }} agents - Selected agents
 * @param {{ description?: string, concerns?: string[], componentType?: string, industry?: string }} context - Project context
 * @returns {{ recommendations: { text: string, source: string, priority: string }[], checklist: { item: string, source: string, category: string }[], antiPatterns: { pattern: string, source: string }[], principles: { text: string, source: string }[] }}
 */
function extractGuidance(agents, context) {
  if (!agents || !agents.primary) {
    throw new Error('No agents provided for guidance extraction');
  }

  const allAgents = [agents.primary, ...(agents.supporting || [])];
  const ctx = context || {};

  let allRecommendations = [];
  let allChecklist = [];
  let allAntiPatterns = [];
  let allPrinciples = [];

  for (let i = 0; i < allAgents.length; i++) {
    const agent = allAgents[i];
    if (!agent) continue;

    const agentName = agent.name || `agent-${i}`;

    // Extract recommendations from guidelines
    const recommendations = extractGuidelinesRecommendations(
      agent.guidelines,
      agentName,
      ctx
    );

    // Boost primary agent's recommendations to high priority
    if (i === 0) {
      for (const rec of recommendations) {
        if (rec.priority === PRIORITY.MEDIUM) {
          rec.priority = PRIORITY.HIGH;
        }
      }
    }

    allRecommendations.push(...recommendations);

    // Extract checklist items
    allChecklist.push(...extractChecklistItems(agent.checklist, agentName, ctx));

    // Extract anti-patterns
    allAntiPatterns.push(...extractAntiPatterns(agent.antiPatterns, agentName));

    // Extract principles
    allPrinciples.push(...extractPrinciples(agent.principles, agentName));
  }

  // Deduplicate recommendations
  const dedupedRecs = deduplicateItems(
    allRecommendations.map(r => ({ text: r.text, source: r.source, extra: r })),
    0.6
  ).map(d => d.extra);

  // Deduplicate checklist items
  const dedupedChecklist = deduplicateItems(
    allChecklist.map(c => ({ text: c.item, source: c.source, extra: c })),
    0.6
  ).map(d => d.extra);

  // Deduplicate anti-patterns
  const dedupedAntiPatterns = deduplicateItems(
    allAntiPatterns.map(a => ({ text: a.pattern, source: a.source, extra: a })),
    0.6
  ).map(d => d.extra);

  // Deduplicate principles
  const dedupedPrinciples = deduplicateItems(allPrinciples, 0.6);

  // Sort recommendations by priority
  const priorityOrder = { [PRIORITY.HIGH]: 0, [PRIORITY.MEDIUM]: 1, [PRIORITY.LOW]: 2 };
  dedupedRecs.sort((a, b) => (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1));

  // Sort checklist by category for better organization
  dedupedChecklist.sort((a, b) => a.category.localeCompare(b.category));

  return {
    recommendations: dedupedRecs,
    checklist: dedupedChecklist,
    antiPatterns: dedupedAntiPatterns,
    principles: dedupedPrinciples,
  };
}

module.exports = {
  extractGuidance,
  // Export utilities for testing
  isRelevant,
  textSimilarity,
  deduplicateItems,
  extractGuidelinesRecommendations,
  extractChecklistItems,
  extractAntiPatterns,
  extractPrinciples,
};
