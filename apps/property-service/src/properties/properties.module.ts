import { Module } from '@nestjs/common';
import { PropertiesRepository } from './properties.repository.js';

@Module({
  imports: [],
  controllers: [],
  providers: [PropertiesRepository],
  exports: [PropertiesRepository],
})
export class PropertiesModule {}
