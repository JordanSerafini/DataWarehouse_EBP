import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('EBP Mobile API')
    .setDescription(
      'API REST pour application mobile EBP multi-profils (Super Admin, Admin, Patron, Commerciaux, Chef de chantier, Techniciens)',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication', 'Endpoints d\'authentification')
    .addTag('Sync', 'Synchronisation données')
    .addTag('Interventions', 'Interventions terrain (Techniciens)')
    .addTag('Sales', 'Ventes et devis (Commerciaux)')
    .addTag('Projects', 'Chantiers (Chef de chantier)')
    .addTag('Dashboard', 'KPIs et dashboard (Patron)')
    .addTag('Admin', 'Administration (Super Admin, Admin)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('');
  console.log('🚀 API Mobile EBP démarrée');
  console.log(`📡 http://localhost:${port}`);
  console.log(`📚 Documentation: http://localhost:${port}/api/docs`);
  console.log('');
}

bootstrap();
