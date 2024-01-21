import { MovieService } from '../src/services/movie.service';
import { MovieRepository } from '../src/repositories/movie.repository';
import { ZodError } from 'zod';

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

  describe('getAllMovies', () => {
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
  });

  describe('addMovie', () => {
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

    it('should create single movie without posterUrl correctly', async () => {
      const movie = await movieService.createMovie({
        title: 'Nebraska',
        year: 2013,
        runtime: 117,
        genres: ['Drama'],
        director: 'Jane Doe',
        actors: 'Bruce Dern, Will Forte, June Squibb, Bob Odenkirk',
        plot: 'An aging, booze-addled father makes the trip from Montana to Nebraska with his estranged son in order to claim a million-dollar Mega Sweepstakes Marketing prize.',
      });
      expect(movie).toEqual({
        title: 'Nebraska',
        year: '2013',
        runtime: '117',
        genres: ['Drama'],
        director: 'Jane Doe',
        actors: 'Bruce Dern, Will Forte, June Squibb, Bob Odenkirk',
        plot: 'An aging, booze-addled father makes the trip from Montana to Nebraska with his estranged son in order to claim a million-dollar Mega Sweepstakes Marketing prize.',
        posterUrl: '',
      });
      expect(mockMovieRepository.addMovie).toHaveBeenCalled();
    });

    it('should create single movie without posterUrl and plot correctly', async () => {
      const movie = await movieService.createMovie({
        title: 'Nebraska',
        year: 2013,
        runtime: 117,
        genres: ['Drama'],
        director: 'Jane Doe',
        actors: 'Bruce Dern, Will Forte, June Squibb, Bob Odenkirk',
      });
      expect(movie).toEqual({
        title: 'Nebraska',
        year: '2013',
        runtime: '117',
        genres: ['Drama'],
        director: 'Jane Doe',
        actors: 'Bruce Dern, Will Forte, June Squibb, Bob Odenkirk',
        plot: '',
        posterUrl: '',
      });
      expect(mockMovieRepository.addMovie).toHaveBeenCalled();
    });

    it('should add new movie without posterUrl, plot, and actors correctly', async () => {
      const movie = await movieService.createMovie({
        title: 'Nebraska',
        year: 2013,
        runtime: 117,
        genres: ['Drama'],
        director: 'Jane Doe',
      });
      expect(movie).toEqual({
        title: 'Nebraska',
        year: '2013',
        runtime: '117',
        genres: ['Drama'],
        director: 'Jane Doe',
        actors: '',
        plot: '',
        posterUrl: '',
      });
      expect(mockMovieRepository.addMovie).toHaveBeenCalled();
    });

    it('should throw an error for invalid movie data', async () => {
      const invalidMovieData: any = {
        title: 'Nebraska',
        year: 2013,
      };
      try {
        await movieService.createMovie(invalidMovieData);
        fail('Expected ZodError was not thrown');
      } catch (error) {
        if (error instanceof ZodError) {
          const zodError: ZodError = error;
          expect(zodError.errors.some(e => e.path.includes('genres'))).toBe(true);
          expect(zodError.errors.some(e => e.path.includes('runtime'))).toBe(true);
          expect(zodError.errors.some(e => e.path.includes('director'))).toBe(true);
        } else fail('Error is not instaceof ZodError');
      }
    });

    it('should throw an error for invalid movie data', async () => {
      const invalidMovieData: any = {
        title:
          'NebraskaddsdadsadasdawdvawdawdawvdawvdawdvawdvawdvawvdawdawNebraskaddsdadsadasdawdvawdawdawvdawvdawdvawdvawdvawvdawdawNebraskaddsdadsadasdawdvawdawdawvdawvdawdvawdvawdvawvdawdawNebraskaddsdadsadasdawdvawdawdawvdawvdawdvawdvawdvawvdawdawNebraskaddsdadsadasd',
        year: -1,
        runtime: '117',
        genres: ['Drama'],
        director: '',
      };
      try {
        await movieService.createMovie(invalidMovieData);
        fail('Expected ZodError was not thrown');
      } catch (error) {
        if (error instanceof ZodError) {
          const zodError: ZodError = error;
          expect(zodError.errors.some(e => e.path.includes('director'))).toBe(true);
          expect(zodError.errors.some(e => e.path.includes('title'))).toBe(true);
          expect(zodError.errors.some(e => e.path.includes('year'))).toBe(true);
        } else fail('Error is not instaceof ZodError');
      }
    });
  });
});
