import { MovieService } from '@/services/movie.service';
import { Service, Inject } from 'typedi';
import { Request, Response } from 'express';

// @GET /movies - single movie
// @GET /movies?duration=x - single movie
// @GET /movies?genres=x - array of movies
// @GET /movies?duration=x&genres=y =- array of movies
@Service()
export class MovieController {
  constructor(@Inject(() => MovieService) private movieService: MovieService) {}

  async getAllMovies(_req: Request, res: Response) {
    try {
      const movies = await this.movieService.getAllMovies();
      return res.status(200).json(movies);
    } catch (e) {
      console.debug(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }

  async createMovie(req: Request, res: Response) {
    try {
      const newMovieData = req.body;
      const movies = await this.movieService.createMovie(newMovieData);
      return res.status(201).json(movies);
    } catch (e) {
      console.debug(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }
}
