/**
 * AgentKnowledge — transforms selected agents' content into structured
 * guidance that generators can consume deterministically.
 */

/**
 * Maps agent names to the guidance fields they can populate.
 * Each entry is a function that reads the agent's parsed data and returns
 * partial guidance to be merged into the final AgentGuidance object.
 */
const EXTRACTION_MAP = {
  'ui-designer': (agent) => ({
    colorGuidance: {
      contrast: 'high',
      darkMode: agentMentions(agent, ['dark mode', 'theming'])
    },
    typographyGuidance: {
      style: 'modern',
      scale: extractScaleHint(agent)
    },
    layoutGuidance: {
      gridColumns: 12,
      responsiveBreakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' }
    },
    componentGuidance: {
      borderRadius: 'md',
      accessibilityRequirements: []
    }
  }),

  'visual-designer': (agent) => ({
    colorGuidance: {
      mood: extractMoodFromExpertise(agent),
      contrast: 'high'
    },
    typographyGuidance: {
      style: 'expressive'
    }
  }),

  'brand-strategist': (agent) => ({
    colorGuidance: {
      mood: 'brand-aligned'
    },
    typographyGuidance: {
      style: 'distinctive'
    }
  }),

  'design-system-architect': (agent) => ({
    componentGuidance: {
      borderRadius: 'md',
      shadowDepth: 'layered',
      buttonVariants: ['primary', 'secondary', 'ghost', 'outline', 'destructive']
    },
    layoutGuidance: {
      maxWidth: '1280px',
      gutterSize: '24px'
    }
  }),

  'accessibility-specialist': (agent) => ({
    colorGuidance: {
      contrast: 'AAA'
    },
    componentGuidance: {
      accessibilityRequirements: [
        'ARIA labels on all interactive elements',
        'Keyboard navigation support',
        'Focus indicators visible',
        'Color contrast ratio >= 4.5:1',
        'Touch targets >= 44px'
      ],
      borderRadius: 'md'
    }
  }),

  'motion-designer': (agent) => ({
    componentGuidance: {
      animationDurations: {
        micro: '150ms',
        short: '200ms',
        medium: '300ms',
        long: '400ms'
      },
      transitions: {
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        hover: '150ms ease-in-out',
        expand: '300ms ease-out'
      }
    }
  }),

  'dashboard-designer': (agent) => ({
    layoutGuidance: {
      gridColumns: 12,
      maxWidth: '1440px',
      gutterSize: '24px',
      responsiveBreakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1440px' }
    },
    componentGuidance: {
      shadowDepth: 'subtle',
      borderRadius: 'lg'
    }
  }),

  'mobile-designer': (agent) => ({
    layoutGuidance: {
      responsiveBreakpoints: { sm: '320px', md: '375px', lg: '414px', xl: '768px' }
    },
    componentGuidance: {
      borderRadius: 'lg',
      accessibilityRequirements: ['Touch targets >= 44px']
    }
  }),

  'web-designer': (agent) => ({
    layoutGuidance: {
      gridColumns: 12,
      maxWidth: '1280px',
      gutterSize: '24px'
    }
  }),

  'healthcare-ux': (agent) => ({
    colorGuidance: {
      contrast: 'AAA',
      mood: 'clinical-trustworthy'
    },
    componentGuidance: {
      accessibilityRequirements: [
        'HIPAA-compliant data display',
        'High contrast mode support',
        'Screen reader optimized',
        'Error prevention for critical actions'
      ],
      borderRadius: 'md'
    }
  }),

  'interaction-designer': (agent) => ({
    componentGuidance: {
      animationDurations: {
        micro: '150ms',
        short: '250ms',
        medium: '350ms'
      }
    }
  }),

  'icon-designer': (agent) => ({
    componentGuidance: {
      iconStyle: 'consistent-stroke'
    }
  }),

  'game-ui-designer': (agent) => ({
    colorGuidance: {
      mood: 'vibrant-immersive'
    },
    componentGuidance: {
      animationDurations: {
        micro: '100ms',
        short: '150ms',
        medium: '250ms'
      }
    }
  }),

  'product-designer': (agent) => ({
    layoutGuidance: {
      maxWidth: '1280px'
    }
  })
};

/**
 * Check if an agent's expertise or sections mention specific terms.
 */
function agentMentions(agent, terms) {
  const text = [agent.intro, ...agent.coreExpertise, ...agent.bestPractices]
    .join(' ').toLowerCase();
  return terms.some(t => text.includes(t.toLowerCase()));
}

/**
 * Extract a typography scale hint from an agent's content.
 */
function extractScaleHint(agent) {
  const text = agent.rawMarkdown.toLowerCase();
  if (text.includes('1.5') || text.includes('major third')) return 'major-third';
  if (text.includes('1.33') || text.includes('perfect fourth')) return 'perfect-fourth';
  if (text.includes('1.25') || text.includes('minor third')) return 'minor-third';
  return 'default';
}

/**
 * Derive a mood hint from a visual-design agent's expertise list.
 */
function extractMoodFromExpertise(agent) {
  const text = agent.coreExpertise.join(' ').toLowerCase();
  if (text.includes('storytelling') || text.includes('narrative')) return 'narrative';
  if (text.includes('minimal')) return 'minimal';
  if (text.includes('bold') || text.includes('vibrant')) return 'vibrant';
  return 'balanced';
}

/**
 * Deep-merge two guidance objects. Arrays are concatenated and de-duped.
 */
function mergeGuidance(base, patch) {
  const result = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      result[key] = [...new Set([...(base[key] || []), ...value])];
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      result[key] = mergeGuidance(base[key] || {}, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

class AgentKnowledge {
  /**
   * Extract structured guidance from an array of selected agents.
   *
   * @param {SelectedAgent[]} selectedAgents - Output from AgentSelector.select()
   * @returns {AgentGuidance}
   */
  extract(selectedAgents) {
    let guidance = {
      colorGuidance: {},
      typographyGuidance: {},
      componentGuidance: {},
      layoutGuidance: {},
      bestPractices: [],
      agentNotes: []
    };

    for (const { agent, role } of selectedAgents) {
      const extractor = EXTRACTION_MAP[agent.name];

      if (extractor) {
        const partial = extractor(agent);
        guidance = mergeGuidance(guidance, partial);
      }

      // Collect best practices from all selected agents
      if (agent.bestPractices && agent.bestPractices.length > 0) {
        guidance.bestPractices.push(...agent.bestPractices.slice(0, 3));
      }

      // Add a short note per agent
      guidance.agentNotes.push({
        agent: agent.name,
        role,
        note: agent.intro.slice(0, 150)
      });
    }

    // De-dup best practices
    guidance.bestPractices = [...new Set(guidance.bestPractices)];

    return guidance;
  }
}

module.exports = AgentKnowledge;
module.exports.mergeGuidance = mergeGuidance;
module.exports.EXTRACTION_MAP = EXTRACTION_MAP;
