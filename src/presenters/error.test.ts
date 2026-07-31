import { afterEach, expect, it, vi } from 'vitest';

import { printErrorLog } from '@/presenters/error';

afterEach(() => {
  vi.restoreAllMocks();
});

it('内容を渡した場合、標準エラー出力へ書き出すこと', () => {
  const error = vi.spyOn(console, 'error').mockImplementation(() => void 0);

  printErrorLog('読み込みに失敗しました');

  expect(error).toHaveBeenCalledWith('読み込みに失敗しました');
});
