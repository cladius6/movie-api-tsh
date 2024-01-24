import { BadRequestException } from '@/exceptions/bad-request.exception';
import { InternalServerErrorException } from '@/exceptions/internal-server-error.exception';
import type { Request } from 'express';
import { AnyZodObject, ZodError, z } from 'zod';

export async function zodParse<T extends AnyZodObject>(schema: T, req: Request): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequestException(error.message);
    }
    return new InternalServerErrorException(JSON.stringify(error));
  }
}
