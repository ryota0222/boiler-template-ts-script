---
description: Coding best practices (code quality, error handling, performance, language policy)
---

# Coding Best Practices

## Code Quality

- Use meaningful variable and function names that convey purpose
- No abbreviations except widely known ones (e.g., ID, URL) — applies to variable names, function names, type names, and directory names (e.g., `Dependencies` not `Deps`, `Parameters` not `Params`). Widely known abbreviations must always be fully uppercased (e.g., `userID` not `userId`, `parseURL` not `parseUrl`)
- Do NOT use `default` as a prefix for verb-phrase identifiers. `default` is an adjective and must precede a noun, not a verb. To name a default implementation, either use `default` before a noun or restructure the name to avoid the prefix entirely.

  ```typescript
  // Good — default modifies a noun
  const defaultAgent = createDataAgent();
  const dataAgentByDefault = createDataAgent();

  // Bad — default precedes a verb phrase (grammatically incorrect)
  const defaultGetDataAgent = createDataAgent();
  const defaultPrintResult = (result: Result) => { ... };
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
  // 外部 API が未設定値をハイフンで返すため
  if (record.category === '-') { ... }
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

- Declare variables immediately before their first use, not at the top of a function or module scope

  ```typescript
  // Good: declared just before use
  const run = (): void => {
    doSomething();
    const decimalPlaces = 2;
    console.log(value.toFixed(decimalPlaces));
  };

  // Bad: declared far from use
  const decimalPlaces = 2;
  const run = (): void => {
    doSomething();
    console.log(value.toFixed(decimalPlaces));
  };
  ```

- No single-use type definitions (inline at the usage site). Define `type` only when it is used in multiple places.

  ```typescript
  // Good: inline in function signature
  const run = async ({ argv, gateways }: {
    readonly argv: readonly string[];
    readonly gateways: { readonly printErrorLog: (content: string) => void };
  }): Promise<void> => { ... };

  // Bad: type used only once
  type RunParams = {
    readonly argv: readonly string[];
    readonly gateways: { readonly printErrorLog: (content: string) => void };
  };
  const run = async ({ argv, gateways }: RunParams): Promise<void> => { ... };
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

- CLI output messages, code comments, test names, and commit messages must be written in Japanese
- Rule files (`.claude/rules/`, `docs/rules/`) must be written in English

## Boolean Naming

Boolean variables must use `is`, `has`, or `should` prefix. Do not use negated forms (`isNot`, `hasNo`, `shouldNot`) — use affirmative names and negate at the call site.

```typescript
// Good
const isDryRun = args.includes('--dry-run');
const hasPermission = user.roles.includes('admin');
const hasValue = (value: unknown): boolean => value !== null;

// Bad
const dryRun = args.includes('--dry-run');
const permission = user.roles.includes('admin');
const isNotNull = (value: unknown): boolean => value !== null;
```

## If Statement Style

Always use block form for `if` statements. Single-line `if` is forbidden.

```typescript
// Good
if (Either.isLeft(result)) {
  return result;
}

// Bad
if (Either.isLeft(result)) return result;
```

## Nesting Limit

Maximum nesting depth is 1 level inside a function body. Extract nested logic into separate functions.

```typescript
// Good: flat with extracted function
const dryRun = async (...) => {
  if (Either.isLeft(result)) {
    return result;
  }
  return Either.right(undefined);
};

const addContext = async (...) => {
  if (command.isDryRun) {
    return dryRun(...);
  }
  return update(...);
};

// Bad: 2-level nesting
const addContext = async (...) => {
  if (command.isDryRun) {
    if (Either.isLeft(result)) {
      return result;
    }
  }
};
```

## Higher-Order Function Naming

Name higher-order functions (factories that return functions) as `create` + gerund (e.g., `createReading...`, `createPrinting...`). Do not use `create` + bare verb (e.g., `createRead...`, `createPrint...`), as consecutive verbs are grammatically incorrect.

```typescript
// Good: create + gerund
export const createReadingGreetingSource = (filePath: string): ReadGreetingSource => ...;
export const createPrintingGreeting = ({ format }: ...): PrintGreeting => ...;

// Bad: create + bare verb
export const createReadGreetingSource = (filePath: string): ReadGreetingSource => ...;
export const createPrintGreeting = ({ format }: ...): PrintGreeting => ...;
```

## File Naming

When any word in a file name could be interpreted as either a verb or a noun (e.g., `retry`, `run`, `update`, `read`, `try`, `catch`, `parse`), use the gerund form (`retrying`, `running`, `updating`, `reading`, `trying`, `catching`, `parsing`) to remove ambiguity. A file represents a unit of work, and the gerund unambiguously names that activity. Function names within the file follow the verb-phrase convention separately.

