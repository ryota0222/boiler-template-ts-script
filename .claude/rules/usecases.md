---
description: Rules for usecase definitions in src/usecases/
paths: ['src/usecases/**/*.ts']
---

# Usecase Rules

## What is a Usecase

Usecases contain the application's business logic. They orchestrate the flow of data between gateways, presenters, and entities. Usecases do not perform I/O directly — they delegate to gateways and presenters via dependency injection.

## Structure

Each usecase gets its own directory under `src/usecases/`, named in kebab-case after the gerund
phrase that describes what it does (e.g. `greeting`). The orchestration itself lives
in that directory's `index.ts`, and exports a factory function that receives gateways and
presenters.

```text
src/usecases/
  greeting/
    index.ts
    index.test.ts
    gateways/
    presenters/
```

```typescript
// src/usecases/greeting/index.ts
export const createGreetingUsecase = ({ gateways, presenters }) => async () => ...
```

Import the usecase by its directory, not by an explicit `/index` path:

```typescript
import { createGreetingUsecase } from '@/usecases/greeting';
```

This `index.ts` is the defining file, not a re-export barrel, so it does not conflict with the
"No re-exports via index.ts" rule in `.claude/rules/coding-standards.md`.

When a usecase has exactly one operation, the factory returns that operation directly instead of
wrapping it in an object with a single key:

```typescript
export const createGreetingUsecase =
  ({ gateways, presenters }) =>
  async (): Promise<Either.Either<void, Error>> => ...
```

Return an object keyed by operation name only when there are two or more operations.

## Factory Pattern

Usecases use a factory pattern for dependency injection:

- The factory function receives `gateways` and `presenters` as parameters
- No default values for dependencies — the caller (entry point) provides all concrete implementations
- The factory returns an object with the available operations

## Interface Type Definitions

Gateway and presenter interface types are defined under the usecase layer, not in the implementation files:

- `src/usecases/<domain>/gateways/` — gateway interface types
- `src/usecases/<domain>/presenters/` — presenter interface types

This follows Clean Architecture: the inner layer (usecase) defines interfaces, the outer layer (gateway/presenter) implements them.

These directories must contain **only type definitions** (`type`, `interface`). Value-level exports (`const`, `function`, `class`, `default export`) are forbidden and enforced by ESLint (`no-restricted-syntax`). Runtime code belongs in the implementation layer (`src/gateways/`, `src/presenters/`).

Define only the types the usecase itself receives. A factory type that only the controller uses does
not belong here — see "Dependency Injection" in `.claude/rules/controllers.md`.

## No Direct I/O

Usecases must not import from `src/gateways/` or `src/presenters/` implementation files. Only import interface types from `src/usecases/<domain>/gateways/` and `src/usecases/<domain>/presenters/`.

## Testing Guidelines

- Test via the factory: create usecases with mock gateways and presenters
- Test every branch: the success path, and each failure a gateway can return (file read failure, validation failure, API failure)
- Assert on the presenter mock to verify what the usecase decided to output
