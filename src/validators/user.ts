// src/schemas/userSchema.ts
import { z } from 'zod';

export const getUsersValidatorSchema = z.object({
  filter: z.enum(['username', 'displayName']).optional(),
  value: z.string().optional(),
});


export const createUserValidatorSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  displayName: z.string().optional().nullable(),
});