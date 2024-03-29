import { MovieRepository } from '@/repositories/movie.repository';
import { TCreateMovie, TGetMovies } from '@/types/api-types';
import { Service, Inject } from 'typedi';
import { DbMovieSelectorService } from './movie-selector.service';
import { createMovieSchema } from '@/schemas/create-movie.schema';
import { ApiMovie } from '@/models/api-movie.model';
import { DbMovie } from '@/models/db-movie.model';
import { HttpsError } from '@/exceptions/https-error';
import { ErrorStatusCode } from '@/types/errors';

@Service()
export class MovieService {
  constructor(
    @Inject(() => MovieRepository) private movieRepository: MovieRepository,
    @Inject(() => DbMovieSelectorService) private movieSelectorService: DbMovieSelectorService,
  ) {}

  async getAllMovies(query: TGetMovies): Promise<ApiMovie[]> {
    const movies: DbMovie[] = await this.movieRepository.getAllMovies();
    const { duration, genres } = query;

    if (duration && !genres) {
      return [this.getApiRandomMovieByDuration(movies, duration)];
    }

    if (!duration && genres) {
      return this.getApiMoviesWithGenres(movies, genres);
    }

    if (duration && genres) {
      return this.getApiMoviesWithDurationAndGenres(movies, duration, genres);
    }

    return [this.getRandomApiMovie(movies)];
  }

  async createMovie(movieData: TCreateMovie) {
    const movie = await createMovieSchema.parseAsync(movieData);
    await this.validateMovieData(movie);
    const newMovie = this.prepareDbMovie(movie);
    const addedMovie = await this.movieRepository.addMovie(newMovie);
    return new ApiMovie(addedMovie);
  }

  private async validateMovieData(movieData: TCreateMovie): Promise<void> {
    const movie = await createMovieSchema.parseAsync(movieData);
    await this.ensureValidGenres(movie.genres);
    await this.ensureUniqueMovie(movie);
  }

  private async ensureValidGenres(genres: string[]): Promise<void> {
    const invalidGenres = await this.validateGenres(genres);
    if (invalidGenres.length > 0) {
      throw new HttpsError(ErrorStatusCode.BAD_REQUEST, 'Invalid genres provided', { invalidGenres });
    }
  }

  private async ensureUniqueMovie(movie: TCreateMovie): Promise<void> {
    const existingMovie = await this.movieRepository.findByTitleYearAndActorsAndRuntime(
      movie.title,
      movie.year.toString(),
      movie.actors || '',
      movie.runtime.toString(),
    );
    if (existingMovie) {
      throw new HttpsError(ErrorStatusCode.CONFLICT, 'Movie already exists!');
    }
  }

  private prepareDbMovie(movie: TCreateMovie): Omit<DbMovie, 'id'> {
    return {
      ...movie,
      year: movie.year.toString(),
      runtime: movie.runtime.toString(),
      actors: movie.actors || '',
      plot: movie.plot || '',
      posterUrl: movie.posterUrl || '',
    };
  }

  private async validateGenres(genres: string[]): Promise<string[]> {
    const validGenres = await this.movieRepository.getGenres();
    const invalidGenres = genres.filter(genre => !validGenres.includes(genre));
    return invalidGenres;
  }

  private getApiRandomMovieByDuration(movies: DbMovie[], duration: number): ApiMovie {
    const moviesByDuration = this.movieSelectorService.getMoviesByDuration(movies, duration);
    if (moviesByDuration.length > 0) {
      const randomMovieByDuration = this.movieSelectorService.getRandomMovie(moviesByDuration);
      return new ApiMovie(randomMovieByDuration);
    } else {
      throw new HttpsError(ErrorStatusCode.NOT_FOUND, `Movie with ${duration} not found!`);
    }
  }

  private getApiMoviesWithGenres(movies: DbMovie[], genres: string[]): ApiMovie[] {
    const moviesWithGenres = this.movieSelectorService.getMoviesWithGenres(movies, genres);
    if (moviesWithGenres.length > 0) {
      return moviesWithGenres.map(movie => new ApiMovie(movie));
    } else throw new HttpsError(ErrorStatusCode.NOT_FOUND, `Movies with ${genres} not found!`);
  }

  private getApiMoviesWithDurationAndGenres(movies: DbMovie[], duration: number, genres: string[]): ApiMovie[] {
    const moviesByDuration = this.movieSelectorService.getMoviesByDuration(movies, duration);
    const moviesWithGenresAndDuration = this.movieSelectorService.getMoviesWithGenres(moviesByDuration, genres);
    if (moviesWithGenresAndDuration.length > 0) return moviesWithGenresAndDuration.map(movies => new ApiMovie(movies));
    else
      throw new HttpsError(
        ErrorStatusCode.NOT_FOUND,
        `Movies with duration ${duration} and genres ${genres} not found!`,
      );
  }

  private getRandomApiMovie(movies: DbMovie[]): ApiMovie {
    return new ApiMovie(this.movieSelectorService.getRandomMovie(movies));
  }
}
