const path = require('path');
const AgentLoader = require('../src/agents/agent-loader');
const {
  parseAgentFile,
  parseFrontmatter,
  parseSections,
  extractCrossReferences
} = require('../src/agents/agent-loader');

const AGENTS_DIR = path.join(__dirname, '..', 'agents');

describe('AgentLoader', () => {
  describe('parseFrontmatter', () => {
    test('should extract YAML frontmatter fields', () => {
      const content = `---
name: test-agent
description: A test agent
category: core-design
version: 1.0.0
tools: all
---

You are a Test Agent.`;

      const { meta, body } = parseFrontmatter(content);
      expect(meta.name).toBe('test-agent');
      expect(meta.description).toBe('A test agent');
      expect(meta.category).toBe('core-design');
      expect(meta.version).toBe('1.0.0');
      expect(body).toContain('You are a Test Agent');
    });

    test('should return full content as body when no frontmatter', () => {
      const content = 'No frontmatter here';
      const { meta, body } = parseFrontmatter(content);
      expect(meta).toEqual({});
      expect(body).toBe('No frontmatter here');
    });
  });

  describe('parseSections', () => {
    test('should split body into sections by ## headings', () => {
      const body = `Intro text

## Core Expertise
- Skill 1
- Skill 2

## Best Practices
- Practice 1`;

      const sections = parseSections(body);
      expect(sections['Core Expertise']).toContain('Skill 1');
      expect(sections['Best Practices']).toContain('Practice 1');
    });
  });

  describe('extractCrossReferences', () => {
    test('should find @agent-name references', () => {
      const body = 'Works with @ui-designer and @brand-strategist for consistency.';
      const refs = extractCrossReferences(body);
      expect(refs).toContain('ui-designer');
      expect(refs).toContain('brand-strategist');
    });

    test('should return empty array when no refs', () => {
      const refs = extractCrossReferences('No references here.');
      expect(refs).toEqual([]);
    });
  });

  describe('parseAgentFile', () => {
    test('should parse a complete agent markdown file', () => {
      const content = `---
name: test-agent
description: A test description
category: visual-design
version: 2.0.0
tools: all
---

You are a Test Agent specializing in testing.

## Core Expertise
- Testing patterns
- Quality assurance

## When Invoked
1. Analyze the codebase
2. Run tests

## Best Practices
- Write tests first
- Keep tests focused`;

      const agent = parseAgentFile(content, '/fake/path/test-agent.md');
      expect(agent.name).toBe('test-agent');
      expect(agent.description).toBe('A test description');
      expect(agent.category).toBe('visual-design');
      expect(agent.version).toBe('2.0.0');
      expect(agent.intro).toContain('You are a Test Agent');
      expect(agent.coreExpertise).toContain('Testing patterns');
      expect(agent.coreExpertise).toContain('Quality assurance');
      expect(agent.whenInvoked).toContain('Analyze the codebase');
      expect(agent.bestPractices).toContain('Write tests first');
      expect(agent.filePath).toBe('/fake/path/test-agent.md');
    });
  });

  describe('loadAll', () => {
    const loader = new AgentLoader(AGENTS_DIR);

    test('should load all 29 agent files', async () => {
      const agents = await loader.loadAll();
      expect(agents.length).toBe(29);
    });

    test('should parse name and category for each agent', async () => {
      const agents = await loader.loadAll();
      for (const agent of agents) {
        expect(agent.name).toBeTruthy();
        expect(agent.category).toBeTruthy();
        expect(agent.description).toBeTruthy();
      }
    });

    test('should cache results', async () => {
      const first = await loader.loadAll();
      const second = await loader.loadAll();
      expect(first).toBe(second); // same reference
    });
  });

  describe('loadByName', () => {
    const loader = new AgentLoader(AGENTS_DIR);

    test('should find an agent by name', async () => {
      const agent = await loader.loadByName('ui-designer');
      expect(agent).not.toBeNull();
      expect(agent.name).toBe('ui-designer');
      expect(agent.coreExpertise.length).toBeGreaterThan(0);
    });

    test('should return null for unknown agent', async () => {
      const agent = await loader.loadByName('nonexistent-agent');
      expect(agent).toBeNull();
    });
  });

  describe('loadByCategory', () => {
    const loader = new AgentLoader(AGENTS_DIR);

    test('should return agents in a category', async () => {
      const agents = await loader.loadByCategory('core-design');
      // core-design folder has ui-designer, ux-design-expert, accessibility-specialist
      // (design-system-architect has category: design-systems in its frontmatter)
      expect(agents.length).toBeGreaterThanOrEqual(2);
      agents.forEach(a => expect(a.category).toBe('core-design'));
    });
  });
});
