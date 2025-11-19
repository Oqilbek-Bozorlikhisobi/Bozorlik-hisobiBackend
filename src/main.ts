import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add CORS configuration here
  app.enableCors({
    origin: [
      'https://www.bozorapp.uz/',
      'https://marketveb.uz',
      'http://localhost:3000',
      'https://market-admin-beta.vercel.app/',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : ['Invalid value'];
          return {
            property: error.property,
            value: error.value,
            message: constraints[0],
          };
        });

        return new BadRequestException({
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Bozorlik Management API')
    .setDescription('API documentation for the Bozorlik Management System')
    .setVersion('1.0')
    .addTag('apis')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
        description: 'Enter your JWT token with Bearer prefix',
      },
      'access-token', // Bu nom muhim
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true, // Avtorizatsiyani saqlab qoladi
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 3000);

  await app.listen(
    port,
    configService.get<string>('app.host', 'localhost'),
    () => {
      console.log(`📦 Bozorlik Backend is running on port ${port}`);
      console.log(
        `🔗 Swagger documentation available at: http://localhost:${port}/docs`,
      );
    },
  );
}

bootstrap();