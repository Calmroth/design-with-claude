const AgentLoader = require('./agent-loader');

/**
 * Category boost maps — extra score when brief type matches agent category.
 */
const CATEGORY_BOOSTS = {
  landing: {
    'brand-identity': 3,
    'visual-design': 2,
    'core-design': 1
  },
  dashboard: {
    'product-design': 3,
    'core-design': 2,
    'interaction-design': 1
  },
  ecommerce: {
    'product-design': 3,
    'core-design': 2,
    'brand-identity': 1
  },
  blog: {
    'visual-design': 2,
    'brand-identity': 2,
    'core-design': 1
  },
  portfolio: {
    'visual-design': 3,
    'brand-identity': 2,
    'interaction-design': 1
  },
  marketing: {
    'brand-identity': 3,
    'visual-design': 2,
    'product-design': 1
  }
};

/**
 * Industry → agent name mappings for specialist boosts.
 */
const INDUSTRY_AGENT_MAP = {
  health: ['healthcare-ux', 'accessibility-specialist'],
  healthcare: ['healthcare-ux', 'accessibility-specialist'],
  medical: ['healthcare-ux', 'accessibility-specialist'],
  automotive: ['automotive-ux', 'interaction-designer'],
  car: ['automotive-ux'],
  gaming: ['game-ui-designer', 'interaction-designer'],
  game: ['game-ui-designer', 'interaction-designer'],
  vr: ['ar-vr-designer'],
  ar: ['ar-vr-designer'],
  metaverse: ['ar-vr-designer'],
  crypto: ['product-designer', 'dashboard-designer'],
  fintech: ['product-designer', 'dashboard-designer'],
  saas: ['product-designer', 'dashboard-designer', 'design-system-architect'],
  fashion: ['visual-designer', 'brand-strategist'],
  food: ['visual-designer', 'brand-strategist'],
  education: ['accessibility-specialist', 'ux-design-expert']
};

/**
 * Concern keywords → agent name mappings.
 */
const CONCERN_AGENT_MAP = {
  accessible: ['accessibility-specialist'],
  accessibility: ['accessibility-specialist'],
  wcag: ['accessibility-specialist'],
  'screen reader': ['accessibility-specialist'],
  responsive: ['web-designer', 'mobile-designer'],
  mobile: ['mobile-designer'],
  animation: ['motion-designer', 'interaction-designer'],
  motion: ['motion-designer'],
  transition: ['motion-designer', 'interaction-designer'],
  brand: ['brand-strategist', 'brand-guidelines-creator'],
  branding: ['brand-strategist', 'brand-guidelines-creator'],
  logo: ['logo-designer', 'brand-strategist'],
  'dark mode': ['ui-designer', 'design-system-architect'],
  'dark-mode': ['ui-designer', 'design-system-architect'],
  'design system': ['design-system-architect'],
  tokens: ['design-system-architect'],
  icon: ['icon-designer'],
  icons: ['icon-designer'],
  illustration: ['illustration-designer'],
  voice: ['voice-ui-designer'],
  gesture: ['gesture-designer'],
  prototype: ['prototyping-expert'],
  research: ['ux-researcher'],
  'user research': ['ux-researcher'],
  navigation: ['information-architect'],
  'information architecture': ['information-architect'],
  service: ['service-designer'],
  strategy: ['design-strategist'],
  data: ['dashboard-designer'],
  analytics: ['dashboard-designer'],
  dashboard: ['dashboard-designer'],
  chart: ['dashboard-designer'],
  marketing: ['marketing-designer'],
  implementation: ['design-implementation-guide']
};

const DEFAULTS = {
  maxAgents: 5,
  minScore: 3,
  alwaysInclude: ['ui-designer', 'design-system-architect']
};

class AgentSelector {
  constructor(options = {}) {
    this.loader = options.loader || new AgentLoader();
    this.maxAgents = options.maxAgents || DEFAULTS.maxAgents;
    this.minScore = options.minScore || DEFAULTS.minScore;
    this.alwaysInclude = options.alwaysInclude || DEFAULTS.alwaysInclude;
  }

