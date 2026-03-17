---
description: Coding best practices (code quality, error handling, performance, language policy)
---

# Coding Best Practices

## Code Quality

- Use meaningful variable and function names that convey purpose
- Document public APIs with clear comments
- No abbreviations except widely known ones (e.g., ID, URL)

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

## Language Policy

- All documentation, CLI output messages, code comments, test names, and commit messages must be written in Japanese

## CLI Entry Point Constraints

- No conditional logic (`if`, `switch`, ternary) in the entry point (`index.ts`)
- Extract conditional logic into separate files as functions
- Entry point is limited to function calls, `console.log`, and `process.exit`

  ```typescript
  // Good: index.ts
  import { run } from '@/libs/runner/run';
  const result = await run();
  console.log(result);
  process.exit(0);

  // Bad: conditional logic in index.ts
  if (process.argv[2] === '--dry-run') { ... }
  ```

## Additional Rules

- Follow all rule files under `docs/rules/` (except `template.md`)
