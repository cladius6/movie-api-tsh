import { ErrorStatusCode, ErrorType } from '@/types/errors';

export class HttpsError extends Error {
  public statusCode: number;
  public errorCode: ErrorType;
  public details?: any;

  constructor(statusCode: number, message?: string, details?: any) {
    super(message);

    this.statusCode = statusCode ?? ErrorStatusCode.INTERNAL;
    this.errorCode = HttpsError.getErrorCode(this.statusCode);
    this.message = message || 'Internal Server Error';
    this.details = details;
  }

  static getErrorCode(statusCode: number): ErrorType {
    return (Object.entries(ErrorStatusCode).find(([, value]) => value === statusCode)?.[0] as ErrorType) || 'INTERNAL';
  }
}
