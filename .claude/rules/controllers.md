---
description: Rules for controller definitions in src/controllers/
paths: ['src/controllers/**/*.ts']
---

# Controller Rules

## What is a Controller

Controllers define CLI commands using the citty framework. They translate external input (CLI arguments) into domain operations by wiring gateways and presenters into usecases.

## Structure

Each controller is a single file named `<concept>Controller.ts` (camelCase), placed directly under `src/controllers/`.

A controller file exports a factory function that receives gateways and presenters, and returns a citty command definition.

```typescript
// src/controllers/cliController.ts
const commandArgs = { ... } as const;

export const createCliCommand = ({ gateways, presenters }: {
  readonly gateways: { ... };
  readonly presenters: { ... };
}): CommandDef<typeof commandArgs> => {
  // define the command with citty's defineCommand
};
```

## CLI Framework

This project uses [citty](https://github.com/unjs/citty) for CLI command definition. Citty provides:

- Type-safe argument parsing from `args` definition
- Automatic help and error messages
- Subcommand routing, once the CLI grows beyond the single command the template ships with

Do not write manual CLI parsing logic. Use `defineCommand` and `args` definitions.

## File Naming

- Controller file: `<concept>Controller.ts` (camelCase)

## Dependency Injection

The `createCliCommand` function receives all external dependencies (gateways, presenters) as parameters. It does not import concrete implementations directly — the entry point (`index.ts`) provides them.

Type each dependency slot with the port type from `usecases/<domain>/gateways|presenters/`. Never use
`typeof <implementation>` — it binds the controller to the implementation's signature. For a factory
slot, compose the port type inline instead of defining a named factory type: such a type is used in
exactly one place, so "No single-use type definitions" in `.claude/rules/coding-standards.md`
applies.

```typescript
// Good
readonly createReadingGreetingSource: (filePath: string) => ReadGreetingSource;
readonly printGreeting: PrintGreeting;

// Bad
readonly createReadingGreetingSource: typeof createReadingGreetingSource;
readonly createReadingGreetingSource: CreateReadingGreetingSource;
```

## No Business Logic in Controllers

Controllers contain only:

- Citty command definitions (`args`, `meta`, `run`)
- Usecase factory creation and invocation
- Error handling (printing error logs and calling `process.exit`)

No domain rules, no direct I/O, no data transformation.

## Testing Guidelines

Controller logic is tested indirectly through usecase tests. CLI argument parsing is handled by citty and does not require unit tests.
