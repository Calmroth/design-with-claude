const path = require('path');
const AgentSelector = require('../src/agents/agent-selector');
const AgentLoader = require('../src/agents/agent-loader');

const AGENTS_DIR = path.join(__dirname, '..', 'agents');

describe('AgentSelector', () => {
  const loader = new AgentLoader(AGENTS_DIR);
  const selector = new AgentSelector({ loader, maxAgents: 5, minScore: 3 });

  test('should select agents for a SaaS landing page brief', async () => {
    const parsedBrief = {
      originalBrief: 'Modern SaaS landing page',
      style: 'modern',
      type: 'landing',
      industry: 'saas',
      features: ['hero'],
      complexity: 'low',
      concerns: [],
      briefWords: ['modern', 'saas', 'landing', 'page']
    };

    const selected = await selector.select(parsedBrief);
    expect(selected.length).toBeGreaterThan(0);
    expect(selected.length).toBeLessThanOrEqual(5);

    const names = selected.map(s => s.agent.name);
    // Always-include agents should be present
    expect(names).toContain('ui-designer');
    expect(names).toContain('design-system-architect');
  });

  test('should include healthcare-ux for health industry', async () => {
    const parsedBrief = {
      originalBrief: 'Healthcare dashboard with accessibility',
      style: 'clean',
      type: 'dashboard',
      industry: 'health',
      features: [],
      complexity: 'medium',
      concerns: ['accessibility'],
      briefWords: ['healthcare', 'dashboard', 'accessibility']
    };

    const selected = await selector.select(parsedBrief);
    const names = selected.map(s => s.agent.name);
    expect(names).toContain('healthcare-ux');
  });

  test('should include accessibility-specialist when accessibility is mentioned', async () => {
    const parsedBrief = {
      originalBrief: 'Accessible web application with screen reader support',
      style: 'modern',
      type: 'webapp',
      industry: 'general',
      features: [],
      complexity: 'medium',
      concerns: ['accessible', 'screen reader'],
      briefWords: ['accessible', 'web', 'application', 'screen', 'reader', 'support']
    };

    const selected = await selector.select(parsedBrief);
    const names = selected.map(s => s.agent.name);
    expect(names).toContain('accessibility-specialist');
  });

  test('should assign roles correctly', async () => {
    const parsedBrief = {
      originalBrief: 'Modern dashboard',
      style: 'modern',
      type: 'dashboard',
      industry: 'general',
      features: [],
      complexity: 'low',
      concerns: [],
      briefWords: ['modern', 'dashboard']
    };

    const selected = await selector.select(parsedBrief);
    expect(selected[0].role).toBe('primary');
    if (selected.length > 1) {
      expect(['supporting', 'specialist']).toContain(selected[1].role);
    }
  });

  test('should score agents and return them sorted by score', async () => {
    const parsedBrief = {
      originalBrief: 'Dark mode crypto dashboard with animation',
      style: 'dark',
      type: 'dashboard',
      industry: 'crypto',
      features: [],
      complexity: 'medium',
      concerns: ['animation'],
      briefWords: ['dark', 'mode', 'crypto', 'dashboard', 'animation']
    };

    const selected = await selector.select(parsedBrief);
    for (let i = 1; i < selected.length; i++) {
      expect(selected[i - 1].score).toBeGreaterThanOrEqual(selected[i].score);
    }
  });

  test('should not exceed maxAgents', async () => {
    const smallSelector = new AgentSelector({ loader, maxAgents: 3, minScore: 1 });
    const parsedBrief = {
      originalBrief: 'Complex enterprise platform with everything',
      style: 'corporate',
      type: 'platform',
      industry: 'saas',
      features: ['hero', 'pricing', 'testimonials', 'contact', 'footer', 'nav'],
      complexity: 'high',
      concerns: ['accessible', 'responsive', 'animation', 'brand', 'dark mode'],
      briefWords: ['complex', 'enterprise', 'platform', 'everything']
    };

    const selected = await smallSelector.select(parsedBrief);
    expect(selected.length).toBeLessThanOrEqual(3);
  });
});
