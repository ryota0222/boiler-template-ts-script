import { Either } from 'effect';
import { describe, expect, it, vi } from 'vitest';

import { createGreetingUsecase } from '@/usecases/greeting';

describe('createGreetingUsecase', () => {
  it('読み込みが成功した場合、Rightを返すこと', async () => {
    const runGreeting = createGreetingUsecase({
      gateways: { readGreetingSource: () => Promise.resolve(Either.right({ name: '山田' })) },
      presenters: { printGreeting: vi.fn() },
    });

    const actual = await runGreeting();

    const expected = Either.void;
    expect(actual).toEqual(expected);
  });

  it('読み込みが成功した場合、組み立てた挨拶文を出力すること', async () => {
    const printGreeting = vi.fn();
    const runGreeting = createGreetingUsecase({
      gateways: { readGreetingSource: () => Promise.resolve(Either.right({ name: '山田' })) },
      presenters: { printGreeting },
    });

    await runGreeting();

    expect(printGreeting).toHaveBeenCalledWith('こんにちは、山田さん');
  });

  it('読み込みが失敗した場合、そのエラーを左辺値として返すこと', async () => {
    const cause = new Error('読み込みに失敗しました');
    const runGreeting = createGreetingUsecase({
      gateways: { readGreetingSource: () => Promise.resolve(Either.left(cause)) },
      presenters: { printGreeting: vi.fn() },
    });

    const actual = await runGreeting();

    const expected = Either.left(cause);
    expect(actual).toEqual(expected);
  });

  it('読み込みが失敗した場合、挨拶文を出力しないこと', async () => {
    const printGreeting = vi.fn();
    const runGreeting = createGreetingUsecase({
      gateways: {
        readGreetingSource: () => Promise.resolve(Either.left(new Error('読み込みに失敗しました'))),
      },
      presenters: { printGreeting },
    });

    await runGreeting();

    expect(printGreeting).not.toHaveBeenCalled();
  });
});
