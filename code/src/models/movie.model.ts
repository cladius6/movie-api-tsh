import { z } from 'zod';
import { A, Test } from 'ts-toolbelt';
import { Movie } from '@/types/dbTypes';

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

export type TMovie = z.infer<typeof movieSchema>;

type validation = A.Equals<TMovie, Movie>;
Test.checks([Test.check<validation, 1, Test.Pass>()]);
