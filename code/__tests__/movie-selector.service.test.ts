import { DbMovieSelectorService } from '@/services/movie-selector.service';
import { TMovie } from '@/types/api-types';

describe(DbMovieSelectorService.name, () => {
  let movieSelectorService: DbMovieSelectorService;
  let movies: TMovie[];

  beforeEach(() => {
    movieSelectorService = new DbMovieSelectorService();
    movies = [
      {
        id: 1,
        title: 'The Shawshank Redemption',
        year: '1994',
        runtime: '142',
        genres: ['Crime', 'Comedy'],
        director: 'Frank Darabont',
        actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
        plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        posterUrl:
          'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg',
      },
      {
        id: 2,
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
        id: 3,
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
        id: 4,
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
    ];
  });

  describe('getMoviesByDuration', () => {
    it('should filter movies by duration', () => {
      const duration = 101;
      const expectedMovies = [
        {
          id: 2,
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
          id: 4,
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
      ];

      const filteredMovies = movieSelectorService.getMoviesByDuration(movies, duration);
      expect(filteredMovies).toEqual(expectedMovies);
    });
  });

  describe('getRandomMovie', () => {
    it('should return a random movie from the list', () => {
      const randomMovie = movieSelectorService.getRandomMovie(movies);
      expect(movies).toContain(randomMovie);
    });
  });

  describe('getMoviesWithGenres', () => {
    it('should filter and sort movies by genres', () => {
      const genres = ['Comedy', 'Family'];
      const filteredMovies = movieSelectorService.getMoviesWithGenres(movies, genres);
      const expectedResponse = [
        {
          id: 4,
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
          id: 1,
          title: 'The Shawshank Redemption',
          year: '1994',
          runtime: '142',
          genres: ['Crime', 'Comedy'],
          director: 'Frank Darabont',
          actors: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
          plot: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
          posterUrl:
            'https://images-na.ssl-images-amazon.com/images/M/MV5BODU4MjU4NjIwNl5BMl5BanBnXkFtZTgwMDU2MjEyMDE@._V1_SX300.jpg',
        },
        {
          id: 2,
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
      ];

      expect(filteredMovies).toEqual(expectedResponse);
    });
  });
});