```text
# Good: gerund makes the meaning clear
src/utilities/exponentialBackoffRetrying.ts
src/utilities/immediateRetrying.ts
src/utilities/errorCatchingToEither.ts
src/entities/safeParsingToEither.ts

# Bad: ambiguous (verb or noun?)
src/utilities/exponentialBackoffRetry.ts
src/utilities/immediateRetry.ts
src/utilities/tryCatchToEither.ts
src/entities/safeParseToEither.ts
```

Under `gateways/`, `presenters/`, and `usecases/*/gateways|presenters/`, use the agent noun
(`<verb>er`) instead of the gerund: `greetingSourceReader.ts`, not `greetingSourceReading.ts`. A file
already named by a plain noun (`environment.ts`, `artifact.ts`) stays as it is. The directory
supplies the subject, so omit what it already says. Function names inside the file are unaffected.

```text
# Good: agent noun
src/gateways/greetingSourceReader.ts
src/presenters/greetingPrinter.ts

# Bad: gerund
src/gateways/greetingSourceReading.ts
```

## Blank Line Grouping

Group related statements into logical blocks separated by blank lines. Each block should represent one step of the function's work (e.g., fetch data, check error, compute result). Do not write long sequences of statements without blank lines.

```typescript
// Good: grouped by logical step
const configResult = await gateways.readConfig();
if (Either.isLeft(configResult)) {
  return Either.left(configResult.left);
}

const recordResult = await gateways.readRecords(configResult.right.source);
if (Either.isLeft(recordResult)) {
  return Either.left(recordResult.left);
}

const summary = summarizeRecords(recordResult.right);

// Bad: no blank lines between unrelated steps
const configResult = await gateways.readConfig();
if (Either.isLeft(configResult)) {
  return Either.left(configResult.left);
}
const recordResult = await gateways.readRecords(configResult.right.source);
if (Either.isLeft(recordResult)) {
  return Either.left(recordResult.left);
}
const summary = summarizeRecords(recordResult.right);
```

## No Shared Base Types

Do not group multiple functions' dependencies into a shared base type. Each function defines its own dependency type independently, so that changes to one function do not affect others.

```typescript
// Good: each function has its own type
type GreetingGateways = { readonly readGreetingSource: ReadGreetingSource };
type FarewellGateways = { readonly readFarewellSource: ReadFarewellSource };

// Bad: shared base type couples unrelated functions
type BaseGateways = { readonly readConfig: ReadConfig; readonly readJSONFile: ReadJSONFile };
type GreetingGateways = BaseGateways & { readonly readGreetingSource: ReadGreetingSource };
```

## CLI Entry Point Constraints

- No conditional logic (`if`, `switch`, ternary) in the entry point (`index.ts`)
- Extract conditional logic into separate files as functions
- Entry point is limited to function calls, `console.log`, and `process.exit`

  ```typescript
  // Good: index.ts
  import { runMain } from 'citty';

  import { createCliCommand } from '@/controllers/cliController';

  void runMain(createCliCommand({ gateways: { ... }, presenters: { ... } }));

  // Bad: conditional logic in index.ts
  if (process.argv[2] === '--dry-run') { ... }
  ```

## Internal Directory Placement

Place each `internal/` directory directly under the module directory it belongs to, not under any ancestor directory shared by multiple modules.

```typescript
// Good: formatGreetingLine belongs to greeting, so internal/ lives there
// src/presenters/greeting/internal/formatGreetingLine.ts

// Bad: internal/ placed at a shared ancestor, leaking to siblings
// src/presenters/internal/formatGreetingLine.ts
// src/internal/formatGreetingLine.ts
```

Extract to `internal/` anything that has to be exported for a co-located test or a sibling module to
reach it, yet is not part of the module's public API. Exporting for testability otherwise widens the
public surface permanently; `internal/` restores the boundary, because dependency-cruiser lets only
the parent directory import it. One such export justifies the directory — the number of definitions
in a file is not the trigger, and neither is its length. This holds in every layer where `internal/`
is valid, not only `entities/`.

Files inside `internal/` may import each other; only modules outside the parent directory are shut
out.

## ESLint Disable Comments

`eslint-disable` and `v8 ignore` are **forbidden**. The lefthook pre-commit hooks (`no-eslint-disable` / `no-v8-ignore`) reject any commit that introduces them under `src/`.

When a rule feels impossible to satisfy, revisit the design first. If it still cannot be avoided, do not suppress the rule on your own judgement — consult the user about changing the ESLint configuration or granting an explicit exception.

## Additional Rules

- Follow all rule files under `docs/rules/` (except `template.md`)
