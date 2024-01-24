import { MovieService } from '@/services/movie.service';
import { Service, Inject } from 'typedi';
import { Request, Response } from 'express';
import { zodParse } from '@/parsers/zod.parser';
import { getMoviesQueryParamsSchema } from '@/types/apiTypes';
import { InternalServerErrorException } from '@/exceptions/internal-server-error.exception';
import { StatusCodes } from 'http-status-codes';

// @GET /movies - single random movie
// @GET /movies?duration=x - single movie
// @GET /movies?genres=x - array of movies
// @GET /movies?duration=x&genres=y =- array of movies
@Service()
export class MovieController {
  constructor(@Inject(() => MovieService) private movieService: MovieService) {}

  async getAllMovies(req: Request, res: Response) {
    try {
      const {
        query: { duration, genres },
      } = await zodParse(getMoviesQueryParamsSchema, req);
      const movies = await this.movieService.getAllMovies({ duration, genres });
      return res.status(StatusCodes.OK).json(movies);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async createMovie(req: Request, res: Response) {
    try {
      const newMovieData = req.body;
      const movies = await this.movieService.createMovie(newMovieData);
      return res.status(StatusCodes.CREATED).json(movies);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
