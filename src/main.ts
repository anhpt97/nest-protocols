import { RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cluster from 'cluster';
import 'dotenv/config';
import { availableParallelism } from 'os';
import { AppModule } from './app.module';
import { APP_NAME, PORT } from './common/constants';
import { i18n } from './common/middlewares';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.use(i18n);

  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });

  SwaggerModule.setup(
    'api-docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder().setTitle(APP_NAME).build(),
    ),
  );

  void app.listen(PORT);
};

if (cluster.isPrimary) {
  [...Array(availableParallelism())].forEach((_, i) =>
    cluster.fork({ NODE_APP_INSTANCE: i }),
  );
} else {
  void bootstrap();
}
