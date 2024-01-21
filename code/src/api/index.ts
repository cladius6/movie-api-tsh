import { Router } from 'express';
import movies from './routes/movies';

export default () => {
  const app = Router();
  movies(app);

  return app;
};
