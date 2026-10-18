import { Module } from '@nestjs/common';
import { PropertiesRepository } from './properties.repository.js';
import { PropertiesService } from './properties.service.js';

@Module({
  imports: [],
  controllers: [],
  providers: [PropertiesRepository, PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
