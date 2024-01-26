import request from 'supertest';
import app from '@/app';
import { copyFile, writeFile, readFile, unlink } from 'fs/promises';
import { ApiMovie } from '@/models/api-movie.model';
import { join } from 'path';

describe('MovieController', () => {
  let dbPath = join(__dirname + '/../../data/');
  beforeAll(async () => {
    await copyFile(
      join(dbPath + process.env.DB_MOVIES_FILE_NAME),
      join(dbPath + process.env.DB_MOVIES_FILE_NAME + '.temp'),
    );
  });

  afterAll(async () => {
    const swapDbData = JSON.parse(await readFile(join(dbPath + process.env.DB_MOVIES_FILE_NAME + '.temp'), 'utf-8'));
    await writeFile(
      join(dbPath, process.env.DB_MOVIES_FILE_NAME || 'db.test.json'),
      JSON.stringify(swapDbData, null, 2),
      'utf-8',
    );
    await unlink(join(dbPath + process.env.DB_MOVIES_FILE_NAME + '.temp'));
  });

  describe('GET /movies', () => {
    it('should return a signle random movie if no params specified', async () => {
      const response = await request(app).get('/api/movies');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          id: expect.any(Number),
          title: expect.any(String),
          year: expect.any(Number),
          runtime: expect.any(Number),
          genres: expect.any(Array),
          director: expect.any(String),
          actors: expect.any(String),
          plot: expect.any(String),
          posterUrl: expect.any(String),
        },
      ]);
    });

    it('should return a signle random movie with correct runtime if duration param specified', async () => {
      const duration = 100;
      const response = await request(app).get(`/api/movies?duration=${duration}`);
      expect(response.status).toBe(200);
      const movies = response.body;
      movies.forEach((movie: ApiMovie) => {
        const runtime = movie.runtime;
        expect(runtime).toBeGreaterThanOrEqual(duration - 10);
        expect(runtime).toBeLessThanOrEqual(duration + 10);
      });
    });

    it('should return a list of movies with correct genres', async () => {
      const genres = ['Comedy'];
      const response = await request(app).get(`/api/movies?genres=${genres[0]}`);
      expect(response.status).toBe(200);
      const movies = response.body;
      movies.forEach((movie: ApiMovie) => {
        const hasExpectedGenre = movie.genres.some(genre => genres.includes(genre));
        expect(hasExpectedGenre).toBeTruthy();
      });
    });

    it('should return a list of movies with correct genres', async () => {
      const genres = ['Crime', 'Drama'];
      const response = await request(app).get(`/api/movies?genres=${genres[0]}&genres=${genres[1]}`);
      expect(response.status).toBe(200);
      const movies = response.body;
      movies.forEach((movie: ApiMovie) => {
        const hasExpectedGenre = movie.genres.some(genre => genres.includes(genre));
        expect(hasExpectedGenre).toBeTruthy();
      });
    });

    it('should return a list of movies with correct genres & runtime', async () => {
      const genres = ['Crime', 'Drama'];
      const duration = 80;
      const response = await request(app).get(
        `/api/movies?genres=${genres[0]}&genres=${genres[1]}&duration=${duration}`,
      );
      expect(response.status).toBe(200);
      const movies = response.body;
      movies.forEach((movie: ApiMovie) => {
        const hasExpectedGenre = movie.genres.some(genre => genres.includes(genre));
        const runtime = movie.runtime;
        expect(hasExpectedGenre).toBeTruthy();
        expect(runtime).toBeGreaterThanOrEqual(duration - 10);
        expect(runtime).toBeLessThanOrEqual(duration + 10);
      });
    });

    it('should return return 400 if duration is string', async () => {
      const duration = 'abc';
      const response = await request(app).get(`/api/movies?duration=${duration}`);
      expect(response.status).toBe(400);
    });
  });

  describe('POST /movies', () => {
    it('should create a new movie', async () => {
      const newMovie = {
        title: 'The Big Short',
        year: 2015,
        runtime: 130,
        genres: ['Biography', 'Comedy', 'Drama'],
        director: 'Adam McKay',
        actors: 'Ryan Gosling, Rudy Eisenzopf, Casey Groves, Charlie Talbert',
        plot: 'Four denizens in the world of high-finance predict the credit and housing bubble collapse of the mid-2000s, and decide to take on the big banks for their greed and lack of foresight.',
        posterUrl:
          'https://images-na.ssl-images-amazon.com/images/M/MV5BNDc4MThhN2EtZjMzNC00ZDJmLThiZTgtNThlY2UxZWMzNjdkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg',
      };
      const response = await request(app).post('/api/movies').send(newMovie);
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: expect.any(Number), ...newMovie });
    });

    it('should create a new movie without actors correctly', async () => {
      const newMovie = {
        title: 'The Big Short',
        year: 2015,
        runtime: 130,
        genres: ['Biography', 'Comedy', 'Drama'],
        director: 'Adam McKay',
        plot: 'Four denizens in the world of high-finance predict the credit and housing bubble collapse of the mid-2000s, and decide to take on the big banks for their greed and lack of foresight.',
        posterUrl:
          'https://images-na.ssl-images-amazon.com/images/M/MV5BNDc4MThhN2EtZjMzNC00ZDJmLThiZTgtNThlY2UxZWMzNjdkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg',
      };
      const expectedResponse = {
        id: expect.any(Number),
        title: 'The Big Short',
        year: 2015,
        runtime: 130,
        genres: ['Biography', 'Comedy', 'Drama'],
        director: 'Adam McKay',
        actors: '',
        plot: 'Four denizens in the world of high-finance predict the credit and housing bubble collapse of the mid-2000s, and decide to take on the big banks for their greed and lack of foresight.',
        posterUrl:
          'https://images-na.ssl-images-amazon.com/images/M/MV5BNDc4MThhN2EtZjMzNC00ZDJmLThiZTgtNThlY2UxZWMzNjdkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg',
      };
      const response = await request(app).post('/api/movies').send(newMovie);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expectedResponse);
    });

    it('should create a new movie without actors, plot correctly', async () => {
      const newMovie = {
        title: 'The Big Short',
        year: 2015,
        runtime: 130,
        genres: ['Biography', 'Comedy', 'Drama'],
        director: 'Adam McKay',
        posterUrl:
          'https://images-na.ssl-images-amazon.com/images/M/MV5BNDc4MThhN2EtZjMzNC00ZDJmLThiZTgtNThlY2UxZWMzNjdkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg',
      };
      const expectedResponse = {
        id: expect.any(Number),
        title: 'The Big Short',
        year: 2015,
        runtime: 130,
        genres: ['Biography', 'Comedy', 'Drama'],
        director: 'Adam McKay',
        actors: '',
        plot: '',
        posterUrl:
          'https://images-na.ssl-images-amazon.com/images/M/MV5BNDc4MThhN2EtZjMzNC00ZDJmLThiZTgtNThlY2UxZWMzNjdkXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg',
      };
      const response = await request(app).post('/api/movies').send(newMovie);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expectedResponse);
    });

    it('should create a new movie without actors, plot and posterUrl correctly', async () => {
      const newMovie = {
        title: 'The Big Short',
        year: 2015,
        runtime: 130,
        genres: ['Biography', 'Comedy', 'Drama'],
        director: 'Adam McKay',
      };
      const expectedResponse = {
        id: expect.any(Number),
        title: 'The Big Short',
        year: 2015,
        runtime: 130,
        genres: ['Biography', 'Comedy', 'Drama'],
        director: 'Adam McKay',
        actors: '',
        plot: '',
        posterUrl: '',
      };
      const response = await request(app).post('/api/movies').send(newMovie);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expectedResponse);
    });

    it('should return status 400 when creating a new movie if title is more then 255 characters', async () => {
      const newMovie = {
        title:
          'The Big ShortThe Big ShortThe  Big ShortThe Big ShortTh Big ShortThe Big ShortTh Big ShortThe Big ShortTh Big ShortThe Big ShortTh Big ShortThe Big ShortTh Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big ShortThe Big Short',
        year: 2015,
        runtime: 130,
        genres: ['Biography', 'Comedy', 'Drama'],
        director: 'Adam McKay',
      };

      const response = await request(app).post('/api/movies').send(newMovie);
      expect(response.status).toBe(400);
    });

    it('should return status 400 when creating a new movie if director is more then 255 characters', async () => {
      const newMovie = {
        title: 'The Big Short',
        year: 2015,
        runtime: 130,
        genres: ['Biography', 'Comedy', 'Drama'],
        director:
          'AdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKayAdamMcKay',
      };

      const response = await request(app).post('/api/movies').send(newMovie);
      expect(response.status).toBe(400);
    });

    it('should return status 400 if data is missing genres when creating a new movie', async () => {
      const newMovie = {
        title: 'The Big Short',
        year: 2015,
        runtime: 130,
        director: 'Adam Mac',
      };

      const response = await request(app).post('/api/movies').send(newMovie);
      expect(response.status).toBe(400);
    });
  });
});
