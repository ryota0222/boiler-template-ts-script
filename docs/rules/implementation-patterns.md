# Implementation Patterns

<!-- Rules in this file are referenced by Claude Code during coding -->

## File Naming

- **Type**: MUST NOT
- **Reason**: A verb-based file name mirrors a single function and breaks down as soon as a
  second related function is added — there is no natural name for both to share. A noun-based
  name represents the concern the file owns, so related functions can grow inside it without
  requiring a rename.

### Details

Name files after the concept or concern they own, not after the operation they perform.
Follow the suffix conventions of the layer they belong to (`*Gateway`, `*Parser`, `*Formatter`, etc.).

| Before (verb-based) | After (noun-based)    |
| ------------------- | --------------------- |
| `getDataAgent.ts`   | `dataAgentGateway.ts` |
| `fetchUser.ts`      | `userGateway.ts`      |
| `parseConfig.ts`    | `configParser.ts`     |
| `formatDate.ts`     | `dateFormatter.ts`    |

```typescript
// Good
// src/gateways/api/dataAgentGateway.ts
export function getDataAgent() { ... }
export function updateDataAgent() { ... }

// Bad
// src/gateways/api/getDataAgent.ts  ← verb-based; breaks when a second function is added
export function getDataAgent() { ... }
```
