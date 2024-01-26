import 'reflect-metadata';
import express, { Request, Response } from 'express';
import config from '@/config';
import routes from '@/api';
import { errorHandler } from './handlers/error.handler';

const app = express();

app.use(express.json());

app.get('/status', (_req: Request, res: Response) => {
  res.status(200);
});

app.use(config.api.prefix, routes());
app.use(errorHandler);

export default app;
