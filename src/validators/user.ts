// src/schemas/userSchema.ts
import { z } from 'zod';

export const getUsersValidatorSchema = z.object({
  filter: z.enum(['username', 'displayName']).optional(),
  value: z.string().optional(),
});


export const createUserValidatorSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  displayName: z.string().optional().nullable(),
});

export const updateUserValidatorSchema = z.object({
  username: z.string().optional(),
  displayName: z.string().optional().nullable(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
});

export const patchUserValidatorSchema = z.object({
  username: z.string().optional(),
  displayName: z.string().optional().nullable(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
});