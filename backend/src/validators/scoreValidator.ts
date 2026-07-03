import { z } from 'zod';

export const sbdSchema = z
  .string()
  .trim()
  .regex(/^\d+$/, 'SBD must contain digits');
