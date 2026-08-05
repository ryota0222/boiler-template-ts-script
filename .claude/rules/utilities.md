---
description: Rules for utility definitions in src/utilities/
paths: ['src/utilities/**/*.ts']
---

# Utility Rules

## What is a Utility

Utilities extend the functionality of the Node.js runtime and third-party libraries. They are
generic by definition: nothing in a utility may reference a business concept of this domain.
Utilities have no layer affiliation, so any layer may import them.

## Utility or Entity

Business logic is consolidated in `src/entities/` so that the domain stays readable in one place.
Decide by asking whether the code names a domain concept:

- Names a domain concept (greeting, greeting source) → `src/entities/`
- Would work unchanged in an unrelated project (error-to-`Either` conversion, date arithmetic,
  retrying) → `src/utilities/`

A utility that grows a domain-specific branch is a signal that it belongs in an entity instead.

## Structure

Each utility is a single file exporting pure, generic functions.

```typescript
// src/utilities/exponentialBackoffRetrying.ts
export const exponentialBackoffRetrying = async <T>(
  runningTask: () => T
): Promise<Either.Either<Awaited<T>, Error>> => { ... };
```

- No I/O — that belongs in `src/gateways/`
- No zod — dependency-cruiser restricts it to `entities/` and `gateways/`
- No domain types from `src/entities/`; take generics or primitives instead

## File Naming

Utility files follow the gerund convention in `.claude/rules/coding-standards.md`
(`errorCatchingToEither.ts`, `exponentialBackoffRetrying.ts`).

## Testing Guidelines

Test each branch directly. Utilities have no injected dependencies, so no test doubles are needed.
