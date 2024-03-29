import dotenv from 'dotenv';
import { z } from 'zod';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';

const envFound = dotenv.config({
  path: envFile,
});
if (envFound.error) throw new Error(`⚠️  Couldn't find ${envFile} file  ⚠️`);

const configSchema = z.object({
  PORT: z.preprocess(val => Number(val), z.number()),
  API_PREFIX: z.string(),
  DB_MOVIES_FILE_NAME: z.string(),
});

const config = configSchema.parse(process.env);

export default {
  dbMoviesFileName: config.DB_MOVIES_FILE_NAME,
  api: {
    prefix: config.API_PREFIX,
    port: config.PORT,
  },
};
