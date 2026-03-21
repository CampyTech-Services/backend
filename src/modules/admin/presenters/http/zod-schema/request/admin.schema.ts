import { z } from 'zod';

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(8);
const nonEmptyString = z.string().trim().min(1);
const optionalString = z.string().trim().optional();

export const createAdminSchema = z.object({
  name: nonEmptyString,
  displayName: nonEmptyString,
  email: emailSchema,
  password: passwordSchema,
  shortBio: optionalString,
  role: nonEmptyString,
  profilePicture: optionalString,
});

export const updateAdminSchema = z
  .object({
    name: nonEmptyString.optional(),
    displayName: nonEmptyString.optional(),
    email: emailSchema.optional(),
    shortBio: optionalString,
    role: nonEmptyString.optional(),
    profilePicture: optionalString,
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field must be provided',
  });

export const loginAdminSchema = z.object({
  email: emailSchema,
  password: nonEmptyString,
});

export const updateAdminStatusSchema = z.object({
  isActive: z.boolean(),
});

export const updateAdminVerificationSchema = z.object({
  isVerified: z.boolean(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: nonEmptyString,
    newPassword: passwordSchema,
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: 'New password must be different from the current password',
    path: ['newPassword'],
  });
