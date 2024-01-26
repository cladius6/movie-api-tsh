import { z } from 'zod';

export const getMoviesSchema = z.object({
  duration: z
    .preprocess(
      val => {
        if (typeof val === 'string' && !isNaN(parseFloat(val))) {
          return parseFloat(val);
        }
        return val;
      },
      z
        .number()
        .positive()
        .refine(val => !isNaN(val as any), {
          message: 'Duration must be a valid number',
        }),
    )
    .optional(),

  genres: z
    .preprocess(
      val => {
        if (typeof val === 'string') return [val];
        return val;
      },
      z.array(z.string().min(1)),
    )
    .optional(),
});

export const getMoviesQueryParamsSchema = z.object({
  query: getMoviesSchema,
});
