import {
  Global,
  Inject,
  Injectable,
  Module,
  OnApplicationShutdown,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import {
  DATABASE_CONNECTION,
  createDatabaseConnection,
  type DatabaseConnection,
} from './database.provider.js';

@Injectable()
class DatabaseLifecycle implements OnApplicationShutdown {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly connection: DatabaseConnection,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await this.connection.client.end({
      timeout: 5,
    });
  }
}

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        return createDatabaseConnection(configService);
      },
      inject: [ConfigService],
    },
    DatabaseLifecycle,
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
