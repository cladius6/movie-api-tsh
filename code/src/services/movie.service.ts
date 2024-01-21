import { MovieRepository } from '@/repositories/movie.repository';
import { Service, Inject } from 'typedi';

@Service()
export class MoviesService {
  constructor(@Inject(() => MovieRepository) private movieRepository: MovieRepository) {}

  async getAllMovies() {
    return this.movieRepository.getAllMovies();
  }
}
