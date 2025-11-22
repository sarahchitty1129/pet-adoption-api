import { z } from 'zod';

const applicationStatusSchema = z.enum(['pending', 'approved', 'rejected', 'withdrawn']);

export const createApplicationSchema = z.object({
  pet_id: z.string().uuid('Pet ID must be a valid UUID'),
  applicant_name: z
    .string()
    .min(1, 'Applicant name is required')
    .max(255, 'Applicant name must be 255 characters or less'),
  applicant_email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be 255 characters or less'),
  applicant_phone: z
    .string()
    .max(50, 'Phone number must be 50 characters or less')
    .optional(),
  applicant_address: z.string().optional(),
  application_text: z.string().optional(),
  status: applicationStatusSchema.optional().default('pending'),
});

export const updateApplicationSchema = z.object({
  applicant_name: z
    .string()
    .min(1, 'Applicant name is required')
    .max(255, 'Applicant name must be 255 characters or less')
    .optional(),
  applicant_email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be 255 characters or less')
    .optional(),
  applicant_phone: z
    .string()
    .max(50, 'Phone number must be 50 characters or less')
    .optional(),
  applicant_address: z.string().optional(),
  application_text: z.string().optional(),
  status: applicationStatusSchema.optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

