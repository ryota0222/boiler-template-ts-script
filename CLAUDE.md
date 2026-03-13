# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript script template for Node.js v22+ / ESM. Built as a CLI-executable script with tsup.

## Directory Structure

```
src/
  index.ts          # CLI entry point
  entities/          # Type definitions & zod schemas (domain models)
  libs/              # Implementation (organized by feature subdirectories)
```

- `entities/` contains only data structure definitions (no logic)
- `libs/` contains implementations, organized by concern into subdirectories (e.g., `libs/csv/`, `libs/masking/`)
- Test files are co-located with their source files (`foo.ts` → `foo.test.ts`)
