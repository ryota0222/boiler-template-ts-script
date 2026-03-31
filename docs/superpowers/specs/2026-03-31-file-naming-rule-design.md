# File Naming Rule Design

## Overview

Add a rule to `docs/rules/implementation-patterns.md` prohibiting verb-based file names.
File names must be noun-based, representing the concept or concern they own.

## Problem

Verb-based file names (e.g., `getDataAgent.ts`) mirror a single function name.
When a second related function is added, there is no natural place to put it and the file must be renamed.
Noun-based names represent the concern the file owns, so related functions can grow inside without renaming.

## Rule

**Location**: `docs/rules/implementation-patterns.md`

**Type**: MUST NOT use verbs as the start of a file name.

**Reason**: A verb-based file name collapses to a single-function file. When a second related
function is added, the name no longer fits and a rename is required. A noun-based name
(representing the concern) accommodates growth without renaming.

## Best Practice Examples

| Before (verb-based) | After (noun-based)    |
| ------------------- | --------------------- |
| `getDataAgent.ts`   | `dataAgentGateway.ts` |
| `fetchUser.ts`      | `userGateway.ts`      |
| `parseConfig.ts`    | `configParser.ts`     |
| `formatDate.ts`     | `dateFormatter.ts`    |

Follow layer suffix conventions (`*Gateway`, `*Parser`, `*Formatter`, etc.) when applicable.

## Code Example

```typescript
// Good
// src/gateways/api/dataAgentGateway.ts
export function getDataAgent() { ... }
export function updateDataAgent() { ... }

// Bad
// src/gateways/api/getDataAgent.ts  ← verb-based; breaks when a second function is added
export function getDataAgent() { ... }
```

## Scope

- Rule applies to all source files under `src/`
- No existing files need renaming (only `src/index.ts` exists, which is a conventional name)
