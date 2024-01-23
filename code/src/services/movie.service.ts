import { movieSchema } from '@/models/movie.model';
import { MovieRepository } from '@/repositories/movie.repository';
import { TCreateMovie, createMovieSchema } from '@/types/apiTypes';
import { Movie } from '@/types/dbTypes';
import { Service, Inject } from 'typedi';

@Service()
export class MovieService {
  constructor(@Inject(() => MovieRepository) private movieRepository: MovieRepository) {}

  async getAllMovies() {
    return this.movieRepository.getAllMovies();
  }

  async createMovie(movieData: TCreateMovie) {
    const movie = await createMovieSchema.parseAsync(movieData);
    const newMovie = {
      ...movie,
      year: movie.year.toString(),
      runtime: movie.runtime.toString(),
      actors: movie.actors || '',
      plot: movie.plot || '',
      posterUrl: movie.posterUrl || '',
    };
    const addedMovie = await this.movieRepository.addMovie(newMovie);
    return addedMovie;
  }
}
