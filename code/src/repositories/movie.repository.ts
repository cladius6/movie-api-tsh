import { TMovie } from '@/models/movie.model';
import { DatabaseService } from '@/services/database.service';
import { Movie } from '@/types/dbTypes';
import { Service, Inject } from 'typedi';

@Service()
export class MovieRepository {
  constructor(@Inject(() => DatabaseService) private dbService: DatabaseService) {}

  async getAllMovies(): Promise<TMovie[]> {
    const db = await this.dbService.readDb();
    const movies: TMovie[] = db.movies;
    return movies;
  }

  async addMovie(movie: Omit<Movie, 'id'>) {
    const db = await this.dbService.readDb();
    const moviesDb = db.movies;
    const lastMovieId = moviesDb[moviesDb.length - 1].id;
    const id = lastMovieId + 1;
    const newMovie = {
      id,
      ...movie,
    };
    db.movies.push(newMovie);
    await this.dbService.writeDb(db);
    return newMovie;
  }
}
