const AgentKnowledge = require('../src/agents/agent-knowledge');
const { mergeGuidance } = require('../src/agents/agent-knowledge');

describe('AgentKnowledge', () => {
  const knowledge = new AgentKnowledge();

  function makeAgent(name, overrides = {}) {
    return {
      agent: {
        name,
        intro: overrides.intro || `You are a ${name} agent.`,
        coreExpertise: overrides.coreExpertise || ['expertise 1', 'expertise 2'],
        bestPractices: overrides.bestPractices || ['practice 1', 'practice 2'],
        rawMarkdown: overrides.rawMarkdown || `# ${name}\nContent here.`,
        ...overrides
      },
      score: overrides.score || 10,
      role: overrides.role || 'primary'
    };
  }

  test('should extract guidance from ui-designer agent', () => {
    const selected = [makeAgent('ui-designer', {
      intro: 'You are a UI Designer specializing in visual design.',
      coreExpertise: ['Visual hierarchy', 'Grid systems', 'Dark mode and theming']
    })];

    const guidance = knowledge.extract(selected);
    expect(guidance.colorGuidance).toBeDefined();
    expect(guidance.layoutGuidance.gridColumns).toBe(12);
    expect(guidance.typographyGuidance.style).toBe('modern');
  });

  test('should extract guidance from accessibility-specialist', () => {
    const selected = [makeAgent('accessibility-specialist')];

    const guidance = knowledge.extract(selected);
    expect(guidance.colorGuidance.contrast).toBe('AAA');
    expect(guidance.componentGuidance.accessibilityRequirements.length).toBeGreaterThan(0);
  });

  test('should extract motion tokens from motion-designer', () => {
    const selected = [makeAgent('motion-designer')];

    const guidance = knowledge.extract(selected);
    expect(guidance.componentGuidance.animationDurations).toBeDefined();
    expect(guidance.componentGuidance.animationDurations.micro).toBe('150ms');
    expect(guidance.componentGuidance.transitions).toBeDefined();
  });

  test('should merge guidance from multiple agents', () => {
    const selected = [
      makeAgent('ui-designer', {
        intro: 'You are a UI Designer.',
        coreExpertise: ['Visual hierarchy']
      }),
      makeAgent('accessibility-specialist', { role: 'supporting' }),
      makeAgent('motion-designer', { role: 'specialist' })
    ];

    const guidance = knowledge.extract(selected);
    // Should have UI designer's layout guidance
    expect(guidance.layoutGuidance.gridColumns).toBe(12);
    // Should have accessibility requirements
    expect(guidance.componentGuidance.accessibilityRequirements.length).toBeGreaterThan(0);
    // Should have motion durations
    expect(guidance.componentGuidance.animationDurations).toBeDefined();
  });

  test('should collect best practices from all selected agents', () => {
    const selected = [
      makeAgent('ui-designer', {
        bestPractices: ['Practice A', 'Practice B', 'Practice C']
      }),
      makeAgent('brand-strategist', {
        role: 'supporting',
        bestPractices: ['Practice D', 'Practice E']
      })
    ];

    const guidance = knowledge.extract(selected);
    expect(guidance.bestPractices.length).toBeGreaterThanOrEqual(4);
  });

  test('should add agent notes for each selected agent', () => {
    const selected = [
      makeAgent('ui-designer', { role: 'primary' }),
      makeAgent('brand-strategist', { role: 'supporting' })
    ];

    const guidance = knowledge.extract(selected);
    expect(guidance.agentNotes.length).toBe(2);
    expect(guidance.agentNotes[0].agent).toBe('ui-designer');
    expect(guidance.agentNotes[0].role).toBe('primary');
    expect(guidance.agentNotes[1].agent).toBe('brand-strategist');
  });

  test('should handle agents not in extraction map gracefully', () => {
    const selected = [makeAgent('unknown-agent')];

    const guidance = knowledge.extract(selected);
    expect(guidance.agentNotes.length).toBe(1);
    expect(guidance.agentNotes[0].agent).toBe('unknown-agent');
  });
});

describe('mergeGuidance', () => {
  test('should deep-merge objects', () => {
    const base = { colorGuidance: { mood: 'calm' } };
    const patch = { colorGuidance: { contrast: 'high' } };
    const result = mergeGuidance(base, patch);
    expect(result.colorGuidance.mood).toBe('calm');
    expect(result.colorGuidance.contrast).toBe('high');
  });

  test('should concatenate and de-dup arrays', () => {
    const base = { items: ['a', 'b'] };
    const patch = { items: ['b', 'c'] };
    const result = mergeGuidance(base, patch);
    expect(result.items).toEqual(['a', 'b', 'c']);
  });

  test('should overwrite scalar values', () => {
    const base = { mode: 'light' };
    const patch = { mode: 'dark' };
    const result = mergeGuidance(base, patch);
    expect(result.mode).toBe('dark');
  });
});
