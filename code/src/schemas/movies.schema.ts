import { z } from 'zod';

const movieSchema = z.object({
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

export const moviesSchema = z.array(movieSchema);
