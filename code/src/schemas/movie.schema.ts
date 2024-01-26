import { z } from 'zod';

export const movieSchema = z.object({
  id: z.number(),
  title: z.string(),
  year: z.string(),
  runtime: z.string(),
  genres: z.array(z.string()),
  director: z.string(),
  actors: z.string(),
  plot: z.string(),
  posterUrl: z.string().url(),
});
