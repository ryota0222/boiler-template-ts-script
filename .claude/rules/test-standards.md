---
description: Test standards for creating and editing test files (*.test.ts)
paths: ['**/*.test.ts']
---

# Test Standards

Follow these rules when editing `.test.ts` files.

## AAA Pattern

All tests must follow the AAA (Arrange-Act-Assert) pattern.

- **Arrange**: Set up test data and preconditions (may be omitted if unnecessary)
- **Act**: Execute the code under test
- **Assert**: Verify expected results
- Separate each section with a **blank line**

```typescript
it('returns masked string when given 10-digit input', () => {
  // Arrange
  const input = '1234567890';

  // Act
  const actual = maskString(input);

  // Assert
  const expected = '*******890';
  expect(actual).toBe(expected);
});
```

## One Test, One Assertion

Each test verifies only one behavior.

## `toBe` / `toEqual` Rules

- Store the Act result in an **`actual`** variable (`result`, `output`, `ret`, etc. are not allowed)
- Store the expected value in an **`expected`** variable
- Use the form `expect(actual).toBe(expected)` or `expect(actual).toEqual(expected)`
- **Never pass literals directly** to `toBe()` / `toEqual()`

```typescript
// Good
const expected = '*******5678';
expect(actual).toBe(expected);

// Bad
expect(result).toBe('*******5678');
```

- This rule applies only when using `toBe` / `toEqual`
- Does not apply to assertions without `actual` / `expected` equivalents, such as exception tests (`toThrow`) or mock verifications (`toHaveBeenCalled`)

## Test File Location

Test files are co-located in the **same directory** as their source.

```
src/
  utils/
    maskString.ts
    maskString.test.ts  ← co-located
```

## `describe` Structure

- Create separate `describe` blocks for each function in the source
- **No single-test `describe`**: If a `describe` contains only one test, it is unnecessary. Write the test directly in the parent `describe` or at the top level

## Test Names

Write **descriptive names in Japanese** that clearly state "what" and "expected outcome".

```typescript
// Good
it('入力が空文字の場合、空文字を返す', () => { ... });

// Bad
it('empty test', () => { ... });
```

## Independence

- Tests must be independent and not depend on execution order
- Mock external dependencies to ensure unit test isolation

## CLI Entry Point Constraints

- CLI entry points (e.g., `index.ts`) are excluded from test coverage
- Extract conditional logic into separate files as functions, and ensure 100% coverage for those files
