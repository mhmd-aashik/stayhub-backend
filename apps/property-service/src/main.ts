import { DatabaseConnection } from './database/database.provider.js';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DATABASE_CONNECTION } from './database/database.provider.js';
import { sql } from 'drizzle-orm';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable SIGTERM and SIGINT shutdown handling
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const connection = app.get<DatabaseConnection>(DATABASE_CONNECTION);

  try {
    // Verify the actual PostgreSQL connection
    await connection.db.execute(sql`SELECT 1`);

    console.log('PostgreSQL connected successfully');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);

    await app.close();
    process.exitCode = 1;
    return;
  }

  const port = Number(process.env.PORT ?? 3003);

  await app.listen(port);

  console.log(`Property Service running on http://localhost:${port}`);
}
await bootstrap();
