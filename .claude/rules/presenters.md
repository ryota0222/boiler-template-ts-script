---
description: Rules for presenter definitions in src/presenters/
paths: ['src/presenters/**/*.ts']
---

# Presenter Rules

## What is a Presenter

Presenters are responsible for output — formatting domain data and writing it to the console. They contain display formatting logic and console output calls (e.g., `console.log`).

## Structure

Each presenter file exports functions that take domain entity types, format them, and output to the console.

```typescript
// src/presenters/greeting.ts
import type { PrintGreeting } from '@/usecases/greeting/presenters/greeting';

export const printGreeting: PrintGreeting = (greeting) => {
  console.log(greeting);
};
```

## File Naming

Each presenter is a single file named `<domainConcept>.ts` (camelCase), placed directly under
`src/presenters/`. The `Presenter` suffix is omitted because the directory name already conveys the
layer, matching the convention in `.claude/rules/gateways.md`.

- Presenter file: `<domainConcept>.ts` (camelCase, no `Presenter` suffix)
- Test file: `<domainConcept>.test.ts` (co-located)

## No Business Logic

Presenters contain only:

- String formatting and layout logic
- Display-related decisions (e.g., prefix labels, separators)
- Console output calls (`console.log`, `console.error`)

No file reads/writes, no HTTP requests, no domain rules, no orchestration.
