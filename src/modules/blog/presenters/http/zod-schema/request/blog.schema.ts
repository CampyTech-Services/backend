import { z } from 'zod';

const blogStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
const uuidMessage = 'Must be a valid UUID';
const tagIdsSchema = z.array(z.string().uuid(uuidMessage)).optional();

export const createBlogSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(200),
  featuredImage: z.string().trim().min(1),
  content: z.string().trim().min(1),
  excerpt: z.string().trim().optional(),
  status: blogStatusSchema.optional(),
  categoryId: z.string().uuid(uuidMessage),
  authorId: z.string().uuid(uuidMessage),
  tagIds: tagIdsSchema,
});

export const updateBlogSchema = z
  .object({
    title: z.string().trim().min(3).max(200).optional(),
    slug: z.string().trim().min(3).max(200).optional(),
    featuredImage: z.string().trim().min(1).optional(),
    content: z.string().trim().min(1).optional(),
    excerpt: z.string().trim().optional(),
    status: blogStatusSchema.optional(),
    categoryId: z.string().uuid(uuidMessage).optional(),
    authorId: z.string().uuid(uuidMessage).optional(),
    tagIds: tagIdsSchema,
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });
