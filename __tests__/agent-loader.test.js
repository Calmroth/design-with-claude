const path = require('path');
const {
  loadAgents,
  splitSections,
  parseBulletPoints,
  parseKeywords,
} = require('../src/agents/agent-loader');

const AGENTS_DIR = path.join(__dirname, '..', 'agents');

describe('agent-loader', () => {
  describe('splitSections', () => {
    test('splits body into sections by ## headings', () => {
      const body = `Intro text

## Role
You are a design expert.

## Expertise
- Skill 1
- Skill 2

## Guidelines
### Colors
Use consistent colors.`;

      const sections = splitSections(body);
      const roleSection = sections.find(s => s.heading === 'Role');
      const expertiseSection = sections.find(s => s.heading === 'Expertise');
      const guidelinesSection = sections.find(s => s.heading === 'Guidelines');

      expect(roleSection.body).toContain('design expert');
      expect(expertiseSection.body).toContain('Skill 1');
      expect(guidelinesSection.body).toContain('Colors');
    });
  });

  describe('parseBulletPoints', () => {
    test('extracts bullet list items', () => {
      const text = `- Item one
- Item two
- Item three`;
      const items = parseBulletPoints(text);
      expect(items).toEqual(['Item one', 'Item two', 'Item three']);
    });

    test('handles * bullets', () => {
      const text = `* Star one
* Star two`;
      const items = parseBulletPoints(text);
      expect(items).toEqual(['Star one', 'Star two']);
    });
  });

  describe('parseKeywords', () => {
    test('parses comma-separated keywords', () => {
      const text = 'accessibility, wcag, aria, keyboard, contrast';
      const keywords = parseKeywords(text);
      expect(keywords).toContain('accessibility');
      expect(keywords).toContain('wcag');
      expect(keywords.length).toBe(5);
    });

    test('parses bullet list keywords', () => {
      const text = `- accessibility
- wcag
- contrast`;
      const keywords = parseKeywords(text);
      expect(keywords).toContain('accessibility');
      expect(keywords).toContain('wcag');
    });
  });

  describe('loadAgents', () => {
    test('loads all 29 agent files', () => {
      const agents = loadAgents(AGENTS_DIR);
      expect(agents.size).toBe(29);
    });

    test('each agent has name, role, expertise, and keywords', () => {
      const agents = loadAgents(AGENTS_DIR);
      for (const [name, agent] of agents) {
        expect(name).toBeTruthy();
        expect(agent.role).toBeTruthy();
        expect(agent.expertise.length).toBeGreaterThan(0);
        expect(agent.keywords.length).toBeGreaterThan(0);
      }
    });

    test('loads accessibility-specialist correctly', () => {
      const agents = loadAgents(AGENTS_DIR);
      const agent = agents.get('accessibility-specialist');
      expect(agent).toBeDefined();
      expect(agent.keywords).toContain('accessibility');
    });

    test('loads dashboard-designer correctly', () => {
      const agents = loadAgents(AGENTS_DIR);
      const agent = agents.get('dashboard-designer');
      expect(agent).toBeDefined();
      expect(agent.keywords).toContain('dashboard');
    });

    test('agents have checklist and anti-patterns', () => {
      const agents = loadAgents(AGENTS_DIR);
      const agent = agents.get('accessibility-specialist');
      expect(agent.checklist.length).toBeGreaterThan(0);
      expect(agent.antiPatterns.length).toBeGreaterThan(0);
    });
  });
});
