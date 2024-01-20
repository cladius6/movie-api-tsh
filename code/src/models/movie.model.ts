import { z } from 'zod';

const movieSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(255),
  year: z.number().positive(),
  runtime: z.number().positive(),
  genres: z.array(z.string()),
  director: z.string().max(255).min(1),
  actors: z.string().optional(),
  plot: z.string().optional(),
  postedUrl: z.string().url().optional(),
});

export type TMovie = z.infer<typeof movieSchema>;
