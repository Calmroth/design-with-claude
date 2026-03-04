#!/usr/bin/env node

/**
 * Design Agents MCP Server — CLI entry point
 *
 * Starts the MCP server on STDIO transport.
 * Used by AI coding tools (Claude Code, Cursor, VS Code) to access
 * 29 specialized design agents for expert-level design reviews.
 *
 * Usage:
 *   npx design-agents-mcp
 *
 * Or in your MCP config:
 *   { "command": "npx", "args": ["design-agents-mcp"] }
 */

const { main } = require('../src/mcp/server');

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err.message}\n`);
  process.exit(1);
});
