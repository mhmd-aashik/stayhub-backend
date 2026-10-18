import { Module } from '@nestjs/common';
import { PropertiesRepository } from './properties.repository.js';
import { PropertiesService } from './properties.service.js';
import { PropertiesController } from './properties.controller.js';

@Module({
  imports: [],
  controllers: [PropertiesController],
  providers: [PropertiesRepository, PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
