import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist : true,
      forbidNonWhitelisted : true
    }
  ))
  const loggerInstance = app.get(Logger);
  // this is the exception filters (it handles only http exceptions)
  app.useGlobalFilters(new HttpExceptionFilter(loggerInstance))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
