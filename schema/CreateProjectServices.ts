import { z } from 'zod'

export const CreatePojectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(100, 'Project name must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters'),
    client_id: z.string().min(1, 'Client ID is required'),
    due_date: z.date(),
    status: z.enum(['Pending', 'In Progress', 'Completed']),
    priority: z.enum(['Low', 'Medium', 'High']),
    hourly_rate: z.number().min(0, 'Hourly rate must be a positive number'),
    client_name: z.string().min(1, 'Client name is required').max(100, 'Client name must be less than 100 characters'),
})