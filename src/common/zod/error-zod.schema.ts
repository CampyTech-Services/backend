import { z } from 'zod';
export const ClientErrorSchema = z.object({
  errorMessage: z.string(),
});
