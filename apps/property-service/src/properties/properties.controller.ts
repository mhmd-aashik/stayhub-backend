import { Controller, Get } from '@nestjs/common';
import { PropertiesService } from './properties.service.js';
import { Property } from '../database/schema/properties.schema.js';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async findAll(): Promise<Property[]> {
    const properties = await this.propertiesService.findAll();

    return properties.filter((property) => property.status === 'PUBLISHED');
  }
}
