import { Request, Response } from 'express';
import express from 'express';
import config from './config';

async function bootstrap() {
  const app = express();
  const port = config.port;

  app.get('/', (_req: Request, res: Response) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

bootstrap();
