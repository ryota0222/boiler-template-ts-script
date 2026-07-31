import { Either } from 'effect';
import { describe, expect, it } from 'vitest';

import { errorCatchingToEither } from '@/utilities/errorCatchingToEither';

describe('errorCatchingToEither', () => {
  it('例外が発生しない場合、戻り値をRightで返すこと', async () => {
    const actual = await errorCatchingToEither(() => 'ok');

    const expected = Either.right('ok');
    expect(actual).toEqual(expected);
  });

  it('Errorが投げられた場合、そのErrorをLeftで返すこと', async () => {
    const cause = new Error('失敗しました');

    const actual = await errorCatchingToEither(() => {
      throw cause;
    });

    const expected = Either.left(cause);
    expect(actual).toEqual(expected);
  });

  it('Error以外が投げられた場合、文字列化してErrorに包むこと', async () => {
    const cause: unknown = '文字列の例外';

    const actual = await errorCatchingToEither(() => {
      throw cause;
    });

    const expected = Either.left(new Error('文字列の例外'));
    expect(actual).toEqual(expected);
  });
});
