import { z } from 'zod';

export const credentialValidator = z.object({
    email: z.string().email(),
});