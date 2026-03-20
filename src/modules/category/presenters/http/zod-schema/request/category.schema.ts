import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).nonempty({ message: 'Category name is required' }),
  slug: z.string().min(1),
  description: z.string().optional(),
});
