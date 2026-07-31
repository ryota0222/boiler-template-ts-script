import { describe, expect, it } from 'vitest';

import { schema } from '@/entities/greeting-source';

describe('schema', () => {
  it('nameが1文字以上の場合、パースが成功すること', () => {
    const actual = schema.safeParse({ name: '山田' }).success;

    const expected = true;
    expect(actual).toBe(expected);
  });

  it('nameが空文字の場合、パースが失敗すること', () => {
    const actual = schema.safeParse({ name: '' }).success;

    const expected = false;
    expect(actual).toBe(expected);
  });

  it('nameが未設定の場合、パースが失敗すること', () => {
    const actual = schema.safeParse({}).success;

    const expected = false;
    expect(actual).toBe(expected);
  });
});
