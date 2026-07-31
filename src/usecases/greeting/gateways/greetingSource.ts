import type { Either } from 'effect';

import type { GreetingSource } from '@/entities/greeting-source';

export type ReadGreetingSource = () => Promise<Either.Either<GreetingSource, Error>>;
