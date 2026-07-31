# Agent Guidelines

This file provides guidance to LLM agents when working with code in this repository.

## Project Overview

TypeScript script template for Node.js v24+ / ESM. Built as a CLI-executable script with tsup.

## Directory Structure

```text
src/
  index.ts          # CLI entry point — calls Controller
  entities/         # Type definitions & Zod schemas (domain models, no logic)
  gateways/         # I/O with external data sources (API, file system, etc.)
  controllers/      # Receives input and calls Usecase
  usecases/         # Business logic; also defines gateway/presenter port types
  presenters/       # Converts Usecase results into output format
  utilities/        # Cross-cutting utilities (accessible from any layer)
```

- `entities/` contains only data structure definitions (no logic)
- `gateways/` handles I/O with external data sources
- `controllers/` parses input (CLI args, stdin) and invokes the appropriate Usecase
- `usecases/` orchestrates business logic; calls Gateways and returns results
- `usecases/<domain>/gateways/` and `usecases/<domain>/presenters/` contain **type
  definitions only** — enforced by ESLint
- `presenters/` formats Usecase output for display
- `utilities/` provides cross-cutting utilities with no layer affiliation
- Test files are co-located with their source files (`foo.ts` → `foo.test.ts`)

## Dependency Direction

```text
index.ts → Controller → Usecase → Entities
                            ↑ port types only
              Gateway / Presenter implement them
                            ↑
                   utilities/ (any layer may use)
```

- Dependencies flow inward: outer layers depend on inner layers, not the reverse
- `entities/` and `usecases/` must not depend on `gateways/` or `presenters/` implementations
- zod may only be used in `entities/` and `gateways/` — enforced by dependency-cruiser
- `internal/` directories are accessible only from the same parent directory — enforced by
  dependency-cruiser

## Commands

This project uses **pnpm**, not npm. Never run `npm` or `npx`.

| Command              | Purpose                          |
| -------------------- | -------------------------------- |
| `pnpm dev`           | Run `src/index.ts` directly      |
| `pnpm build`         | Bundle to `dist/`                |
| `pnpm test`          | Run unit tests                   |
| `pnpm test:coverage` | Run tests with 100% threshold    |
| `pnpm lint`          | ESLint                           |
| `pnpm format`        | Prettier check                   |
| `pnpm typecheck`     | `tsc --noEmit`                   |
| `pnpm knip`          | Unused code/dependency detection |
| `pnpm depcruise`     | Layer dependency rules           |
| `pnpm lint:md`       | markdownlint                     |
| `pnpm lint:actions`  | actionlint                       |
| `pnpm lint:sh`       | shellcheck                       |

## Git Branch Naming

- Feature branches: `feature/<kebab-case-name>` (e.g. `feature/supabase-integration`)
- Bug fix branches: `fix/<kebab-case-name>` (e.g. `fix/login-redirect`)
- Chore branches: `chore/<kebab-case-name>` (e.g. `chore/update-dependencies`)

## Information Sources

When answering questions about libraries, frameworks, SDKs, APIs, CLI tools, or cloud services, always consult official documentation or up-to-date sources before responding — even for well-known tools. Do not rely solely on training data.

- Use the context7 MCP (`resolve-library-id` → `query-docs`) to fetch official docs
- Use WebSearch or WebFetch to check official sites, GitHub, or release notes
- This applies especially to version-specific behavior, configuration options, and API signatures

## Secret Scanning

This repository runs a defense-in-depth setup to keep secrets (API keys, webhook URLs, private keys, etc.) out of the codebase.

| Layer | Mechanism                                                     | Scope                                           |
| ----- | ------------------------------------------------------------- | ----------------------------------------------- |
| L1    | `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` in `.claude/settings.json` | Strips credentials from subprocess environments |
| L2    | `UserPromptSubmit` hook → secretlint                          | Prompt text                                     |
| L3    | `PostToolUse` hook → secretlint                               | Files written by Claude Code                    |
| L4    | lefthook + `PreToolUse` hook → gitleaks                       | Staged files and git history                    |
| L5    | `run-ci.yaml` steps                                           | The whole repository on every push              |

- secretlint is configured in `.secretlintrc.json`; run it with `pnpm run scan:secretlint`
- gitleaks is installed via `mise`; run it with `pnpm run scan:gitleaks`
- For false positives, add an allowlist to `.gitleaks.toml` (gitleaks) or a `.secretlintignore` file (secretlint). Neither file exists by default.

## Subagent Workflow

PostToolUse hooks (lint, test) do not run inside subagents. After each subagent task completes, the main session MUST run verification before committing:

1. Subagent reports task complete
2. Main session: `pnpm lint`
3. Main session: `pnpm test`
4. Fix any errors found
5. Commit

Do NOT batch verification to the end — check after every task.
