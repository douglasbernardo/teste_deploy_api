import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'config.env';
import * as process from 'process';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.enableCors();
  // app.enableCors({origin: process.env.MOBILE_URL_REMOTE,});
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.listen({ port: parseInt(process.env.PORT) || 4000 }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server is running on ${address}`);
  });
}
bootstrap();
