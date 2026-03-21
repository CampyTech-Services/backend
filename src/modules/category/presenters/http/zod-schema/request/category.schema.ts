import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).nonempty({ message: 'Category name is required' }),
  slug: z.string().trim().min(1),
  description: z.string().trim().optional(),
});

export const updateCategorySchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    slug: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });
