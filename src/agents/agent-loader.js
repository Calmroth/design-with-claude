/**
 * Agent Loader - Loads and parses agent markdown files from the agents/ directory.
 *
 * Parses structured markdown files into agent objects with:
 * role, expertise, design principles, guidelines, checklist, anti-patterns, and keywords.
 *
 * @module agent-loader
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Markdown Section Parser Utilities
// ---------------------------------------------------------------------------

/**
 * Split markdown content into sections by ## headings.
 * @param {string} content - Raw markdown content
 * @returns {{ heading: string, body: string }[]}
 */
function splitSections(content) {
  const sections = [];
  const lines = content.split('\n');
  let currentHeading = '';
  let currentBody = [];

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      // Save previous section
      if (currentHeading || currentBody.length > 0) {
        sections.push({
          heading: currentHeading.trim(),
          body: currentBody.join('\n').trim(),
        });
      }
      currentHeading = h2Match[1];
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }

  // Save final section
  if (currentHeading || currentBody.length > 0) {
    sections.push({
      heading: currentHeading.trim(),
      body: currentBody.join('\n').trim(),
    });
  }

  return sections;
}

/**
 * Parse bullet points from a markdown body (lines starting with - or *).
 * @param {string} body - Section body text
 * @returns {string[]}
 */
function parseBulletPoints(body) {
  const items = [];
  const lines = body.split('\n');
  let currentItem = '';

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*[-*]\s+(.+)$/);
    if (bulletMatch) {
      if (currentItem) items.push(currentItem.trim());
      currentItem = bulletMatch[1];
    } else if (currentItem && line.match(/^\s{2,}/)) {
      // Continuation of previous bullet point (indented line)
      currentItem += ' ' + line.trim();
    } else {
      if (currentItem) items.push(currentItem.trim());
      currentItem = '';
    }
  }

  if (currentItem) items.push(currentItem.trim());
  return items;
}

/**
 * Parse a numbered list into structured items with optional title/description.
 * Handles formats like: "1. **Title** - Description" or "1. Title: Description"
 * @param {string} body - Section body text
 * @returns {{ number: number, title: string, description: string }[]}
 */
function parseNumberedList(body) {
  const items = [];
  const lines = body.split('\n');
  let currentItem = null;

  for (const line of lines) {
    const numberedMatch = line.match(/^\s*(\d+)[.)]\s+(.+)$/);
    if (numberedMatch) {
      if (currentItem) items.push(currentItem);

      const num = parseInt(numberedMatch[1], 10);
      const text = numberedMatch[2];

      // Try to split title from description
      // Pattern: **Title** - Description
      const boldTitleMatch = text.match(/^\*\*(.+?)\*\*\s*[-:]\s*(.+)$/);
      if (boldTitleMatch) {
        currentItem = {
          number: num,
          title: boldTitleMatch[1].trim(),
          description: boldTitleMatch[2].trim(),
        };
      } else {
        // Pattern: Title: Description or Title - Description
        const simpleTitleMatch = text.match(/^([^:-]+)\s*[-:]\s+(.+)$/);
        if (simpleTitleMatch) {
          currentItem = {
            number: num,
            title: simpleTitleMatch[1].trim(),
            description: simpleTitleMatch[2].trim(),
          };
        } else {
          currentItem = {
            number: num,
            title: text.trim(),
            description: '',
          };
        }
      }
    } else if (currentItem && line.match(/^\s{2,}/) && line.trim()) {
      // Continuation of description
      currentItem.description += ' ' + line.trim();
    } else {
      if (currentItem) items.push(currentItem);
      currentItem = null;
    }
  }

  if (currentItem) items.push(currentItem);
  return items;
}

/**
 * Parse ### subsections within a section body.
 * @param {string} body - Section body text
 * @returns {Record<string, string>}
 */
function parseSubsections(body) {
  const subsections = {};
  const parts = body.split(/(?=^###\s)/m);

  for (const part of parts) {
    const h3Match = part.match(/^###\s+(.+)$/m);
    if (h3Match) {
      const key = h3Match[1].trim();
      const content = part.replace(/^###\s+.+$/m, '').trim();
      subsections[key] = content;
    } else if (part.trim()) {
      // Content before any ### heading — store as "_intro"
      subsections['_intro'] = part.trim();
    }
  }

  return subsections;
}

/**
 * Parse checklist items (- [ ] or - [x] format).
 * @param {string} body - Section body text
 * @returns {{ text: string, checked: boolean }[]}
 */
function parseChecklist(body) {
  const items = [];
  const lines = body.split('\n');
  let currentItem = null;

  for (const line of lines) {
    const checkMatch = line.match(/^\s*-\s+\[([ xX])\]\s+(.+)$/);
    if (checkMatch) {
      if (currentItem) items.push(currentItem);
      currentItem = {
        text: checkMatch[2].trim(),
        checked: checkMatch[1].toLowerCase() === 'x',
      };
    } else if (currentItem && line.match(/^\s{2,}/) && line.trim()) {
      // Continuation of checklist item
      currentItem.text += ' ' + line.trim();
    } else {
      if (currentItem) items.push(currentItem);
      currentItem = null;
    }
  }

  if (currentItem) items.push(currentItem);
  return items;
}

/**
 * Parse comma-separated keywords, trimmed and lowercased.
 * @param {string} body - Section body text
 * @returns {string[]}
 */
function parseKeywords(body) {
  // Handle both comma-separated inline and bullet-point formats
  const trimmed = body.trim();

  // If it looks like bullet points, parse those
  if (/^\s*[-*]\s/m.test(trimmed)) {
    return parseBulletPoints(trimmed).map(k => k.toLowerCase().trim()).filter(Boolean);
  }

  // Otherwise treat as comma-separated (may span multiple lines)
  return trimmed
    .replace(/\n/g, ',')
    .split(',')
    .map(k => k.trim().toLowerCase())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Main Parsing Functions
// ---------------------------------------------------------------------------

/**
 * Parse a single agent markdown file into a structured object.
 *
 * Expected markdown structure:
 * ```
 * # Agent Name
 * ## Role
 * ## Expertise
 * ## Design Principles
 * ## Guidelines
 * ### Subsection 1
 * ### Subsection 2
 * ## Checklist
 * ## Anti-patterns
 * ## Keywords
 * ```
 *
 * @param {string} filePath - Absolute path to the agent .md file
 * @returns {{ name: string, role: string, expertise: string[], principles: { number: number, title: string, description: string }[], guidelines: Record<string, string>, checklist: { text: string, checked: boolean }[], antiPatterns: string[], keywords: string[] }}
 */
function parseAgentFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Agent file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const name = path.basename(filePath, '.md');
  const sections = splitSections(content);

  const agent = {
    name,
    role: '',
    expertise: [],
    principles: [],
    guidelines: {},
    checklist: [],
    antiPatterns: [],
    keywords: [],
  };

  for (const section of sections) {
    const heading = section.heading.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim();

    if (heading === 'role' || heading === 'description') {
      // Role section: return the paragraph text
      agent.role = section.body.replace(/\n+/g, ' ').trim();
    } else if (heading === 'expertise' || heading === 'areas of expertise' || heading === 'specializations') {
      agent.expertise = parseBulletPoints(section.body);
    } else if (heading === 'design principles' || heading === 'principles' || heading === 'core principles') {
      // Try numbered list first, fall back to bullet points
      const numbered = parseNumberedList(section.body);
      if (numbered.length > 0) {
        agent.principles = numbered;
      } else {
        const bullets = parseBulletPoints(section.body);
        agent.principles = bullets.map((text, i) => ({
          number: i + 1,
          title: text,
          description: '',
        }));
      }
    } else if (heading === 'guidelines' || heading === 'design guidelines' || heading === 'rules') {
      // Parse ### subsections within guidelines
      agent.guidelines = parseSubsections(section.body);
      // If no subsections found, store as a single entry
      if (Object.keys(agent.guidelines).length === 0 && section.body.trim()) {
        agent.guidelines['_general'] = section.body.trim();
      }
    } else if (heading === 'checklist' || heading === 'review checklist' || heading === 'design checklist') {
      agent.checklist = parseChecklist(section.body);
      // If no checkbox items found, try bullet points
      if (agent.checklist.length === 0) {
        const bullets = parseBulletPoints(section.body);
        agent.checklist = bullets.map(text => ({ text, checked: false }));
      }
    } else if (heading === 'anti-patterns' || heading === 'antipatterns' || heading === 'common mistakes' || heading === 'pitfalls') {
      agent.antiPatterns = parseBulletPoints(section.body);
    } else if (heading === 'keywords' || heading === 'tags' || heading === 'topics') {
      agent.keywords = parseKeywords(section.body);
    }
  }

  return agent;
}

/**
 * Load all agent markdown files from a directory.
 *
 * @param {string} [agentsDir] - Path to the agents directory.
 *   Defaults to path.join(__dirname, '../../agents')
 * @returns {Map<string, object>} Map of agent name to parsed agent object
 */
function loadAgents(agentsDir) {
  const dir = agentsDir || path.join(__dirname, '../../agents');

  if (!fs.existsSync(dir)) {
    throw new Error(`Agents directory not found: ${dir}`);
  }

  const agents = new Map();
  let entries;

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    throw new Error(`Failed to read agents directory: ${err.message}`);
  }

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (path.extname(entry.name).toLowerCase() !== '.md') continue;

    const filePath = path.join(dir, entry.name);
    try {
      const agent = parseAgentFile(filePath);
      agents.set(agent.name, agent);
    } catch (err) {
      // Log but don't fail — skip malformed agent files
      console.warn(`Warning: Failed to parse agent file ${entry.name}: ${err.message}`);
    }
  }

  return agents;
}

module.exports = {
  loadAgents,
  parseAgentFile,
  // Export utilities for testing
  splitSections,
  parseBulletPoints,
  parseNumberedList,
  parseSubsections,
  parseChecklist,
  parseKeywords,
};
