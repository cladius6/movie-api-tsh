import { DbMovie } from '@/models/db-movie.model';
import { TMovie } from '@/types/api-types';
import { Service } from 'typedi';

@Service()
export class DbMovieSelectorService {
  getMoviesByDuration(movies: DbMovie[], duration: number): DbMovie[] {
    const minRuntime = duration - 10;
    const maxRuntime = duration + 10;

    const filteredMovies = movies.filter(
      movie => Number(movie.runtime) >= minRuntime && Number(movie.runtime) <= maxRuntime,
    );
    return filteredMovies;
  }

  getRandomMovie(movies: DbMovie[]): TMovie {
    const randomMoviesIndex = Math.floor(Math.random() * movies.length);
    return movies[randomMoviesIndex];
  }

  getMoviesWithGenres(movies: DbMovie[], genres: string[]): DbMovie[] {
    const genreSet = new Set(genres);

    const moviesWithGenreMatchCounts = movies
      .map(movie => {
        const matchCount = this.countMatchingGenres(movie, genreSet);
        return { movie, matchCount };
      })
      .filter(movieWithCount => movieWithCount.matchCount > 0);

    moviesWithGenreMatchCounts.sort((a, b) => b.matchCount - a.matchCount);

    return moviesWithGenreMatchCounts.map(movieWithCount => movieWithCount.movie);
  }

  private countMatchingGenres(movie: DbMovie, genreSet: Set<string>): number {
    return movie.genres.reduce((count, genre) => (genreSet.has(genre) ? count + 1 : count), 0);
  }
}
