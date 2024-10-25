import { z } from 'zod';

const validatePeriod = (startDate: string | undefined, endDate: string | undefined) => {
  if (!startDate || !endDate) return true; // Check if dates are present
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end < start) {
    return false;
  }

  const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  return diffInMonths <= 3;
};

export const AuditRecordSchema = z.object({
  clientId: z.string(),
  userId: z.string(),
  recordId: z.string(),
  domain: z.string(),
  scope: z.string(),
  operation: z.string(),
  message: z.string(),
  oldValue: z.any().nullable(),
  newValue: z.any(),
});

export const AuditQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: 'Page must be a positive number' }),
  limit: z
    .string()
    .optional()
    .default("100")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, { message: 'Limit must be a positive number' }),
  clientId: z.string().optional(),
  userId: z.string().optional(),
  recordId: z.string().optional(),
  domain: z.string().optional(),
  scope: z.string().optional(),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid start date' }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid end date' }),
}).refine(
  (data) => validatePeriod(data.startDate, data.endDate),
  {
    message: 'The end date must be after the start date and the period must not exceed 3 months',
    path: ['endDate'],
  }
);

export type AuditRecordInput = z.infer<typeof AuditRecordSchema>;
