import { MovieRepository } from '@/repositories/movie.repository';
import { DatabaseService } from '@/services/database.service';

describe(MovieRepository.name, () => {
  let movieRepository: MovieRepository;
  let databaseService: DatabaseService;

  beforeEach(() => {
    databaseService = new DatabaseService();
    movieRepository = new MovieRepository(databaseService);
  });

  it('should retrieve all movies from the database correctly', async () => {
    const mockedData = {
      genres: [
        'Comedy',
        'Fantasy',
        'Crime',
        'Drama',
        'Music',
        'Adventure',
        'History',
        'Thriller',
        'Animation',
        'Family',
        'Mystery',
        'Biography',
        'Action',
        'Film-Noir',
        'Romance',
        'Sci-Fi',
        'War',
        'Western',
        'Horror',
        'Musical',
        'Sport',
      ],
      movies: [
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
      ],
    };

    jest.spyOn(databaseService, 'readDb').mockResolvedValue(mockedData);
    const data = await movieRepository.getAllMovies();

    expect(data).toEqual(mockedData.movies);
  });

  it('should add a new movie to the database correctly', async () => {
    const mockedData = {
      genres: [
        'Comedy',
        'Fantasy',
        'Crime',
        'Drama',
        'Music',
        'Adventure',
        'History',
        'Thriller',
        'Animation',
        'Family',
        'Mystery',
        'Biography',
        'Action',
        'Film-Noir',
        'Romance',
        'Sci-Fi',
        'War',
        'Western',
        'Horror',
        'Musical',
        'Sport',
      ],
      movies: [
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
      ],
    };

    jest.spyOn(databaseService, 'readDb').mockResolvedValue(mockedData);
    jest.spyOn(databaseService, 'writeDb').mockResolvedValue();

    const newMovie = {
      title: 'Crocodile Dundee',
      year: '1986',
      runtime: '97',
      genres: ['Adventure', 'Comedy'],
      director: 'Peter Faiman',
      actors: 'Paul Hogan, Linda Kozlowski, John Meillon, David Gulpilil',
      plot: 'An American reporter goes to the Australian outback to meet an eccentric crocodile poacher and invites him to New York City.',
      posterUrl:
        'https://images-na.ssl-images-amazon.com/images/M/MV5BMTg0MTU1MTg4NF5BMl5BanBnXkFtZTgwMDgzNzYxMTE@._V1_SX300.jpg',
    };

    const data = await movieRepository.addMovie(newMovie);

    expect(data).toEqual({ ...newMovie, id: 3 });
    expect(databaseService.writeDb).toHaveBeenCalled();
  });
});
