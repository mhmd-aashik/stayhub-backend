import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export const DATABASE_CONNECTION = Symbol('DATABASE_CONNECTION');

export function createDatabaseConnection(configService: ConfigService) {
  const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');

  const client = postgres(databaseUrl, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  const db = drizzle({ client });

  return {
    db,
    client,
  };
}

export type DatabaseConnection = ReturnType<typeof createDatabaseConnection>;
