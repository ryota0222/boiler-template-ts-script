import { expect, it } from 'vitest';

import { buildGreeting } from '@/entities/greeting-source/greeting';

it('nameを埋め込んだ挨拶文を返すこと', () => {
  const actual = buildGreeting({ name: '山田' });

  const expected = 'こんにちは、山田さん';
  expect(actual).toBe(expected);
});
