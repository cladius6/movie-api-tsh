export type ErrorType = 'BAD_REQUEST' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'CONFLICT' | 'PROXY' | 'INTERNAL';

export enum ErrorStatusCode {
  'BAD_REQUEST' = 400,
  'UNAUTHORIZED' = 401,
  'FORBIDDEN' = 403,
  'NOT_FOUND' = 404,
  'CONFLICT' = 409,
  'PROXY' = 407,
  'INTERNAL' = 500,
}
