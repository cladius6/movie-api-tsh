// eslint-disable-next-line @typescript-eslint/no-var-requires
require('tsconfig-paths').register({
  baseUrl: './build',
  paths: {
    '@/*': ['./*'],
  },
});

import app from './app';
import config from '@/config';

async function bootstrap() {
  const port = config.api.port;
  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}

bootstrap();
