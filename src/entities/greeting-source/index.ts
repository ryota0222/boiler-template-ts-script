import { z } from 'zod';

export const schema = z
  .object({
    name: z.string().min(1),
  })
  .readonly();

export type GreetingSource = z.infer<typeof schema>;
