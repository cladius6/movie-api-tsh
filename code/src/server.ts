import app from './app';
import config from '@/config';

async function bootstrap() {
  const port = config.api.port;
  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}

bootstrap();
