import { z } from 'zod';

export const CreateTaskSchema = z.object({
  name: z
    .string()
    .min(1, 'Task name is required')
    .max(100, 'Task name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  project_id: z.string().min(1, 'Project ID is required'),
  project_name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters'),
  due_date: z.date().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
  priority: z.enum(['Low', 'Medium', 'High']),
  ai_suggested: z.boolean().default(false),
  time_taken: z.number().int().min(0).default(0), // Seconds
  start_time: z.string().optional().nullable(),
});

export const UpdateTaskSchema = z.object({
  name: z
    .string()
    .min(1, 'Task name is required')
    .max(100, 'Task name must be less than 100 characters')
    .optional(),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  project_id: z.string().min(1, 'Project ID is required').optional(),
  project_name: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name must be less than 100 characters')
    .optional(),
  due_date: z.date().optional(),
  status: z.enum(['Pending', 'In Progress', 'Completed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  ai_suggested: z.boolean().default(false).optional(),
  time_taken: z.number().int().min(0).default(0), // Seconds
  start_time: z.string().optional().nullable(),
});
