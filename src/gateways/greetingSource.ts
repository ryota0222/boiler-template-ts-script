import { Either } from 'effect';
import { readFile } from 'node:fs/promises';

import type { ReadGreetingSource } from '@/usecases/greeting/gateways/greetingSource';

import { schema } from '@/entities/greeting-source';
import { errorCatchingToEither } from '@/utilities/errorCatchingToEither';

export const createReadingGreetingSource =
  (filePath: string): ReadGreetingSource =>
  async () => {
    const contentResult = await errorCatchingToEither(() => readFile(filePath, 'utf8'));
    if (Either.isLeft(contentResult)) {
      return Either.left(contentResult.left);
    }

    const parsedResult = await errorCatchingToEither((): unknown =>
      JSON.parse(contentResult.right)
    );
    if (Either.isLeft(parsedResult)) {
      return Either.left(parsedResult.left);
    }

    const validated = schema.safeParse(parsedResult.right);
    if (!validated.success) {
      return Either.left(new Error(validated.error.message));
    }

    return Either.right(validated.data);
  };
