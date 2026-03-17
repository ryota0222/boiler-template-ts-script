# Agent Guidelines

This file provides guidance to LLM agents when working with code in this repository.

## Project Overview

TypeScript script template for Node.js v22+ / ESM. Built as a CLI-executable script with tsup.

## Directory Structure

```text
src/
  index.ts          # CLI entry point
  entities/          # Type definitions & zod schemas (domain models)
  libs/              # Implementation (organized by feature subdirectories)
```

- `entities/` contains only data structure definitions (no logic)
- `libs/` contains implementations, organized by concern into subdirectories (e.g., `libs/csv/`, `libs/masking/`)
- Test files are co-located with their source files (`foo.ts` → `foo.test.ts`)

## Project Rules

コーディング時は以下のルールファイルも参照し、遵守すること:

- `docs/rules/dependency-policy.md` — ライブラリ選定・使用ルール
- `docs/rules/implementation-patterns.md` — 実装パターンの強制・禁止

新しいカテゴリが必要な場合は `docs/rules/template.md` を参考にファイルを追加する。
