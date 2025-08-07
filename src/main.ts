// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
  import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
    console.log('📍 Starting bootstrap...');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enable automatic transformation of DTO fields
      transformOptions: { enableImplicitConversion: true }, // Allow implicit conversions
    }),
  );    // app.setGlobalPrefix('api');

  console.log('✅ AppModule created.');
  // const port = process.env.PORT || 3000;
  await app.listen(3001);
  console.log(`🚀 Application is running on: http://localhost:3000}`);
}
bootstrap();
