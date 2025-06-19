import { z } from 'zod';

export const credentialValidator = z.object({
  email: z.string().email(),
});

export const signInValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
