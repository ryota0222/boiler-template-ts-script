import { Either } from 'effect';

export const errorCatchingToEither = async <T>(
  runningTask: () => T
): Promise<Either.Either<Awaited<T>, Error>> => {
  try {
    return Either.right(await runningTask());
  } catch (cause: unknown) {
    return Either.left(cause instanceof Error ? cause : new Error(String(cause)));
  }
};
