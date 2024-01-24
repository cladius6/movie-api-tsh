import {
  createMovieRequestSchema,
  createMovieSchema,
  getMoviesQueryParamsSchema,
  getMoviesSchema,
  movieSchema,
  moviesSchema,
} from '@/schemas/movies.schema';
import { z } from 'zod';

export type TCreateMovie = z.infer<typeof createMovieSchema>;

export type TCreateMovieRequest = z.infer<typeof createMovieRequestSchema>;

export type TMovie = z.infer<typeof movieSchema>;

export type TMovies = z.infer<typeof moviesSchema>;

export type TGetMoviesQueryParams = z.infer<typeof getMoviesQueryParamsSchema>;
export type TGetMovies = z.infer<typeof getMoviesSchema>;
