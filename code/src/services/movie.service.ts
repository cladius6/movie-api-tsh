import { MovieRepository } from '@/repositories/movie.repository';
import { TCreateMovie, TGetMovies } from '@/types/apiTypes';
import { Service, Inject } from 'typedi';
import { MovieSelectorService } from './movie-selector.service';
import { createMovieSchema } from '@/schemas/movies.schema';

@Service()
export class MovieService {
  constructor(
    @Inject(() => MovieRepository) private movieRepository: MovieRepository,
    @Inject(() => MovieSelectorService) private movieSelectorService: MovieSelectorService,
  ) {}

  async getAllMovies(query: TGetMovies) {
    const movies = await this.movieRepository.getAllMovies();
    const { duration, genres } = query;

    if (duration && !genres) {
      const moviesByDuration = this.movieSelectorService.getMoviesByDuration(movies, duration);
      if (moviesByDuration.length > 0) {
        const randomMovieByDuration = this.movieSelectorService.getRandomMovie(moviesByDuration);
        return randomMovieByDuration;
      }
    }

    if (!duration && genres) {
      const moviesWithGenres = this.movieSelectorService.getMoviesWithGenres(movies, genres);
      return moviesWithGenres;
    }

    if (duration && genres) {
      const moviesWithGenres = this.movieSelectorService.getMoviesWithGenres(movies, genres);
      const moviesByDurationAndGenres = this.movieSelectorService.getMoviesByDuration(moviesWithGenres, duration);
      return moviesByDurationAndGenres;
    }

    return this.movieSelectorService.getRandomMovie(movies);
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
