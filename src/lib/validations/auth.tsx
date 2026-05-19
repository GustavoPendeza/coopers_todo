import * as z from 'zod';

export const authSchema = z.object({
  username: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Must be at least 6 characters')
});

export type AuthFormData = z.infer<typeof authSchema>;
