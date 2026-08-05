---
description: Rules for entity definitions in src/entities/
paths: ['src/entities/**/*.ts', '!src/entities/**/*.test.ts']
---

# Entity Rules

## What is an Entity

Entities are central elements of domain models, representing business concepts within the domain. They are implemented as **types and functions**, not classes (data must be serializable for persistence).

## Structure

Each entity file exports:

1. A `schema` (zod object, always `.readonly()`)
2. A `Type` inferred from the schema (`zod.infer<typeof schema>`)
3. Pure functions that operate on the entity

```typescript
export const schema = z
  .object({
    iataCode: iataCodeSchema,
    sortIndex: sortIndexSchema,
  })
  .readonly();

export type Airport = z.infer<typeof schema>;

const sort = (airportArray: Airport[]): Airport[] =>
  sortBy(airportArray, (airport) => airport.sortIndex);
```

Not every entity file needs a schema. Add one only when the file defines a data structure that
crosses a boundary — an API response, a configuration value, an external code system. A structure
computed inside the application is defined as a plain `type` with no schema, because there is
nothing to validate. A file that only derives values from other values exports just its pure
functions, with neither type nor schema; `entities/greeting-source/greeting.ts`, which turns a
validated source into a greeting string, is an example.

## Type Name Matches File Name

The type an entity file exports must be the PascalCase form of that file's name; for `index.ts`, of
the directory name (`entities/airport/index.ts` exports `Airport`). Do not prefix it with the parent
directory or parent entity name — the import path already supplies that context, the same reason
`gateways/` and `presenters/` omit their layer suffix. When a file exports several types, the one
named after the file is the primary type; the rest are named for what they are, still unprefixed.

```typescript
// Good: src/entities/airport/runways.ts
export type Runways = { ... };

// Bad: parent directory repeated in the type name
export type AirportRunways = { ... };
```

Port types under `usecases/*/gateways|presenters/` are exempt — they are named after the operation
(`ReadGreetingSource`, `PrintErrorLog`), not after the file.

Resolve a collision with another module's type at the import site with an alias, never by baking
the prefix into the definition. Alias only where the bare name is ambiguous; where the importing
file's own path already supplies the subject, keep it bare.

```typescript
// an importer that declares its own Greeting needs an alias
import type { Greeting as SourceGreeting } from '@/entities/greeting-source/greeting';

// under a path that already says greeting-source, keep it bare
import type { Greeting } from '@/entities/greeting-source/greeting';
```

## No Logic in Entities

Entities contain only:

- Zod schema definitions
- Type exports
- Pure functions that operate on the entity type

No I/O, no side effects, no external service calls.

## Entity Schema Represents Domain, Not Backend

Entity schemas define the domain model — they are NOT a mirror of backend data structures (database columns, API responses, CSV fields, etc.). Design schemas with the most appropriate types and structure for the domain, regardless of how data is stored or transferred externally.

- Use `z.iso.date()` / `z.iso.time()` instead of raw `z.string().regex()` when the value represents a date or time
- Use `z.uuid()` instead of `z.string()` when the value is a UUID
- Field names follow domain conventions (e.g., `userID`), not backend conventions (e.g., `user_id`)
- Gateways are responsible for mapping between external data and entity schemas

Sharing field names with an external source does not by itself make a schema a mirror of it. A schema
counts as a domain model once it is defined as the structure the application needs: fields the
application does not use are dropped, and the object shape itself is redefined for the domain rather
than carried over. What this rule forbids is adopting the external structure as it stands.
