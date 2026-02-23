# design-with-claude

## Project Overview
AI-powered design implementation CLI that turns natural language briefs into production-ready code, guided by 29 specialized design agents.

## Tech Stack
- Node.js (>=16), Commander.js, Handlebars, fs-extra, Chalk, Joi
- Jest for testing
- Optional: @anthropic-ai/sdk for API-enhanced generation

## Key Files
- `src/agents/agent-loader.js` — Parses all 29 agent markdown files into structured data
- `src/agents/agent-selector.js` — Scores and selects relevant agents per brief
- `src/agents/agent-knowledge.js` — Extracts structured guidance for generators
- `src/ai-orchestrator/orchestrator.js` — Pipeline coordinator (brief → agents → guidance → plan)
- `src/ai-orchestrator/brief-parser.js` — NLP brief parsing
- `src/generators/token-generator.js` — Design token generation (CSS + JSON)
- `src/generators/component-generator.js` — Component routing and generation

## Recent Sessions
Track of recent development sessions.

### Session 2026-02-23 10:34 (MacBook)
- **Pattern:** Agent system integration
- **Status:** Complete
- **Files Changed:** 15
- **Tests Added/Modified:** 4
- **Notes:** Wired up all 29 agent markdown files into a working pipeline (AgentLoader → AgentSelector → AgentKnowledge → Generators). Replaced hardcoded 4-agent selection with dynamic scoring-based selection. Added optional Claude API mode with graceful fallback. Updated README to reflect new architecture. 49 tests passing.

