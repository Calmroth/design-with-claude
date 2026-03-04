/**
 * Agent Selector - Scores and selects relevant design agents based on context.
 *
 * Uses a multi-factor scoring algorithm to determine which design agents
 * are most relevant for a given project context: keyword matching,
 * industry matching, concern matching, and component context analysis.
 *
 * @module agent-selector
 */

// ---------------------------------------------------------------------------
// Scoring Constants
// ---------------------------------------------------------------------------

/** Points awarded for an exact keyword match */
const EXACT_KEYWORD_SCORE = 3;

/** Points awarded for a partial keyword match */
const PARTIAL_KEYWORD_SCORE = 1;

/** Points awarded when agent name contains an industry term */
const INDUSTRY_MATCH_SCORE = 5;

/** Points awarded for each concern that matches agent keywords */
const CONCERN_MATCH_SCORE = 4;

/** Points awarded when agent expertise relates to detected component type */
const COMPONENT_CONTEXT_SCORE = 3;

/** Base score always given to accessibility-specialist */
const ACCESSIBILITY_BASE_SCORE = 2;

/** Maximum number of supporting agents to return */
const MAX_SUPPORTING_AGENTS = 3;

// ---------------------------------------------------------------------------
// Detection helpers
// ---------------------------------------------------------------------------

/**
 * Detect if content contains dark mode indicators.
 * @param {string} content - File content to scan
 * @returns {boolean}
 */
