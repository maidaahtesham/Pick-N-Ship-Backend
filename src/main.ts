// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('📍 Starting bootstrap...');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ✅ CORS must be enabled before app.listen()
  // // app.enableCors({
  // // // origin: ['http://localhost:3002', 'http://18.132.206.173:3001'] ,// add your new origin here
 
  // // origin: '*',  // ✅ allow all origins (not for production)
 
  
  // // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  // //   credentials: true,
  // // });


    app.enableCors({
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true,               // allow cookies/auth headers
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  console.log('✅ AppModule created.');
  await app.listen(3002);
  console.log(`🚀 Application is running on: http://localhost:3002`);
}

bootstrap();
