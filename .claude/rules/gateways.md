---
description: Rules for gateway definitions in src/gateways/
paths: ['src/gateways/**/*.ts']
---

# Gateway Rules

## What is a Gateway

Gateways are the I/O boundary of the application, responsible for communication with external data sources (API, DB, file system, console, etc.). They encapsulate all external access.

## Structure

Each gateway is a single file named `<domainConcept>.ts` (camelCase), placed directly under `src/gateways/`. The `Gateway` suffix is omitted because the directory name already conveys the layer.

A gateway file exports:

1. Async functions that perform I/O with external data sources
2. Functions accept domain entity types (defined in `src/entities/`) and handle conversion to external formats internally

```typescript
// src/gateways/airport.ts
import type { Airport } from '@/entities/airport';

export const updateAirport = async (airport: Airport): Promise<Either.Either<unknown, Error>> => {
  // convert domain type to external format internally
  // perform I/O
};
```

## Interface Types

Gateway interface types are defined in `src/usecases/<domain>/gateways/`, not in gateway implementation files. This follows Clean Architecture: the usecase layer defines what it needs, the gateway layer implements it.

## File Naming

- Gateway file: `<domainConcept>.ts` (camelCase, no `Gateway` suffix)
- Test file: `<domainConcept>.test.ts` (co-located)

When the concept is an activity rather than a thing, name the agent (`greetingSourceReader.ts`),
not the gerund — see "File Naming" in `.claude/rules/coding-standards.md`.

## Domain Types as Input, Domain Types as Output

Gateways accept domain entity types from the usecase layer and convert them to external formats (SDK types, API payloads, etc.) internally. This keeps SDK implementation details hidden from the usecase layer.

When reading external data, gateways return validated domain entity types — not raw `unknown`. Define separate functions per entity type so that each function encapsulates the schema internally and the usecase does not need to know what format the data source contains.

## Curried Read Functions

Read functions use a curried pattern so the usecase layer does not know the data source (file path, URL, etc.). The gateway exports a factory function that accepts the data source identifier and returns a thunk.

```typescript
// src/gateways/greetingSource.ts
export const createReadingGreetingSource =
  (filePath: string): ReadGreetingSource =>
  async (): Promise<Either.Either<GreetingSource, Error>> => {
    // read and parse file internally
  };
```

The controller binds the data source, and the usecase receives an argument-free function:

```typescript
// controller
readGreetingSource: gateways.createReadingGreetingSource(args.input),

// usecase interface
readonly readGreetingSource: () => Promise<Either.Either<GreetingSource, Error>>;
```

## Validating External Data with Zod

When a gateway receives data from an external source whose type is `unknown` or not statically guaranteed (API responses, stream payloads, etc.), use a zod schema to validate and extract the data. Do not use manual type guards or `isRecord` chains.

```typescript
// Good: zod schema for external data validation
const responseSchema = z.object({
  payload: z.object({
    data: z.object({ name: z.string() }),
  }),
});
const result = responseSchema.safeParse(response);

// Bad: manual type guard chain
if (!isRecord(response)) return undefined;
const payload = response.payload;
if (!isRecord(payload)) return undefined;
```

## No Business Logic in Gateways

Gateways contain only:

- External data source access (HTTP requests, DB queries, file reads, console output, etc.)
- Conversion from domain entity types to external formats (internal, not exposed)

No business logic, no domain rules, no orchestration of multiple gateways.

## Testing Guidelines

- Use test doubles (mock/stub) for external data sources
- Test that domain types are correctly converted to external formats
- Test error cases (network failure, invalid data, etc.)
- Do NOT test branch-free wrapper functions that merely delegate to another gateway — they are covered indirectly through controller or integration tests
