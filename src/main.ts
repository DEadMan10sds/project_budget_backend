import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
  console.log(`
 -----------------------------------------------------------------------                                      
 _____ _____ _____    __ _____ _____ _____    _____ _____ ____  _____ _____ _____ 
|  _  | __  |     |__|  |   __|     |_   _|  | __  |  |  |    \\|   __|   __|_   _|
|   __|    -|  |  |  |  |   __|   --| | |    | __ -|  |  |  |  |  |  |   __| | |  
|__|  |__|__|_____|_____|_____|_____| |_|    |_____|_____|____/|_____|_____| |_|
 -----------------------------------------------------------------------
|              Nest js server running on port ${port}                      |
|                                                                       |
 -----------------------------------------------------------------------`);
}
void bootstrap();
