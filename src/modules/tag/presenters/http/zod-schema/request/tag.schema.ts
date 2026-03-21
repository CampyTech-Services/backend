import { z } from 'zod';

export const createTagSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
});

export const updateTagSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    slug: z.string().trim().min(1).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });
