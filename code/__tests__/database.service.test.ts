import { DatabaseService } from '@/services/database.service';
import { readFile, writeFile } from 'fs/promises';

jest.mock('fs/promises');

describe(DatabaseService.name, () => {
  let databaseService: DatabaseService;

  beforeEach(() => {
    databaseService = new DatabaseService();
  });

  it('should read data from database correctly', async () => {
    const testData = JSON.stringify({
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
    });

    (readFile as jest.Mock).mockResolvedValue(testData);
    const data = await databaseService.readDb();

    expect(data).toEqual(JSON.parse(testData));
    expect(readFile).toHaveBeenCalled();
  });

  it('should write data to database correctly', async () => {
    const testData = {
      genres: ['Comedy', 'Fantasy', 'Crime', 'Drama', 'Music', 'Adventure'],
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
      ],
    };

    (writeFile as jest.Mock).mockResolvedValue(undefined);

    await databaseService.writeDb(testData);

    expect(writeFile).toHaveBeenCalledWith(expect.any(String), JSON.stringify(testData, null, 2), 'utf-8');
  });
});
