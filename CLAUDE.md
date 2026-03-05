# design-with-claude

## Project Overview
29 specialized design agents packaged as Claude Code custom slash commands. Available as a Claude Code plugin or standalone commands — no runtime, no dependencies, no build step.

## Architecture
- **No code. Just markdown.** Each agent is a `.md` file with YAML frontmatter + structured design knowledge.
- Distributed as a Claude Code plugin via `.claude-plugin/plugin.json` manifest.
- Also installable standalone by copying `commands/` to `~/.claude/commands/`.
- `/design-brief` is the master command that routes a natural language brief to the relevant agents.

## Key Files
- `.claude-plugin/plugin.json` — Plugin manifest (name, version, metadata)
- `.claude-plugin/marketplace.json` — Marketplace catalog for plugin distribution
- `commands/*.md` — 29 agent commands + 1 master command (design-brief)
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

### Session 2026-03-04 20:06 (MacBook)
- **Pattern:** Plugin packaging and README polish
- **Status:** Complete
- **Files Changed:** 34
- **Tests Added/Modified:** 19
- **Notes:** Added `.claude-plugin/plugin.json` and `marketplace.json` for Claude Code plugin distribution. Moved commands from `.claude/commands/` to `commands/` at repo root (plugin convention). Fixed invalid `claude config add commandDirs` install command — replaced with `cp -r` to `~/.claude/commands/`. Fixed 29 vs 30 count inconsistency. Added designwithclaude.com link and example output to README. Updated GitHub repo topics from old CLI-era tags to `claude-code`, `claude-code-plugin`, `design-agents`, etc.

### Session 2026-03-04 19:42 (MacBook)
- **Pattern:** Claude Code plugin pivot
- **Status:** Complete
- **Files Changed:** 118
- **Tests Added/Modified:** 57
- **Notes:** Pivoted from MCP server/CLI architecture to Claude Code custom slash commands. Converted all 29 design agents from old format to `.claude/commands/` markdown files with YAML frontmatter. Adopted pure role-based naming convention. Created `/design-brief` master command. Rewrote README and CLAUDE.md to reflect the new markdown-only, no-runtime approach.
