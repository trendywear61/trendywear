import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  }));

  // Enable CORS
  app.enableCors({
    origin: process.env.NODE_ENV === "production"
      ? (origin, callback) => {
          const allowedOrigins = [
            process.env.FRONTEND_URL,
            "https://trendy-wear.vercel.app",
            "https://trendywear61.vercel.app",
            "https://trendywear.vercel.app",
            "http://localhost:5173",
            "http://localhost:3000",
            "https://trendywearz.in",
            "https://www.trendywearz.in"
          ].filter((url): url is string => typeof url === 'string').map(url => url.replace(/\/$/, ''));
          if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app") || origin.includes("localhost")) {
            callback(null, true);
          } else {
            console.error(`Origin blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
          }
        }
      : "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  // Rate limiting for admin login
  app.use('/api/admin/login', rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
  }));

  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));



  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('E-commerce API')
    .setDescription('E-commerce backend API with NestJS and PostgreSQL')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/api-docs`);
}
bootstrap();
