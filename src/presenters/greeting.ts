import type { PrintGreeting } from '@/usecases/greeting/presenters/greeting';

export const printGreeting: PrintGreeting = (greeting) => {
  console.log(greeting);
};
