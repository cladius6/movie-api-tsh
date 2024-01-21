import { Movie } from '@/Movie';
import { MovieController } from '@/controllers/movie.controller';
import { Router, Request, Response } from 'express';
import { Container } from 'typedi';

const route = Router();

export default (app: Router) => {
  app.use('/movies', route);
  const movieController = Container.get(MovieController);

  route.get('/', (req: Request, res: Response) => movieController.getAllMovies(req, res));
};
