const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');

const reviewDesign = require('./tools/review-design');
const getDesignGuidance = require('./tools/get-design-guidance');
const auditConsistency = require('./tools/audit-consistency');
const checkAccessibility = require('./tools/check-accessibility');
const getComponentSpec = require('./tools/get-component-spec');
const suggestTokens = require('./tools/suggest-tokens');

/**
 * Design Agents MCP Server
 *
 * Provides 6 design expertise tools powered by 29 specialized design agents.
 * Communicates over STDIO transport — never write to stdout directly.
 */
async function createServer() {
  const server = new McpServer({
    name: 'design-agents',
    version: '1.0.0',
  });

  // Tool 1: review_design
  server.tool(
    reviewDesign.TOOL_DEFINITION.name,
    reviewDesign.TOOL_DEFINITION.description,
    {
      file_path: z.string().describe('Path to component file to review'),
      context: z.string().optional().describe("Optional project context (e.g. 'healthcare dashboard')"),
    },
    async (params) => reviewDesign.handler(params)
  );

  // Tool 2: get_design_guidance
  server.tool(
    getDesignGuidance.TOOL_DEFINITION.name,
    getDesignGuidance.TOOL_DEFINITION.description,
    {
      description: z.string().describe("What you're building (e.g. 'healthcare patient portal')"),
      concerns: z.array(z.string()).optional().describe("Optional specific concerns (e.g. ['accessibility', 'dark mode'])"),
    },
    async (params) => getDesignGuidance.handler(params)
  );

  // Tool 3: audit_consistency
  server.tool(
    auditConsistency.TOOL_DEFINITION.name,
    auditConsistency.TOOL_DEFINITION.description,
    {
      directory: z.string().describe('Path to components directory'),
      file_pattern: z.string().optional().describe("Optional glob pattern (default: '**/*.{jsx,tsx,css}')"),
    },
    async (params) => auditConsistency.handler(params)
  );

  // Tool 4: check_accessibility
  server.tool(
    checkAccessibility.TOOL_DEFINITION.name,
    checkAccessibility.TOOL_DEFINITION.description,
    {
      file_path: z.string().describe('Path to file to check'),
    },
    async (params) => checkAccessibility.handler(params)
  );

  // Tool 5: get_component_spec
  server.tool(
    getComponentSpec.TOOL_DEFINITION.name,
    getComponentSpec.TOOL_DEFINITION.description,
    {
      component_type: z.string().describe("Component type (e.g. 'button', 'modal', 'form', 'table')"),
      context: z.string().optional().describe('Optional project context for domain-specific requirements'),
    },
    async (params) => getComponentSpec.handler(params)
  );

  // Tool 6: suggest_tokens
  server.tool(
    suggestTokens.TOOL_DEFINITION.name,
    suggestTokens.TOOL_DEFINITION.description,
    {
      description: z.string().describe("Project description (e.g. 'modern SaaS analytics platform')"),
      preferences: z.object({
        style: z.string().optional(),
        primaryColor: z.string().optional(),
        darkMode: z.boolean().optional(),
      }).optional().describe('Optional style preferences'),
    },
    async (params) => suggestTokens.handler(params)
  );

  return server;
}

async function main() {
  const server = await createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Server is running — all communication happens via STDIO
  // Never write to stdout; use stderr for logging
  process.stderr.write('Design Agents MCP server started\n');
}

module.exports = { createServer, main };
