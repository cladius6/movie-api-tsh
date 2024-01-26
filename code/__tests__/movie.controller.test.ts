import request from 'supertest';
import express from 'express';
import movieRoutes from '@/api'; // Import your routes
import { MovieService } from '@/services/movie.service';
import app from '@/app';
import { copyFile, writeFile, readFile, unlink } from 'fs/promises';

// jest.mock('@/services/movie.service');

describe('MovieController', () => {
  let dbPath = __dirname + '/../../data/' + process.env.DB_MOVIES_FILE_NAME;
  beforeAll(async () => {
    await copyFile(dbPath || 'db.test.json', process.env.DB_MOVIES_FILE_NAME + '.temp');
  });

  afterAll(async () => {
    const swapDbData = JSON.parse(await readFile(dbPath, 'utf-8'));
    await writeFile(dbPath, JSON.stringify(swapDbData, null, 2), 'utf-8');
    await unlink(process.env.DB_MOVIES_FILE_NAME + '.temp');
  });
  // describe('GET /movies', () => {
  //   it.skip('should retrieve all movies', async () => {
  //     // const mockMovies = [{ id: 1, title: 'Test Movie' /* other properties */ }];
  //     // MovieService.prototype.getAllMovies = jest.fn().mockResolvedValue(mockMovies);
  //     // const response = await request(app).get('/movies');
  //     // expect(response.status).toBe(200);
  //     // expect(response.body).toEqual(mockMovies);
  //   });
  // });
  describe('POST /movies', () => {
    it.skip('should create a new movie', async () => {
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
  });
});
