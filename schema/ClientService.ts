import { z } from 'zod';

export const ClientServiceSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
        .max(50, 'Name must be at most 50 characters long'),
    
  email: z
    .string()
    .email('Invalid email address')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    ),
  
  phone: z
    .number()
    .min(1000000000, 'Phone number must be at least 10 digits')
    .max(9999999999, 'Phone number must be at most 10 digits'),
});
