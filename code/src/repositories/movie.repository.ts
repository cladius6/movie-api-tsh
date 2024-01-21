import { DatabaseService } from '@/services/database.service';
import { Service, Inject } from 'typedi';

@Service()
export class MovieRepository {
  constructor(@Inject(() => DatabaseService) private dbService: DatabaseService) {}

  async getAllMovies() {
    const db = await this.dbService.readDb();
    return db.movies;
  }
}
