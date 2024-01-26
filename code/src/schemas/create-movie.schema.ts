import { z } from 'zod';

export const createMovieSchema = z.object({
  genres: z.array(z.string()),
  title: z.string().max(255).min(1),
  year: z.number().positive(),
  runtime: z.number().positive(),
  director: z.string().max(255).min(1),
  actors: z.string().optional(),
  plot: z.string().optional(),
  posterUrl: z.string().url().optional(),
});

export const createMovieRequestSchema = z.object({
  body: createMovieSchema,
});
