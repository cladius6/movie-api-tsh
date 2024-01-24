import { MovieService } from '@/services/movie.service';
import { Service, Inject } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { zodParse } from '@/parsers/zod.parser';
import { getMoviesQueryParamsSchema } from '@/types/apiTypes';
import { StatusCodes } from 'http-status-codes';

@Service()
export class MovieController {
  constructor(@Inject(() => MovieService) private movieService: MovieService) {}

  async getAllMovies(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        query: { duration, genres },
      } = await zodParse(getMoviesQueryParamsSchema, req);
      const movies = await this.movieService.getAllMovies({ duration, genres });
      return res.status(StatusCodes.OK).json(movies);
    } catch (error) {
      next(error);
    }
  }

  async createMovie(req: Request, res: Response, next: NextFunction) {
    try {
      const newMovieData = req.body;
      const movies = await this.movieService.createMovie(newMovieData);
      return res.status(StatusCodes.CREATED).json(movies);
    } catch (error) {
      next(error);
    }
  }
}
