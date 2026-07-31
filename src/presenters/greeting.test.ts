import { afterEach, expect, it, vi } from 'vitest';

import { printGreeting } from '@/presenters/greeting';

afterEach(() => {
  vi.restoreAllMocks();
});

it('挨拶文を渡した場合、標準出力へ書き出すこと', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(() => void 0);

  printGreeting('こんにちは、山田さん');

  expect(log).toHaveBeenCalledWith('こんにちは、山田さん');
});
