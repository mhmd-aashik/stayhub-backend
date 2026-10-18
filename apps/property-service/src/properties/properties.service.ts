import { NotFoundException } from '@nestjs/common';
import { Property } from '../database/schema/properties.schema.js';
import { PropertiesRepository } from './properties.repository.js';

export class PropertiesService {
  constructor(private readonly propertiesRepository: PropertiesRepository) {}

  async findAll(): Promise<Property[]> {
    return this.propertiesRepository.findAll();
  }

  async findById(id: string): Promise<Property | undefined> {
    const property = await this.propertiesRepository.findById(id);

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }
}
