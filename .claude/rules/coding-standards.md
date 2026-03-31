---
description: Coding best practices (code quality, error handling, performance, language policy)
---

# Coding Best Practices

## Code Quality

- Use meaningful variable and function names that convey purpose
- No abbreviations except widely known ones (e.g., ID, URL) — applies to variable names, function names, and directory names. Widely known abbreviations must always be fully uppercased (e.g., `userID` not `userId`, `parseURL` not `parseUrl`)
- Do NOT use `default` as a prefix for verb-phrase identifiers. `default` is an adjective and must precede a noun, not a verb. To name a default implementation, either use `default` before a noun or restructure the name to avoid the prefix entirely.

  ```typescript
  // Good — default modifies a noun
  const defaultAgent = createDataAgent();
  const dataAgentByDefault = createDataAgent();

  // Bad — default precedes a verb phrase (grammatically incorrect)
  const defaultGetDataAgent = createDataAgent();
  const defaultPrintResult = (result: Result) => { ... };
  ```

- Boolean variable names MUST use a prefix that expresses behavior or state:

  | Pattern               | Examples                     |
  | --------------------- | ---------------------------- |
  | `is` + noun/adjective | `isEnabled`, `isEmpty`       |
  | `has` + noun          | `hasError`, `hasPermission`  |
  | `should` + verb       | `shouldDryRun`, `shouldSkip` |
  | `can` + verb          | `canRetry`, `canDelete`      |

  ```typescript
  // Good
  const isEnabled = true;
  const shouldDryRun = options.dryRun;

  // Bad
  const enabled = true;
  const dryRun = options.dryRun;
  ```

- File names must be noun-based (representing the concept or concern they own); verb-based file names are forbidden. Follow layer suffix conventions (`*Gateway`, `*Parser`, `*Formatter`, etc.).

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

- **NEVER write comments that explain WHAT the code does.** Code must be self-explanatory through naming and structure. Comments are ONLY permitted when explaining WHY — the non-obvious reason or intent behind a decision that cannot be expressed through code alone. JSDoc (`/** */`), inline (`//`), and block (`/* */`) comments are all subject to this rule. If you feel the need to explain what code does, rewrite the code to be clearer instead of adding a comment.

  ```typescript
  // FORBIDDEN: explains what (obvious from the code)
  /** H:MM:SS 形式の時間文字列（時は1〜2桁） */
  export const schema = z.string().regex(/^\d{1,2}:\d{2}:\d{2}$/);

  // FORBIDDEN: explains what
  // エントリをメンバーごとにグルーピングする
  const grouped = groupBy(entries, (e) => e.member);

  // ALLOWED: explains why (non-obvious business reason)
  // eslint-disable-next-line no-inline-comments
  if (entry.project === '-') { ... } // Toggl CSV では未設定値がハイフンで表現されるため
  ```

  ```typescript
  // Good
  const userCount = users.length;
  // Bad
  const uCnt = users.length;
  ```

- No re-exports via `index.ts` (import directly from the defining file)

  ```typescript
  // Good
  import { AuthUser } from '@/entities/AuthUser';
  // Bad
  import { AuthUser } from '@/entities/index';
  ```

- No backward-compatibility code (delete obsolete code immediately)

  ```typescript
  // Good: remove old definition when changing interface
  type User = { id: string; fullName: string };
  // Bad: keeping old interface
  type User = { id: string; fullName: string; /** @deprecated */ name?: string };
  ```

- No fallback handling (throw immediately on errors)

  ```typescript
  // Good
  if (!data.userId) throw new Error('userId is missing');
  // Bad
  const userId = data.userId ?? 'unknown';
  ```

- No single-use variables (inline at the usage site)

  ```typescript
  // Good
  console.log(formatDate(new Date()));
  // Bad
  const formattedDate = formatDate(new Date());
  console.log(formattedDate);
  ```

## Error Handling & Robustness

- Catch unexpected errors and log actionable diagnostics
- Return appropriate exit codes on process termination (success: 0, failure: 1+)
- Always release resources such as file handles and network connections

  ```typescript
  // Good: use `using` declarations or try-finally to ensure cleanup
  await using file = await openFile('data.csv');
  ```

## Performance

- Use streams or batch processing for large data to minimize memory usage

  ```typescript
  // Good: stream processing
  const stream = createReadStream('large.csv');
  // Bad: loading entire file into memory
  const content = readFileSync('large.csv', 'utf-8');
  ```

- Avoid synchronous blocking operations; use async I/O
- Prevent memory leaks by cleaning up object references and event listeners

## Internal Directory Placement

Place each `internal/` directory directly under the module directory it belongs to, not under any ancestor directory shared by multiple modules.

```typescript
// Good: formatPrefix belongs to inspection-output, so internal/ lives there
// src/presenters/inspection-output/internal/formatPrefix.ts

// Bad: internal/ placed at a shared ancestor, leaking to siblings
// src/presenters/internal/formatPrefix.ts
// src/internal/formatPrefix.ts
```

## ESLint Disable Comments

When suppressing an ESLint rule with `// eslint-disable-next-line` or `/* eslint-disable */`, always add a Japanese comment on the line above explaining why the rule is being disabled.

```typescript
// Good
// ANSIエスケープコード（\u001b）はターミナルカラー除去のために意図的に使用
// eslint-disable-next-line no-control-regex
const stripped = output.replace(/\u001b\[[0-9;]*m/g, '');

// RGB値は本質的に数値であり定数として定義している
/* eslint-disable @typescript-eslint/no-magic-numbers */
const from: [number, number, number] = [255, 120, 200];
/* eslint-enable @typescript-eslint/no-magic-numbers */

// Bad: no reason given
// eslint-disable-next-line no-control-regex
const stripped = output.replace(/\u001b\[[0-9;]*m/g, '');
```

## Additional Rules

- Follow all rule files under `docs/rules/` (except `template.md`)
