import { MovieService } from '../src/services/movie.service';
import { MovieRepository } from '../src/repositories/movie.repository';
import { ZodError } from 'zod';
import dbData from '../../data/db.test.json';
import { TGetMovies } from '../src/types/api-types';
import { DbMovieSelectorService } from '../src/services/movie-selector.service';
import { ApiMovie } from '@/models/api-movie.model';
import { DbMovie } from '@/models/db-movie.model';

describe(MovieService.name, () => {
  let movieService: MovieService;
  let mockMovieRepository: Partial<MovieRepository>;
  let movieSelectorService: DbMovieSelectorService;

  beforeAll(() => {
    mockMovieRepository = {
      getAllMovies: jest.fn().mockResolvedValue(dbData.movies),
      addMovie: jest.fn().mockImplementation(movie => {
        const id = Math.floor(Math.random() * 1000);
        return Promise.resolve({ id, ...movie });
      }),
      findByTitleYearAndActorsAndRuntime: jest.fn().mockResolvedValue(undefined),
    };
    movieSelectorService = new DbMovieSelectorService();
    movieService = new MovieService(mockMovieRepository as MovieRepository, movieSelectorService);
  });

  function fail(message = '') {
    expect(`[FAIL] ${message}`.trim()).toBeFalsy();
  }

  describe('getAllMovies', () => {
    it('should retrieve random movie if no query parameters were provided', async () => {
      const mockedData: DbMovie[] = [
        {
          id: 4,
          title: 'Crocodile Dundee',
          year: '1986',
          runtime: '97',
          genres: ['Adventure', 'Comedy'],
          director: 'Peter Faiman',
          actors: 'Paul Hogan, Linda Kozlowski, John Meillon, David Gulpilil',
          plot: 'An American reporter goes to the Australian outback to meet an eccentric crocodile poacher and invites him to New York City.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTg0MTU1MTg4NF5BMl5BanBnXkFtZTgwMDgzNzYxMTE@._V1_SX300.jpg',
        },
        {
          id: 5,
          title: 'Valkyrie',
          year: '2008',
          runtime: '121',
          genres: ['Drama', 'History', 'Thriller'],
          director: 'Bryan Singer',
          actors: 'Tom Cruise, Kenneth Branagh, Bill Nighy, Tom Wilkinson',
          plot: 'A dramatization of the 20 July assassination and political coup plot by desperate renegade German Army officers against Hitler during World War II.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTg3Njc2ODEyN15BMl5BanBnXkFtZTcwNTAwMzc3NA@@._V1_SX300.jpg',
        },
      ];
      jest.spyOn(mockMovieRepository, 'getAllMovies').mockResolvedValue(mockedData);

      const movie = await movieService.getAllMovies({});

      expect(movie.length).toBe(1);
      const movieOne = new ApiMovie(mockedData[0]);
      const movieTwo = new ApiMovie(mockedData[1]);
      expect(typeof movie[0].runtime === 'number').toBeTruthy();
      expect(movie[0].id == movieOne.id || movie[0].id == movieTwo.id).toBeTruthy();
    });

    it('should return a single movie with runtime between duration + 10 or duration - 10 specifed in query parameters ', async () => {
      const queryParams: TGetMovies = {
        duration: 100,
      };
      const mockData = [
        {
          id: 4,
          title: 'Crocodile Dundee',
          year: '1986',
          runtime: '97',
          genres: ['Adventure', 'Comedy'],
          director: 'Peter Faiman',
          actors: 'Paul Hogan, Linda Kozlowski, John Meillon, David Gulpilil',
          plot: 'An American reporter goes to the Australian outback to meet an eccentric crocodile poacher and invites him to New York City.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTg0MTU1MTg4NF5BMl5BanBnXkFtZTgwMDgzNzYxMTE@._V1_SX300.jpg',
        },
        {
          id: 5,
          title: 'Valkyrie',
          year: '2008',
          runtime: '121',
          genres: ['Drama', 'History', 'Thriller'],
          director: 'Bryan Singer',
          actors: 'Tom Cruise, Kenneth Branagh, Bill Nighy, Tom Wilkinson',
          plot: 'A dramatization of the 20 July assassination and political coup plot by desperate renegade German Army officers against Hitler during World War II.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTg3Njc2ODEyN15BMl5BanBnXkFtZTcwNTAwMzc3NA@@._V1_SX300.jpg',
        },
      ];
      jest.spyOn(mockMovieRepository, 'getAllMovies').mockResolvedValue(mockData);

      const expectedResponse: ApiMovie[] = [
        {
          id: 4,
          title: 'Crocodile Dundee',
          year: 1986,
          runtime: 97,
          genres: ['Adventure', 'Comedy'],
          director: 'Peter Faiman',
          actors: 'Paul Hogan, Linda Kozlowski, John Meillon, David Gulpilil',
          plot: 'An American reporter goes to the Australian outback to meet an eccentric crocodile poacher and invites him to New York City.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTg0MTU1MTg4NF5BMl5BanBnXkFtZTgwMDgzNzYxMTE@._V1_SX300.jpg',
        },
      ];
      const movie = await movieService.getAllMovies(queryParams);

      expect(movie).toEqual(expectedResponse);
    });

    it('should return a movies with specified genres in query parameters correctly ', async () => {
      const queryParams: TGetMovies = {
        genres: ['Crime', 'Drama'],
      };

      const mockData = [
        {
          id: 1,
          title: 'Beetlejuice',
          year: '1988',
          runtime: '92',
          genres: ['Comedy', 'Fantasy'],
          director: 'Tim Burton',
          actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
        },
        {
          id: 2,
          title: 'The Cotton Club',
          year: '1984',
          runtime: '127',
          genres: ['Crime', 'Drama', 'Music'],
          director: 'Francis Ford Coppola',
          actors: 'Richard Gere, Gregory Hines, Diane Lane, Lonette McKee',
          plot: 'The Cotton Club was a famous night club in Harlem. The story follows the people that visited the club, those that ran it, and is peppered with the Jazz music that made it so famous.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU5ODAyNzA4OV5BMl5BanBnXkFtZTcwNzYwNTIzNA@@._V1_SX300.jpg',
        },
        {
          id: 3,
          title: 'The Shawshank Redemption',
          year: '1994',
          runtime: '142',
          genres: ['Crime', 'Drama'],
          director: 'Frank Darabont',
          actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
          plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg',
        },
        {
          id: 4,
          title: 'Crocodile Dundee',
          year: '1986',
          runtime: '97',
          genres: ['Adventure', 'Comedy'],
          director: 'Peter Faiman',
          actors: 'Paul Hogan, Linda Kozlowski, John Meillon, David Gulpilil',
          plot: 'An American reporter goes to the Australian outback to meet an eccentric crocodile poacher and invites him to New York City.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTg0MTU1MTg4NF5BMl5BanBnXkFtZTgwMDgzNzYxMTE@._V1_SX300.jpg',
        },
        {
          id: 5,
          title: 'Valkyrie',
          year: '2008',
          runtime: '121',
          genres: ['Drama', 'History', 'Thriller'],
          director: 'Bryan Singer',
          actors: 'Tom Cruise, Kenneth Branagh, Bill Nighy, Tom Wilkinson',
          plot: 'A dramatization of the 20 July assassination and political coup plot by desperate renegade German Army officers against Hitler during World War II.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTg3Njc2ODEyN15BMl5BanBnXkFtZTcwNTAwMzc3NA@@._V1_SX300.jpg',
        },
        {
          id: 6,
          title: 'Ratatouille',
          year: '2007',
          runtime: '111',
          genres: ['Animation', 'Comedy', 'Family'],
          director: 'Brad Bird, Jan Pinkava',
          actors: 'Patton Oswalt, Ian Holm, Lou Romano, Brian Dennehy',
          plot: 'A rat who can cook makes an unusual alliance with a young kitchen worker at a famous restaurant.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTMzODU0NTkxMF5BMl5BanBnXkFtZTcwMjQ4MzMzMw@@._V1_SX300.jpg',
        },
        {
          id: 7,
          title: 'City of God',
          year: '2002',
          runtime: '130',
          genres: ['Crime', 'Drama'],
          director: 'Fernando Meirelles, Kátia Lund',
          actors: 'Alexandre Rodrigues, Leandro Firmino, Phellipe Haagensen, Douglas Silva',
          plot: 'Two boys growing up in a violent neighborhood of Rio de Janeiro take different paths: one becomes a photographer, the other a drug dealer.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMjA4ODQ3ODkzNV5BMl5BanBnXkFtZTYwOTc4NDI3._V1_SX300.jpg',
        },
        {
          id: 8,
          title: 'Memento',
          year: '2000',
          runtime: '113',
          genres: ['Mystery', 'Thriller'],
          director: 'Christopher Nolan',
          actors: 'Guy Pearce, Carrie-Anne Moss, Joe Pantoliano, Mark Boone Junior',
          plot: "A man juggles searching for his wife's murderer and keeping his short-term memory loss from being an obstacle.",
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BNThiYjM3MzktMDg3Yy00ZWQ3LTk3YWEtN2M0YmNmNWEwYTE3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
        },
        {
          id: 9,
          title: 'The Intouchables',
          year: '2011',
          runtime: '112',
          genres: ['Biography', 'Comedy', 'Drama'],
          director: 'Olivier Nakache, Eric Toledano',
          actors: 'François Cluzet, Omar Sy, Anne Le Ny, Audrey Fleurot',
          plot: 'After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_SX300.jpg',
        },
      ];

      jest.spyOn(mockMovieRepository, 'getAllMovies').mockResolvedValue(mockData);
      const movie = await movieService.getAllMovies(queryParams);

      const expectedResponse = [
        {
          id: 2,
          title: 'The Cotton Club',
          year: 1984,
          runtime: 127,
          genres: ['Crime', 'Drama', 'Music'],
          director: 'Francis Ford Coppola',
          actors: 'Richard Gere, Gregory Hines, Diane Lane, Lonette McKee',
          plot: 'The Cotton Club was a famous night club in Harlem. The story follows the people that visited the club, those that ran it, and is peppered with the Jazz music that made it so famous.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU5ODAyNzA4OV5BMl5BanBnXkFtZTcwNzYwNTIzNA@@._V1_SX300.jpg',
        },
        {
          id: 3,
          title: 'The Shawshank Redemption',
          year: 1994,
          runtime: 142,
          genres: ['Crime', 'Drama'],
          director: 'Frank Darabont',
          actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
          plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg',
        },
        {
          id: 7,
          title: 'City of God',
          year: 2002,
          runtime: 130,
          genres: ['Crime', 'Drama'],
          director: 'Fernando Meirelles, Kátia Lund',
          actors: 'Alexandre Rodrigues, Leandro Firmino, Phellipe Haagensen, Douglas Silva',
          plot: 'Two boys growing up in a violent neighborhood of Rio de Janeiro take different paths: one becomes a photographer, the other a drug dealer.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMjA4ODQ3ODkzNV5BMl5BanBnXkFtZTYwOTc4NDI3._V1_SX300.jpg',
        },
        {
          id: 5,
          title: 'Valkyrie',
          year: 2008,
          runtime: 121,
          genres: ['Drama', 'History', 'Thriller'],
          director: 'Bryan Singer',
          actors: 'Tom Cruise, Kenneth Branagh, Bill Nighy, Tom Wilkinson',
          plot: 'A dramatization of the 20 July assassination and political coup plot by desperate renegade German Army officers against Hitler during World War II.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTg3Njc2ODEyN15BMl5BanBnXkFtZTcwNTAwMzc3NA@@._V1_SX300.jpg',
        },
        {
          id: 9,
          title: 'The Intouchables',
          year: 2011,
          runtime: 112,
          genres: ['Biography', 'Comedy', 'Drama'],
          director: 'Olivier Nakache, Eric Toledano',
          actors: 'François Cluzet, Omar Sy, Anne Le Ny, Audrey Fleurot',
          plot: 'After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_SX300.jpg',
        },
      ];

      expect(movie).toEqual(expectedResponse);
    });

    it('should return a array of movies with runtime between duration + 10 or duration - 10 and genres specifed in query parameters ', async () => {
      const queryParams: TGetMovies = {
        genres: ['Crime', 'Drama'],
        duration: 130,
      };
      const mockData = [
        {
          id: 1,
          title: 'Beetlejuice',
          year: '1988',
          runtime: '92',
          genres: ['Comedy', 'Fantasy'],
          director: 'Tim Burton',
          actors: 'Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page',
          plot: 'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg',
        },
        {
          id: 2,
          title: 'The Cotton Club',
          year: '1984',
          runtime: '127',
          genres: ['Crime', 'Drama', 'Music'],
          director: 'Francis Ford Coppola',
          actors: 'Richard Gere, Gregory Hines, Diane Lane, Lonette McKee',
          plot: 'The Cotton Club was a famous night club in Harlem. The story follows the people that visited the club, those that ran it, and is peppered with the Jazz music that made it so famous.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU5ODAyNzA4OV5BMl5BanBnXkFtZTcwNzYwNTIzNA@@._V1_SX300.jpg',
        },
        {
          id: 3,
          title: 'The Shawshank Redemption',
          year: '1994',
          runtime: '142',
          genres: ['Crime', 'Drama'],
          director: 'Frank Darabont',
          actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
          plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg',
        },
        {
          id: 4,
          title: 'Crocodile Dundee',
          year: '1986',
          runtime: '97',
          genres: ['Adventure', 'Comedy'],
          director: 'Peter Faiman',
          actors: 'Paul Hogan, Linda Kozlowski, John Meillon, David Gulpilil',
          plot: 'An American reporter goes to the Australian outback to meet an eccentric crocodile poacher and invites him to New York City.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTg0MTU1MTg4NF5BMl5BanBnXkFtZTgwMDgzNzYxMTE@._V1_SX300.jpg',
        },
        {
          id: 5,
          title: 'Valkyrie',
          year: '2008',
          runtime: '121',
          genres: ['Drama', 'History', 'Thriller'],
          director: 'Bryan Singer',
          actors: 'Tom Cruise, Kenneth Branagh, Bill Nighy, Tom Wilkinson',
          plot: 'A dramatization of the 20 July assassination and political coup plot by desperate renegade German Army officers against Hitler during World War II.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTg3Njc2ODEyN15BMl5BanBnXkFtZTcwNTAwMzc3NA@@._V1_SX300.jpg',
        },
        {
          id: 6,
          title: 'Ratatouille',
          year: '2007',
          runtime: '111',
          genres: ['Animation', 'Comedy', 'Family'],
          director: 'Brad Bird, Jan Pinkava',
          actors: 'Patton Oswalt, Ian Holm, Lou Romano, Brian Dennehy',
          plot: 'A rat who can cook makes an unusual alliance with a young kitchen worker at a famous restaurant.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTMzODU0NTkxMF5BMl5BanBnXkFtZTcwMjQ4MzMzMw@@._V1_SX300.jpg',
        },
        {
          id: 7,
          title: 'City of God',
          year: '2002',
          runtime: '130',
          genres: ['Crime', 'Drama'],
          director: 'Fernando Meirelles, Kátia Lund',
          actors: 'Alexandre Rodrigues, Leandro Firmino, Phellipe Haagensen, Douglas Silva',
          plot: 'Two boys growing up in a violent neighborhood of Rio de Janeiro take different paths: one becomes a photographer, the other a drug dealer.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMjA4ODQ3ODkzNV5BMl5BanBnXkFtZTYwOTc4NDI3._V1_SX300.jpg',
        },
        {
          id: 8,
          title: 'Memento',
          year: '2000',
          runtime: '113',
          genres: ['Mystery', 'Thriller'],
          director: 'Christopher Nolan',
          actors: 'Guy Pearce, Carrie-Anne Moss, Joe Pantoliano, Mark Boone Junior',
          plot: "A man juggles searching for his wife's murderer and keeping his short-term memory loss from being an obstacle.",
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BNThiYjM3MzktMDg3Yy00ZWQ3LTk3YWEtN2M0YmNmNWEwYTE3XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
        },
        {
          id: 9,
          title: 'The Intouchables',
          year: '2011',
          runtime: '112',
          genres: ['Biography', 'Comedy', 'Drama'],
          director: 'Olivier Nakache, Eric Toledano',
          actors: 'François Cluzet, Omar Sy, Anne Le Ny, Audrey Fleurot',
          plot: 'After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4Mzc1Nw@@._V1_SX300.jpg',
        },
      ];

      jest.spyOn(mockMovieRepository, 'getAllMovies').mockResolvedValue(mockData);
      const movie = await movieService.getAllMovies(queryParams);

      const expectedResponse = [
        {
          id: 2,
          title: 'The Cotton Club',
          year: 1984,
          runtime: 127,
          genres: ['Crime', 'Drama', 'Music'],
          director: 'Francis Ford Coppola',
          actors: 'Richard Gere, Gregory Hines, Diane Lane, Lonette McKee',
          plot: 'The Cotton Club was a famous night club in Harlem. The story follows the people that visited the club, those that ran it, and is peppered with the Jazz music that made it so famous.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMTU5ODAyNzA4OV5BMl5BanBnXkFtZTcwNzYwNTIzNA@@._V1_SX300.jpg',
        },
        {
          id: 7,
          title: 'City of God',
          year: 2002,
          runtime: 130,
          genres: ['Crime', 'Drama'],
          director: 'Fernando Meirelles, Kátia Lund',
          actors: 'Alexandre Rodrigues, Leandro Firmino, Phellipe Haagensen, Douglas Silva',
          plot: 'Two boys growing up in a violent neighborhood of Rio de Janeiro take different paths: one becomes a photographer, the other a drug dealer.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BMjA4ODQ3ODkzNV5BMl5BanBnXkFtZTYwOTc4NDI3._V1_SX300.jpg',
        },
        {
          id: 5,
          title: 'Valkyrie',
          year: 2008,
          runtime: 121,
          genres: ['Drama', 'History', 'Thriller'],
          director: 'Bryan Singer',
          actors: 'Tom Cruise, Kenneth Branagh, Bill Nighy, Tom Wilkinson',
          plot: 'A dramatization of the 20 July assassination and political coup plot by desperate renegade German Army officers against Hitler during World War II.',
          posterUrl: 'http://ia.media-imdb.com/images/M/MV5BMTg3Njc2ODEyN15BMl5BanBnXkFtZTcwNTAwMzc3NA@@._V1_SX300.jpg',
        },
      ];

      expect(movie).toEqual(expectedResponse);
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
        id: expect.any(Number),
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
        id: expect.any(Number),
        title: 'Nebraska',
        year: 2013,
        runtime: 117,
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
        id: expect.any(Number),
        title: 'Nebraska',
        year: 2013,
        runtime: 117,
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
        id: expect.any(Number),
        title: 'Nebraska',
        year: 2013,
        runtime: 117,
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
