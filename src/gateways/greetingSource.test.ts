import { Either } from 'effect';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createReadingGreetingSource } from '@/gateways/greetingSource';

let temporaryDirectory: string;

beforeEach(async () => {
  temporaryDirectory = await mkdtemp(join(tmpdir(), 'greeting-source-test-'));
});

afterEach(async () => {
  await rm(temporaryDirectory, { force: true, recursive: true });
});

describe('createReadingGreetingSource', () => {
  it('妥当なJSONの場合、検証済みの値を返すこと', async () => {
    const filePath = join(temporaryDirectory, 'source.json');
    await writeFile(filePath, JSON.stringify({ name: '山田' }));

    const actual = await createReadingGreetingSource(filePath)();

    const expected = Either.right({ name: '山田' });
    expect(actual).toEqual(expected);
  });

  it('ファイルが存在しない場合、Leftを返すこと', async () => {
    const filePath = join(temporaryDirectory, 'missing.json');

    const actual = Either.isLeft(await createReadingGreetingSource(filePath)());

    const expected = true;
    expect(actual).toBe(expected);
  });

  it('JSONとして壊れている場合、Leftを返すこと', async () => {
    const filePath = join(temporaryDirectory, 'broken.json');
    await writeFile(filePath, '{');

    const actual = Either.isLeft(await createReadingGreetingSource(filePath)());

    const expected = true;
    expect(actual).toBe(expected);
  });

  it('スキーマに合致しない場合、Leftを返すこと', async () => {
    const filePath = join(temporaryDirectory, 'invalid.json');
    await writeFile(filePath, JSON.stringify({ name: '' }));

    const actual = Either.isLeft(await createReadingGreetingSource(filePath)());

    const expected = true;
    expect(actual).toBe(expected);
  });
});
