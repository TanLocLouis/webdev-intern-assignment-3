import { z } from 'zod';

export const sbdSchema = z
  .string()
  .trim()
  .regex(/^\d{8}$/, 'SBD must be exactly 8 digits');
