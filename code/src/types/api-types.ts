import { z } from 'zod';
import { createMovieRequestSchema, createMovieSchema } from '@/schemas/create-movie.schema';
import { getMoviesQueryParamsSchema, getMoviesSchema } from '@/schemas/get-movies.schema';
import { moviesSchema } from '@/schemas/movies.schema';
import { A, Test } from 'ts-toolbelt';
import { DbMovie } from '@/models/db-movie.model';
import { movieSchema } from '@/schemas/movie.schema';

export type TCreateMovie = z.infer<typeof createMovieSchema>;

export type TCreateMovieRequest = z.infer<typeof createMovieRequestSchema>;

export type TMovie = z.infer<typeof movieSchema>;

export type TMovies = z.infer<typeof moviesSchema>;

export type TGetMoviesQueryParams = z.infer<typeof getMoviesQueryParamsSchema>;
export type TGetMovies = z.infer<typeof getMoviesSchema>;

type validation = A.Equals<TMovie, DbMovie>;
Test.checks([Test.check<validation, 1, Test.Pass>()]);
