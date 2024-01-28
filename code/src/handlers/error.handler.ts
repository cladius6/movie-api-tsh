import { HttpsError } from '@/exceptions/https-error';
import { logger } from '@/logger';
import { ErrorStatusCode } from '@/types/errors';
import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: HttpsError | Error, _req: Request, res: Response, _next: NextFunction) {
  if (process.env.NODE_ENV !== 'test') {
    logger.error(err);
  }

  let statusCode: number;

  if (err instanceof HttpsError) {
    statusCode = err.statusCode;
  } else if (err instanceof Error && 'statusCode' in err) {
    statusCode = (err as any).statusCode;
  } else {
    statusCode = ErrorStatusCode.INTERNAL;
  }

  const errorCode = HttpsError.getErrorCode(statusCode);
  const message = err.message || 'Internal Server Error';
  const details = (err as HttpsError).details || undefined;

  res.status(statusCode).json({ errorCode, message, status: statusCode, details });
  return res;
}