  /**
   * Select the most relevant agents for a parsed brief.
   *
   * @param {Object} parsedBrief - Output from BriefParser.parse()
   * @returns {SelectedAgent[]} - Sorted by score descending, capped at maxAgents
   */
  async select(parsedBrief) {
    const allAgents = await this.loader.loadAll();
    const scores = new Map(); // agent name → score

    // Initialize all agents with score 0
    for (const agent of allAgents) {
      scores.set(agent.name, 0);
    }

    // 1. Expertise keyword matching
    const briefWords = this._getBriefWords(parsedBrief);
    for (const agent of allAgents) {
      let keywordScore = 0;
      const searchableText = [
        agent.description,
        ...agent.coreExpertise,
        agent.intro
      ].join(' ').toLowerCase();

      for (const word of briefWords) {
        if (word.length < 3) continue;
        if (searchableText.includes(word)) {
          keywordScore += 1;
        }
      }
      scores.set(agent.name, scores.get(agent.name) + keywordScore);
    }

    // 2. Category boosts
    const typeBoosts = CATEGORY_BOOSTS[parsedBrief.type] || {};
    for (const agent of allAgents) {
      const boost = typeBoosts[agent.category] || 0;
      if (boost) {
        scores.set(agent.name, scores.get(agent.name) + boost);
      }
    }

    // 3. Industry mapping boosts
    const industry = parsedBrief.industry || '';
    const industryAgents = INDUSTRY_AGENT_MAP[industry] || [];
    for (const agentName of industryAgents) {
      if (scores.has(agentName)) {
        scores.set(agentName, scores.get(agentName) + 4);
      }
    }

    // 4. Concern-based boosts (from brief words)
    const briefText = parsedBrief.originalBrief.toLowerCase();
    for (const [concern, agentNames] of Object.entries(CONCERN_AGENT_MAP)) {
      if (briefText.includes(concern)) {
        for (const agentName of agentNames) {
          if (scores.has(agentName)) {
            scores.set(agentName, scores.get(agentName) + 5);
          }
        }
      }
    }

    // 5. Always-include agents get a strong baseline boost to ensure selection
    for (const agentName of this.alwaysInclude) {
      if (scores.has(agentName)) {
        scores.set(agentName, scores.get(agentName) + this.minScore + 4);
      }
    }

    // 6. Cross-reference expansion: if a high-scoring agent references another, boost it
    const sortedNames = [...scores.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.maxAgents)
      .map(([name]) => name);

    for (const name of sortedNames) {
      const agent = allAgents.find(a => a.name === name);
      if (!agent) continue;
      for (const ref of agent.crossReferences) {
        if (scores.has(ref) && !sortedNames.includes(ref)) {
          scores.set(ref, scores.get(ref) + 2);
        }
      }
    }

    // Build result: sort by score, apply minScore filter, cap at maxAgents
    const agentMap = new Map(allAgents.map(a => [a.name, a]));
    const results = [...scores.entries()]
      .filter(([, score]) => score >= this.minScore)
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.maxAgents)
      .map(([name, score], index) => ({
        agent: agentMap.get(name),
        score,
        role: index === 0 ? 'primary' : index < 3 ? 'supporting' : 'specialist'
      }));

    return results;
  }

  /**
   * Extract scoring-relevant words from the parsed brief.
   */
  _getBriefWords(parsedBrief) {
    const text = [
      parsedBrief.originalBrief,
      parsedBrief.style,
      parsedBrief.type,
      parsedBrief.industry,
      ...(parsedBrief.features || []),
      ...(parsedBrief.concerns || [])
    ].filter(Boolean).join(' ');

    return [...new Set(
      text.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 3)
    )];
  }
}

module.exports = AgentSelector;
module.exports.CATEGORY_BOOSTS = CATEGORY_BOOSTS;
module.exports.INDUSTRY_AGENT_MAP = INDUSTRY_AGENT_MAP;
module.exports.CONCERN_AGENT_MAP = CONCERN_AGENT_MAP;
