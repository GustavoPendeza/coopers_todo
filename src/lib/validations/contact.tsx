import * as z from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email({ message: 'Invalid email address' }),
  telephone: z.string(),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
});

export type ContactFormData = z.infer<typeof contactSchema>;
