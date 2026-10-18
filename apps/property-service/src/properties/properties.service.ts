import { NotFoundException } from '@nestjs/common';
import { NewProperty, Property } from '../database/schema/properties.schema.js';
import { PropertiesRepository } from './properties.repository.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';

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

  async create(dto: CreatePropertyDto, hostId: string): Promise<Property> {
    const data: NewProperty = {
      hostId,
      title: dto.title,
      description: dto.description,
      city: dto.city,
      country: dto.country,
      address: dto.address,
      pricePerNight: dto.pricePerNight.toFixed(2),
      maxGuests: dto.maxGuests,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
    };

    return this.propertiesRepository.create(data);
  }
}
