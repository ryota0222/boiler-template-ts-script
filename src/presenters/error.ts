import type { PrintErrorLog } from '@/usecases/greeting/presenters/error';

export const printErrorLog: PrintErrorLog = (content) => {
  console.error(content);
};
