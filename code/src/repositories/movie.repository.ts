import { DbMovie } from '@/models/db-movie.model';
import { DatabaseService } from '@/services/database.service';
import { Service, Inject } from 'typedi';

@Service()
export class MovieRepository {
  constructor(@Inject(() => DatabaseService) private dbService: DatabaseService) {}

  async getAllMovies(): Promise<DbMovie[]> {
    const db = await this.dbService.readDb();
    const movies: DbMovie[] = db.movies;
    return movies;
  }

  async addMovie(movie: Omit<DbMovie, 'id'>): Promise<DbMovie> {
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

  async findByTitleYearAndActorsAndRuntime(
    title: string,
    year: string,
    actors: string,
    runtime: string,
  ): Promise<DbMovie | undefined> {
    const movies = await this.getAllMovies();
    const foundMovie = movies.find(
      movie => movie.title === title && movie.year === year && movie.actors === actors && movie.runtime === runtime,
    );
    return foundMovie || undefined;
  }
}
