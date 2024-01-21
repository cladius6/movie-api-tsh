import { MovieService } from '../src/services/movie.service';
import { MovieRepository } from '../src/repositories/movie.repository';

describe('MovieService', () => {
  let movieService: MovieService;
  let mockMovieRepository: Partial<MovieRepository>;

  beforeEach(() => {
    mockMovieRepository = {
      getAllMovies: jest.fn().mockResolvedValue([
        {
          id: 121,
          title: 'Nebraska',
          year: '2013',
          runtime: '115',
          genres: ['Adventure', 'Comedy', 'Drama'],
          director: 'Alexander Payne',
          actors: 'Bruce Dern, Will Forte, June Squibb, Bob Odenkirk',
          plot: 'An aging, booze-addled father makes the trip from Montana to Nebraska with his estranged son in order to claim a million-dollar Mega Sweepstakes Marketing prize.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU2Mjk2NDkyMl5BMl5BanBnXkFtZTgwNTk0NzcyMDE@._V1_SX300.jpg',
        },
      ]),
    };
    movieService = new MovieService(mockMovieRepository as MovieRepository);
  });

  it('should retrieve all movies', async () => {
    const movies = await movieService.getAllMovies();
    expect(movies).toEqual([
      {
        id: 121,
        title: 'Nebraska',
        year: '2013',
        runtime: '115',
        genres: ['Adventure', 'Comedy', 'Drama'],
        director: 'Alexander Payne',
        actors: 'Bruce Dern, Will Forte, June Squibb, Bob Odenkirk',
        plot: 'An aging, booze-addled father makes the trip from Montana to Nebraska with his estranged son in order to claim a million-dollar Mega Sweepstakes Marketing prize.',
        posterUrl:
          'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU2Mjk2NDkyMl5BMl5BanBnXkFtZTgwNTk0NzcyMDE@._V1_SX300.jpg',
      },
    ]);
    expect(mockMovieRepository.getAllMovies).toHaveBeenCalled();
  });
});
