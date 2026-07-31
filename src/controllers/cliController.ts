import { type CommandDef, defineCommand } from 'citty';
import { Either } from 'effect';

import type { createReadingGreetingSource } from '@/gateways/greetingSource';
import type { PrintErrorLog } from '@/usecases/greeting/presenters/error';
import type { PrintGreeting } from '@/usecases/greeting/presenters/greeting';

import { createGreetingUsecase } from '@/usecases/greeting';

const commandArgs = {
  input: {
    description: '挨拶対象を記述した JSON ファイルへのパス',
    required: true,
    type: 'string',
  },
} as const;

export const createCliCommand = ({
  gateways,
  presenters,
}: {
  readonly gateways: {
    readonly createReadingGreetingSource: typeof createReadingGreetingSource;
  };
  readonly presenters: {
    readonly printErrorLog: PrintErrorLog;
    readonly printGreeting: PrintGreeting;
  };
}): CommandDef<typeof commandArgs> =>
  defineCommand({
    args: commandArgs,
    meta: {
      description: '挨拶を出力する',
      name: 'greet',
    },
    run: async ({ args }) => {
      const runGreeting = createGreetingUsecase({
        gateways: {
          readGreetingSource: gateways.createReadingGreetingSource(args.input),
        },
        presenters: { printGreeting: presenters.printGreeting },
      });

      const result = await runGreeting();
      if (Either.isLeft(result)) {
        presenters.printErrorLog(result.left.message);
        process.exit(1);
      }
    },
  });
