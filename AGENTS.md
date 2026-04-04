# Agent Guidelines

This file provides guidance to LLM agents when working with code in this repository.

## Project Overview

TypeScript script template for Node.js v24+ / ESM. Built as a CLI-executable script with tsup.

## Directory Structure

```text
src/
  index.ts          # CLI entry point — calls Controller
  entities/         # Type definitions & Zod schemas (domain models, no logic)
  gateways/         # I/O with external data sources (API, DB, CSV, etc.)
  controllers/      # Receives input and calls Usecase
  usecases/         # Business logic
  presenters/       # Converts Usecase results into output format
  libs/             # Cross-cutting utilities (accessible from any layer)
```

- `entities/` contains only data structure definitions (no logic)
- `gateways/` handles I/O with external data sources (API, DB, CSV files, etc.), organized by concern into subdirectories (e.g., `gateways/api/`, `gateways/csv/`)
- `controllers/` parses input (CLI args, stdin) and invokes the appropriate Usecase
- `usecases/` orchestrates business logic; calls Gateways and returns results
- `presenters/` formats Usecase output for display (stdout, file, etc.)
- `libs/` provides cross-cutting utilities with no layer affiliation; any layer may import from it
- Test files are co-located with their source files (`foo.ts` → `foo.test.ts`)

## Dependency Direction

```text
index.ts → Controller → Usecase → Gateway / Entities
                              ↓
                         Presenter
                              ↑
                    libs/ (any layer may use)
```

- Dependencies flow inward: outer layers depend on inner layers, not the reverse
- `entities/` and `usecases/` must not depend on `gateways/` or `presenters/`
- `libs/` provides utilities with no layer affiliation; any layer may import from it

## Git Branch Naming

- Feature branches: `feature/<kebab-case-name>` (e.g. `feature/supabase-integration`)
- Bug fix branches: `fix/<kebab-case-name>` (e.g. `fix/login-redirect`)
- Chore branches: `chore/<kebab-case-name>` (e.g. `chore/update-dependencies`)

## Information Sources

When answering questions about libraries, frameworks, SDKs, APIs, CLI tools, or cloud services, always consult official documentation or up-to-date sources before responding — even for well-known tools. Do not rely solely on training data.

- Use the context7 MCP (`resolve-library-id` → `query-docs`) to fetch official docs
- Use WebSearch or WebFetch to check official sites, GitHub, or release notes
- This applies especially to version-specific behavior, configuration options, and API signatures

## Subagent Workflow

PostToolUse hooks (lint, test) do not run inside subagents. After each subagent task completes, the main session MUST run verification before committing:

1. Subagent reports task complete
2. Main session: `npm run lint`
3. Main session: `npm test`
4. Fix any errors found
5. Commit

Do NOT batch verification to the end — check after every task.
