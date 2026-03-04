const path = require('path');
const { loadAgents } = require('../src/agents/agent-loader');
const { selectAgents } = require('../src/agents/agent-selector');

const AGENTS_DIR = path.join(__dirname, '..', 'agents');

describe('agent-selector', () => {
  let agents;

  beforeAll(() => {
    agents = loadAgents(AGENTS_DIR);
  });

  test('selects agents for a SaaS landing page', () => {
    const context = {
      description: 'Modern SaaS landing page',
      industry: 'saas',
      concerns: [],
      componentType: 'landing',
    };

    const result = selectAgents(context, agents);
    expect(result.primary).toBeDefined();
    expect(result.supporting.length).toBeGreaterThan(0);
  });

  test('includes accessibility-specialist as supporting by default', () => {
    const context = {
      description: 'Simple product card component',
      concerns: [],
    };

    const result = selectAgents(context, agents);
    const allNames = [
      result.primary.name,
      ...result.supporting.map(a => a.name),
    ];
    expect(allNames).toContain('accessibility-specialist');
  });

  test('selects healthcare-ux-specialist for healthcare context', () => {
    const context = {
      description: 'Healthcare patient dashboard',
      industry: 'healthcare',
      concerns: ['accessibility'],
    };

    const result = selectAgents(context, agents);
    const allNames = [
      result.primary.name,
      ...result.supporting.map(a => a.name),
    ];
    expect(allNames).toContain('healthcare-ux-specialist');
  });

  test('returns scores sorted in descending order', () => {
    const context = {
      description: 'Complex enterprise analytics dashboard with charts',
      concerns: ['accessibility', 'responsive'],
    };

    const result = selectAgents(context, agents);
    for (let i = 1; i < result.scores.length; i++) {
      expect(result.scores[i - 1].score).toBeGreaterThanOrEqual(
        result.scores[i].score
      );
    }
  });

  test('selects form-design-specialist for forms', () => {
    const context = {
      description: 'User registration form with validation',
      concerns: [],
      componentType: 'form',
    };

    const result = selectAgents(context, agents);
    const allNames = [
      result.primary.name,
      ...result.supporting.map(a => a.name),
    ];
    expect(allNames).toContain('form-design-specialist');
  });

  test('selects dashboard-designer for dashboard context', () => {
    const context = {
      description: 'Analytics dashboard with KPI cards and charts',
      concerns: [],
    };

    const result = selectAgents(context, agents);
    const allNames = [
      result.primary.name,
      ...result.supporting.map(a => a.name),
    ];
    expect(allNames).toContain('dashboard-designer');
  });
});
