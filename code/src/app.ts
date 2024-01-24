import 'reflect-metadata';
import { Request, Response } from 'express';
import express from 'express';
import config from '@/config';
import routes from '@/api';
import { errorHandler } from './handlers/error.handler';

async function bootstrap() {
  const app = express();
  const port = config.api.port;

  app.use(express.json());

  app.get('/status', (_req: Request, res: Response) => {
    res.status(200);
  });

  app.use(config.api.prefix, routes());

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}

bootstrap();
