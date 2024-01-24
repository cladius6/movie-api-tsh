import { MovieController } from '@/controllers/movie.controller';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

const route = Router();

export default (app: Router) => {
  app.use('/movies', route);
  const movieController = Container.get(MovieController);

  route.get('/', (req: Request, res: Response, next: NextFunction) => movieController.getAllMovies(req, res, next));
  route.post('/', (req: Request, res: Response, next: NextFunction) => movieController.createMovie(req, res, next));
};
