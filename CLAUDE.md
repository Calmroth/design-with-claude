# design-with-claude

## Project Overview
29 specialized design agents packaged as Claude Code custom slash commands. Each command file in `.claude/commands/` becomes a `/command-name` in any Claude Code session — no runtime, no dependencies, no build step.

## Architecture
- **No code. Just markdown.** Each agent is a `.md` file with YAML frontmatter + structured design knowledge.
- Users install via `claude config add commandDirs` — the commands directory is the entire product.
- `/design-brief` is the master command that routes a natural language brief to the relevant agents.

## Key Files
- `.claude/commands/*.md` — 29 agent commands + 1 master command (design-brief)
- `agents/*.md` — Source agent files (reference/archive)
- `README.md` — Install instructions, command reference, examples

## Command File Structure
Each command follows this format:
```
---
description: Short description for Claude Code's command picker
---

Role statement with $ARGUMENTS placeholder

## Expertise
## Design Principles
## Guidelines
## Checklist
## Anti-patterns
## How to respond
## What to ask if unclear
```

## Naming Convention
Commands use pure role-based names (e.g., `accessibility-specialist`, `motion-designer`, `form-designer`). No `design-` prefix except for `design-brief` (the master command) and `design-system-architect`.

## Recent Sessions

### Session 2026-03-04 19:42 (MacBook)
- **Pattern:** Claude Code plugin pivot
- **Status:** Complete
- **Files Changed:** 118
- **Tests Added/Modified:** 57
- **Notes:** Pivoted from MCP server/CLI architecture to Claude Code custom slash commands. Converted all 29 design agents from old format to `.claude/commands/` markdown files with YAML frontmatter. Adopted pure role-based naming convention. Created `/design-brief` master command. Rewrote README and CLAUDE.md to reflect the new markdown-only, no-runtime approach.
