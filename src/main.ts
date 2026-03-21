import * as dotenv from 'dotenv';
dotenv.config();

import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './instrument';
import { CatchAllExceptionFilter } from './common/utils/global.filter';
import { LoggerService } from './common/logger';
import * as Sentry from '@sentry/nestjs';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  const logger = app.get(LoggerService);
  app.useGlobalFilters(new CatchAllExceptionFilter(logger));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));
  const port = process.env.PORT || 3000;
  console.log(port);
  await app.listen(port, '0.0.0.0');
}
bootstrap().catch((error) => {
  Sentry.captureException(error);
  console.error('Error during application bootstrap:', error);
  process.exit(1);
});
