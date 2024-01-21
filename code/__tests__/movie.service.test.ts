import { MovieService } from '../src/services/movie.service';
import { MovieRepository } from '../src/repositories/movie.repository';

describe(MovieService.name, () => {
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
      addMovie: jest.fn().mockImplementation(movie => Promise.resolve(movie)),
    };
    movieService = new MovieService(mockMovieRepository as MovieRepository);
  });

  it('should retrieve all movies correctly', async () => {
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

  it('should create single movie correctly', async () => {
    const movie = await movieService.createMovie({
      title: 'Nebraska',
      year: 2013,
      runtime: 117,
      genres: ['Drama'],
      director: 'Jane Doe',
      actors: 'Bruce Dern, Will Forte, June Squibb, Bob Odenkirk',
      plot: 'An aging, booze-addled father makes the trip from Montana to Nebraska with his estranged son in order to claim a million-dollar Mega Sweepstakes Marketing prize.',
      posterUrl:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU2Mjk2NDkyMl5BMl5BanBnXkFtZTgwNTk0NzcyMDE@._V1_SX300.jpg',
    });
    expect(movie).toEqual({
      title: 'Nebraska',
      year: '2013',
      runtime: '117',
      genres: ['Drama'],
      director: 'Jane Doe',
      actors: 'Bruce Dern, Will Forte, June Squibb, Bob Odenkirk',
      plot: 'An aging, booze-addled father makes the trip from Montana to Nebraska with his estranged son in order to claim a million-dollar Mega Sweepstakes Marketing prize.',
      posterUrl:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU2Mjk2NDkyMl5BMl5BanBnXkFtZTgwNTk0NzcyMDE@._V1_SX300.jpg',
    });
    expect(mockMovieRepository.addMovie).toHaveBeenCalled();
  });
});
