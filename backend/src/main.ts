import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      hidePoweredBy: true,
    }),
  );

  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  if (process.env.SWAGGER_HABILITADO === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Sistema de Gestión de Proyectos')
      .setDescription(
        'Descripción de la API del sistema de gestión de proyectos',
      )
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(globalPrefix, app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