function hasDarkModeIndicators(content) {
  if (!content) return false;
  const indicators = [
    /dark[:-]mode/i,
    /\bdark:/,           // Tailwind dark: prefix
    /prefers-color-scheme\s*:\s*dark/i,
    /theme.*dark/i,
    /colorScheme.*dark/i,
    /\bDarkMode\b/,
    /\bdarkTheme\b/,
    /data-theme\s*=\s*["']dark/i,
    /\.dark\s*\{/,       // .dark {} CSS class
  ];
  return indicators.some(re => re.test(content));
}

/**
 * Detect if content contains form elements.
 * @param {string} content - File content to scan
 * @returns {boolean}
 */
function hasFormElements(content) {
  if (!content) return false;
  const indicators = [
    /<form\b/i,
    /<input\b/i,
    /<textarea\b/i,
    /<select\b/i,
    /\bFormik\b/,
    /\buseForm\b/,
    /\breact-hook-form\b/,
    /\bvalidation\b/i,
    /\bsubmit\b/i,
    /onChange\s*=/,
    /onSubmit\s*=/,
  ];
  return indicators.some(re => re.test(content));
}

/**
 * Detect if content contains animations or transitions.
 * @param {string} content - File content to scan
 * @returns {boolean}
 */
function hasAnimations(content) {
  if (!content) return false;
  const indicators = [
    /transition\s*:/,
    /animation\s*:/,
    /@keyframes\b/,
    /\banimate-/,
    /\btransition-/,
    /\bduration-/,
    /framer-motion/i,
    /react-spring/i,
    /\bgsap\b/i,
    /\bLottie\b/i,
    /\buseSpring\b/,
    /\buseTransition\b/,
    /\bmotion\./,
  ];
  return indicators.some(re => re.test(content));
}

// ---------------------------------------------------------------------------
// Scoring Functions
// ---------------------------------------------------------------------------

/**
 * Calculate keyword match score for an agent against context text.
 * @param {string[]} agentKeywords - Agent's keywords array
 * @param {string} text - Text to match against
 * @returns {number} Score
 */
function scoreKeywordMatch(agentKeywords, text) {
  if (!agentKeywords || !text) return 0;

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/[\s,;.!?()[\]{}<>]+/).filter(Boolean);
  let score = 0;

  for (const keyword of agentKeywords) {
    const kw = keyword.toLowerCase();

    // Exact match: keyword appears as a standalone word
    if (words.includes(kw)) {
      score += EXACT_KEYWORD_SCORE;
    } else if (lowerText.includes(kw)) {
      // Partial match: keyword appears as substring
      score += PARTIAL_KEYWORD_SCORE;
    }
  }

  return score;
}

/**
 * Calculate industry match score.
 * @param {string} agentName - Agent file name
 * @param {string[]} agentKeywords - Agent keywords
 * @param {string} industry - Detected industry
 * @returns {number} Score
 */
function scoreIndustryMatch(agentName, agentKeywords, industry) {
  if (!industry) return 0;

  const lowerName = agentName.toLowerCase();
  const lowerIndustry = industry.toLowerCase();

  // Direct name match
  if (lowerName.includes(lowerIndustry)) {
    return INDUSTRY_MATCH_SCORE;
  }

  // Check related industry terms
  const industryTerms = {
    healthcare: ['medical', 'health', 'clinical', 'patient', 'hospital', 'pharma'],
    finance: ['financial', 'banking', 'fintech', 'payment', 'trading', 'investment'],
    education: ['learning', 'educational', 'academic', 'student', 'teaching', 'school'],
    retail: ['ecommerce', 'shopping', 'store', 'product', 'cart', 'checkout'],
    enterprise: ['b2b', 'saas', 'dashboard', 'admin', 'corporate', 'business'],
    gaming: ['game', 'interactive', 'entertainment', 'play'],
    travel: ['booking', 'hospitality', 'flight', 'hotel', 'tourism'],
    media: ['content', 'publishing', 'news', 'editorial', 'blog'],
    social: ['community', 'network', 'messaging', 'chat', 'feed'],
  };

  const relatedTerms = industryTerms[lowerIndustry] || [lowerIndustry];

  for (const term of relatedTerms) {
    if (lowerName.includes(term)) return INDUSTRY_MATCH_SCORE;
    if (agentKeywords && agentKeywords.some(k => k.includes(term))) {
      return INDUSTRY_MATCH_SCORE;
    }
  }

  return 0;
}

/**
 * Calculate concern match score.
 * @param {string[]} agentKeywords - Agent keywords
 * @param {string[]} concerns - User's design concerns
 * @returns {number} Score
 */
function scoreConcernMatch(agentKeywords, concerns) {
  if (!agentKeywords || !concerns || concerns.length === 0) return 0;

  let score = 0;
  const lowerKeywords = agentKeywords.map(k => k.toLowerCase());

  for (const concern of concerns) {
    const lowerConcern = concern.toLowerCase();

    // Exact keyword match for concern
    if (lowerKeywords.includes(lowerConcern)) {
      score += CONCERN_MATCH_SCORE;
    } else if (lowerKeywords.some(k => k.includes(lowerConcern) || lowerConcern.includes(k))) {
      // Partial match
      score += Math.floor(CONCERN_MATCH_SCORE / 2);
    }
  }

  return score;
}

/**
 * Calculate component context score.
 * @param {string[]} agentExpertise - Agent expertise list
 * @param {string} componentType - Detected component type
 * @returns {number} Score
 */
function scoreComponentContext(agentExpertise, componentType) {
  if (!agentExpertise || !componentType) return 0;

  const lowerType = componentType.toLowerCase();
  const componentMappings = {
    button: ['interactive', 'component', 'click', 'cta', 'action', 'touch'],
    form: ['form', 'input', 'validation', 'field', 'data entry'],
    modal: ['modal', 'dialog', 'overlay', 'popup', 'focus trap'],
    navigation: ['navigation', 'menu', 'nav', 'routing', 'sidebar', 'header'],
    table: ['table', 'data', 'grid', 'list', 'sort', 'filter', 'dashboard'],
    card: ['card', 'tile', 'container', 'layout', 'content'],
    dropdown: ['dropdown', 'select', 'menu', 'popover', 'combobox'],
    toast: ['notification', 'toast', 'alert', 'message', 'feedback'],
    tabs: ['tabs', 'tab', 'panel', 'navigation', 'section'],
    carousel: ['carousel', 'slider', 'gallery', 'image', 'swipe'],
    chart: ['chart', 'graph', 'visualization', 'data', 'analytics'],
    avatar: ['avatar', 'profile', 'user', 'image', 'identity'],
    badge: ['badge', 'tag', 'label', 'status', 'indicator'],
    tooltip: ['tooltip', 'popover', 'hint', 'help', 'info'],
    accordion: ['accordion', 'collapse', 'expand', 'disclosure', 'panel'],
  };

  const relevantTerms = componentMappings[lowerType] || [lowerType];

  for (const expertise of agentExpertise) {
    const lowerExpertise = expertise.toLowerCase();
    for (const term of relevantTerms) {
      if (lowerExpertise.includes(term)) {
        return COMPONENT_CONTEXT_SCORE;
      }
    }
  }

  return 0;
}

// ---------------------------------------------------------------------------
// Main Selection Function
// ---------------------------------------------------------------------------

/**
 * Score and select the most relevant design agents for a given context.
 *
 * Scoring algorithm:
 * 1. Keyword matching: +3 exact, +1 partial against agent keywords
 * 2. Industry matching: +5 if agent name/keywords match industry
 * 3. Concern matching: +4 for each concern matching agent keywords
 * 4. Component context: +3 if agent expertise relates to component type
 * 5. Accessibility specialist always gets +2 base score
 *
 * Special rules:
 * - accessibility-specialist is always included as supporting if not primary
 * - dark-mode-specialist boosted if content has dark mode indicators
 * - form-design-specialist boosted if forms detected
 * - animation-motion-designer boosted if transitions/animations detected
 *
 * @param {{ description?: string, concerns?: string[], industry?: string, componentType?: string, framework?: string, fileContent?: string }} context
 * @param {Map<string, object>} agents - Map of agent name to parsed agent object
 * @returns {{ primary: object, supporting: object[], scores: { name: string, score: number }[] }}
 */
function selectAgents(context, agents) {
  if (!agents || agents.size === 0) {
    throw new Error('No agents available for selection');
  }

  const {
    description = '',
    concerns = [],
    industry = '',
    componentType = '',
    framework = '',
    fileContent = '',
  } = context || {};

  // Build a combined text string for keyword matching
  const combinedText = [description, framework, componentType, ...concerns].filter(Boolean).join(' ');

  const scores = [];

  for (const [name, agent] of agents) {
    let score = 0;

    // 1. Keyword matching against combined context text
    score += scoreKeywordMatch(agent.keywords, combinedText);

    // 2. Industry matching
    score += scoreIndustryMatch(name, agent.keywords, industry);

    // 3. Concern matching
    score += scoreConcernMatch(agent.keywords, concerns);

    // 4. Component context matching
    score += scoreComponentContext(agent.expertise, componentType);

    // 5. Accessibility specialist always gets base score boost
    if (name.includes('accessibility') || name.includes('a11y')) {
      score += ACCESSIBILITY_BASE_SCORE;
    }

    // Special boosting rules based on content analysis
    if (fileContent) {
      // Dark mode specialist boost
      if ((name.includes('dark') || name.includes('theme')) && hasDarkModeIndicators(fileContent)) {
        score += CONCERN_MATCH_SCORE;
      }

      // Form design specialist boost
      if ((name.includes('form') || name.includes('input')) && hasFormElements(fileContent)) {
        score += CONCERN_MATCH_SCORE;
      }

      // Animation/motion designer boost
      if ((name.includes('animation') || name.includes('motion')) && hasAnimations(fileContent)) {
        score += CONCERN_MATCH_SCORE;
      }
    }

    // Also keyword-match against file content if provided
    if (fileContent && agent.keywords) {
      score += Math.floor(scoreKeywordMatch(agent.keywords, fileContent) / 2);
    }

    scores.push({ name, score, agent });
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // Primary agent is the top scorer
  const primary = scores[0];

  // Build supporting agents list
  const supporting = [];
  let accessibilityIncluded = false;

  // Check if primary is accessibility specialist
  if (primary.name.includes('accessibility') || primary.name.includes('a11y')) {
    accessibilityIncluded = true;
  }

  // Add top supporting agents (excluding primary)
  for (let i = 1; i < scores.length && supporting.length < MAX_SUPPORTING_AGENTS; i++) {
    const candidate = scores[i];

    // Skip agents with zero score (unless it's accessibility specialist)
    const isAccessibility = candidate.name.includes('accessibility') || candidate.name.includes('a11y');
    if (candidate.score === 0 && !isAccessibility) continue;

    supporting.push(candidate.agent);

    if (isAccessibility) accessibilityIncluded = true;
  }

  // Ensure accessibility specialist is always included
  if (!accessibilityIncluded) {
    const accessibilityAgent = scores.find(
      s => s.name.includes('accessibility') || s.name.includes('a11y')
    );
    if (accessibilityAgent && accessibilityAgent.name !== primary.name) {
      // Replace the lowest-scoring supporting agent or just add it
      if (supporting.length >= MAX_SUPPORTING_AGENTS) {
        supporting[supporting.length - 1] = accessibilityAgent.agent;
      } else {
        supporting.push(accessibilityAgent.agent);
      }
    }
  }

  return {
    primary: primary.agent,
    supporting,
    scores: scores.map(s => ({ name: s.name, score: s.score })),
  };
}

module.exports = {
  selectAgents,
  // Export scoring functions for testing
  scoreKeywordMatch,
  scoreIndustryMatch,
  scoreConcernMatch,
  scoreComponentContext,
  hasDarkModeIndicators,
  hasFormElements,
  hasAnimations,
};
