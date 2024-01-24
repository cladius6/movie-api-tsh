import { HttpsError } from '@/errors/https.error';
import { ErrorStatusCode } from '@/types/errors';
import type { Request } from 'express';
import { AnyZodObject, ZodError, z } from 'zod';

export async function zodParse<T extends AnyZodObject>(schema: T, req: Request): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new HttpsError(ErrorStatusCode.BAD_REQUEST, 'Type validation error', error.issues);
    }
    throw new HttpsError(ErrorStatusCode.INTERNAL, JSON.stringify(error));
  }
}
