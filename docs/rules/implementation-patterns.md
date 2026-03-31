# Implementation Patterns

<!-- Rules in this file are referenced by Claude Code during coding -->

## File Naming

- **Type**: MUST (use noun-based names); MUST NOT (use verb-based names)
- **Reason**: Verb-based names mirror a single function and collapse when a second related function is added; noun-based names represent the concern the file owns and accommodate growth without renaming.

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
// src/gateways/api/getDataAgent.ts
export function getDataAgent() { ... }
```
