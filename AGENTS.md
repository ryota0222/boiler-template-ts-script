# Agent Guidelines

This file provides guidance to LLM agents when working with code in this repository.

## Project Overview

TypeScript script template for Node.js v24+ / ESM. Built as a CLI-executable script with tsup.

## Directory Structure

```text
src/
  index.ts          # CLI entry point
  entities/          # Type definitions & zod schemas (domain models)
  gateways/          # I/O with external data sources (API, DB, CSV, etc.)
  libs/              # Implementation (organized by feature subdirectories)
```

- `entities/` contains only data structure definitions (no logic)
- `gateways/` handles I/O with external data sources (API, DB, CSV files, etc.), organized by concern into subdirectories (e.g., `gateways/api/`, `gateways/csv/`)
- `libs/` contains implementations, organized by concern into subdirectories (e.g., `libs/csv/`, `libs/masking/`)
- Test files are co-located with their source files (`foo.ts` → `foo.test.ts`)

## Git Branch Naming

- Feature branches: `feature/<kebab-case-name>` (e.g. `feature/supabase-integration`)
- Bug fix branches: `fix/<kebab-case-name>` (e.g. `fix/login-redirect`)
- Chore branches: `chore/<kebab-case-name>` (e.g. `chore/update-dependencies`)

## Subagent Workflow

PostToolUse hooks (lint, test) do not run inside subagents. After each subagent task completes, the main session MUST run verification before committing:

1. Subagent reports task complete
2. Main session: `npm run lint`
3. Main session: `npm test`
4. Fix any errors found
5. Commit

Do NOT batch verification to the end — check after every task.
