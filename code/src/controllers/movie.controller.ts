import { MoviesService } from '@/services/movie.service';
import { Service, Inject } from 'typedi';
import { Request, Response } from 'express';

@Service()
export class MovieController {
  constructor(@Inject(() => MoviesService) private movieService: MoviesService) {}

  async getAllMovies(_req: Request, res: Response) {
    try {
      const movies = await this.movieService.getAllMovies();
      return res.status(200).json(movies);
    } catch (e) {
      console.debug(e);
      return res.status(500).json({ message: 'Something went wrong!' });
    }
  }
}
