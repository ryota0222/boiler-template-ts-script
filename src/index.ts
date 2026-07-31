import { runMain } from 'citty';

import { createCliCommand } from '@/controllers/cliController';
import { createReadingGreetingSource } from '@/gateways/greetingSource';
import { printErrorLog } from '@/presenters/error';
import { printGreeting } from '@/presenters/greeting';

void runMain(
  createCliCommand({
    gateways: { createReadingGreetingSource },
    presenters: { printErrorLog, printGreeting },
  })
);
