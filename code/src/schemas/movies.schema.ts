import { z } from 'zod';

export const movieSchema = z.object({
  id: z.number().positive(),
  genres: z.array(z.string()),
  title: z.string().max(255).min(1),
  year: z.number().positive(),
  runtime: z.number().positive(),
  director: z.string().max(255).min(1),
  actors: z.string().optional(),
  plot: z.string().optional(),
  posterUrl: z.string().url().optional(),
});

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

export const moviesSchema = z.array(movieSchema);

export const createMovieRequestSchema = z.object({
  body: createMovieSchema,
});

export const getMoviesSchema = z.object({
  duration: z.number().positive().optional(),
  genres: z.array(z.string().min(1)).optional(),
});

export const getMoviesQueryParamsSchema = z.object({
  query: getMoviesSchema,
});
