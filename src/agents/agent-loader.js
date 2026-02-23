const fs = require('fs-extra');
const path = require('path');

const AGENTS_DIR = path.join(__dirname, '..', '..', 'agents');

/**
 * Parse YAML frontmatter from markdown content.
 * Simple regex-based parser — no external dependency needed.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    meta[key] = value;
  }

  const body = content.slice(match[0].length).trim();
  return { meta, body };
}

/**
 * Extract bullet-list items from a markdown section body.
 * Handles lines starting with "- " or "* ".
 */
function extractListItems(sectionBody) {
  return sectionBody
    .split('\n')
    .filter(line => /^\s*[-*]\s/.test(line))
    .map(line => line.replace(/^\s*[-*]\s+/, '').trim())
    .filter(Boolean);
}

/**
 * Extract numbered-list items from a markdown section body.
 */
function extractNumberedItems(sectionBody) {
  return sectionBody
    .split('\n')
    .filter(line => /^\s*\d+\.\s/.test(line))
    .map(line => line.replace(/^\s*\d+\.\s+/, '').replace(/\*\*/g, '').trim())
    .filter(Boolean);
}

/**
 * Parse a markdown body into sections keyed by ## heading.
 * Returns Map of heading → content (string between this heading and the next).
 */
function parseSections(body) {
  const sections = {};
  const regex = /^## (.+)$/gm;
  const headings = [];
  let match;

  while ((match = regex.exec(body)) !== null) {
    headings.push({ title: match[1].trim(), index: match.index + match[0].length });
  }

  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].index;
    const end = i + 1 < headings.length
      ? body.lastIndexOf('\n## ', headings[i + 1].index)
      : body.length;
    const content = body.slice(start, end).trim();
    sections[headings[i].title] = content;
  }

  return sections;
}

/**
 * Find @agent-name cross-references in markdown body.
 */
function extractCrossReferences(body) {
  const refs = new Set();
  const regex = /@([a-z][a-z0-9-]*)/g;
  let match;
  while ((match = regex.exec(body)) !== null) {
    refs.add(match[1]);
  }
  return Array.from(refs);
}

/**
 * Extract the intro paragraph — text before the first ## heading.
 */
function extractIntro(body) {
  const firstHeading = body.indexOf('\n## ');
  const text = firstHeading === -1 ? body : body.slice(0, firstHeading);
  return text.trim();
}

/**
 * Parse a single agent markdown file into structured data.
 */
function parseAgentFile(content, filePath) {
  const { meta, body } = parseFrontmatter(content);
  const sections = parseSections(body);

  const coreExpertise = sections['Core Expertise']
    ? extractListItems(sections['Core Expertise'])
    : [];

  const whenInvoked = sections['When Invoked']
    ? extractNumberedItems(sections['When Invoked'])
    : [];

  const bestPractices = sections['Best Practices']
    ? extractListItems(sections['Best Practices'])
    : [];

  return {
    name: meta.name || path.basename(filePath, '.md'),
    description: meta.description || '',
    category: meta.category || 'uncategorized',
    version: meta.version || '1.0.0',
    intro: extractIntro(body),
    coreExpertise,
    whenInvoked,
    bestPractices,
    sections,
    crossReferences: extractCrossReferences(body),
    rawMarkdown: body,
    filePath
  };
}

class AgentLoader {
  constructor(agentsDir) {
    this.agentsDir = agentsDir || AGENTS_DIR;
    this._cache = null;
  }

  /**
   * Load and parse all agent markdown files.
   * Results are cached after first call.
   * @returns {ParsedAgent[]}
   */
  async loadAll() {
    if (this._cache) return this._cache;

    const agents = [];
    const categories = await fs.readdir(this.agentsDir);

    for (const category of categories) {
      const categoryPath = path.join(this.agentsDir, category);
      const stat = await fs.stat(categoryPath);
      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(categoryPath);
      for (const file of files) {
        if (!file.endsWith('.md')) continue;
        const filePath = path.join(categoryPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        agents.push(parseAgentFile(content, filePath));
      }
    }

    this._cache = agents;
    return agents;
  }

  /**
   * Load a single agent by name.
   * @param {string} name - Agent name (e.g. 'ui-designer')
   * @returns {ParsedAgent|null}
   */
  async loadByName(name) {
    const all = await this.loadAll();
    return all.find(a => a.name === name) || null;
  }

  /**
   * Load all agents in a given category.
   * @param {string} category - Category folder name (e.g. 'core-design')
   * @returns {ParsedAgent[]}
   */
  async loadByCategory(category) {
    const all = await this.loadAll();
    return all.filter(a => a.category === category);
  }

  /**
   * Clear the cache so agents are re-read from disk on next load.
   */
  clearCache() {
    this._cache = null;
  }
}

module.exports = AgentLoader;
// Also export helpers for testing
module.exports.parseAgentFile = parseAgentFile;
module.exports.parseFrontmatter = parseFrontmatter;
module.exports.parseSections = parseSections;
module.exports.extractCrossReferences = extractCrossReferences;
