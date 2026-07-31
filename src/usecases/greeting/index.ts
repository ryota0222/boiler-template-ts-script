import { Either } from 'effect';

import type { ReadGreetingSource } from '@/usecases/greeting/gateways/greetingSource';
import type { PrintGreeting } from '@/usecases/greeting/presenters/greeting';

import { buildGreeting } from '@/entities/greeting-source/greeting';

export const createGreetingUsecase =
  ({
    gateways,
    presenters,
  }: {
    readonly gateways: { readonly readGreetingSource: ReadGreetingSource };
    readonly presenters: { readonly printGreeting: PrintGreeting };
  }) =>
  async (): Promise<Either.Either<void, Error>> => {
    const sourceResult = await gateways.readGreetingSource();
    if (Either.isLeft(sourceResult)) {
      return Either.left(sourceResult.left);
    }

    presenters.printGreeting(buildGreeting(sourceResult.right));

    return Either.void;
  };
