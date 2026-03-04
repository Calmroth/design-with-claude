const path = require('path');
const { loadAgents } = require('../src/agents/agent-loader');
const { selectAgents } = require('../src/agents/agent-selector');
const { extractGuidance } = require('../src/agents/agent-knowledge');

const AGENTS_DIR = path.join(__dirname, '..', 'agents');

describe('agent-knowledge', () => {
  let agents;

  beforeAll(() => {
    agents = loadAgents(AGENTS_DIR);
  });

  test('extracts guidance from selected agents', () => {
    const context = {
      description: 'Modern SaaS dashboard',
      concerns: ['accessibility'],
    };

    const selected = selectAgents(context, agents);
    const guidance = extractGuidance(selected, context);

    expect(guidance.recommendations.length).toBeGreaterThan(0);
    expect(guidance.checklist.length).toBeGreaterThan(0);
  });

  test('includes agent attribution in recommendations', () => {
    const context = {
      description: 'Healthcare patient portal',
      industry: 'healthcare',
      concerns: [],
    };

    const selected = selectAgents(context, agents);
    const guidance = extractGuidance(selected, context);

    // At least some recommendations should have source attribution
    const withSource = guidance.recommendations.filter(r => r.source);
    expect(withSource.length).toBeGreaterThan(0);
  });

  test('extracts anti-patterns', () => {
    const context = {
      description: 'E-commerce product page',
      concerns: [],
    };

    const selected = selectAgents(context, agents);
    const guidance = extractGuidance(selected, context);

    expect(guidance.antiPatterns.length).toBeGreaterThan(0);
  });

  test('extracts principles', () => {
    const context = {
      description: 'Mobile app navigation',
      concerns: ['responsive'],
    };

    const selected = selectAgents(context, agents);
    const guidance = extractGuidance(selected, context);

    expect(guidance.principles.length).toBeGreaterThan(0);
  });

  test('deduplicates similar recommendations', () => {
    const context = {
      description: 'Accessible form with validation',
      concerns: ['accessibility'],
    };

    const selected = selectAgents(context, agents);
    const guidance = extractGuidance(selected, context);

    // Check no exact duplicates
    const texts = guidance.recommendations.map(r => r.text);
    const unique = [...new Set(texts)];
    expect(texts.length).toBe(unique.length);
  });
});
