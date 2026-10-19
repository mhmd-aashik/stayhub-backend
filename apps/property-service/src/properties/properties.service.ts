import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NewProperty, Property } from '../database/schema/properties.schema.js';
import { PropertiesRepository } from './properties.repository.js';
import { CreatePropertyDto } from './dto/create-property.dto.js';
import { UpdatePropertyDto } from './dto/update-property.dto.js';
import { SearchPropertiesDto } from './dto/search-properties.dto.js';

@Injectable()
export class PropertiesService {
  constructor(
    @Inject(PropertiesRepository)
    private readonly propertiesRepository: PropertiesRepository,
  ) {}

  async findAll(): Promise<Property[]> {
    return this.propertiesRepository.findAll();
  }

  async findPublished(): Promise<Property[]> {
    return this.propertiesRepository.findPublished();
  }

  async search(filters: SearchPropertiesDto): Promise<Property[]> {
    // Validate the price range
    if (
      filters.minPrice !== undefined &&
      filters.maxPrice !== undefined &&
      filters.minPrice > filters.maxPrice
    ) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    // Delegate database filtering to the repository
    return this.propertiesRepository.search(filters);
  }

  async findById(id: string): Promise<Property> {
    const property = await this.propertiesRepository.findById(id);

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async findPublishedById(id: string): Promise<Property> {
    const property = await this.propertiesRepository.findPublishedById(id);

    if (!property) {
      throw new NotFoundException('Property not found');
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

  async update(id: string, dto: UpdatePropertyDto): Promise<Property> {
    if (
      !dto ||
      Object.values(dto).every((value) => value === undefined || value === null)
    ) {
      throw new BadRequestException(
        'At least one property field must be provided',
      );
    }

    const data: Parameters<PropertiesRepository['update']>[1] = {
      title: dto.title ?? undefined,
      description: dto.description ?? undefined,
      city: dto.city ?? undefined,
      country: dto.country ?? undefined,
      address: dto.address ?? undefined,
      pricePerNight:
        dto.pricePerNight == null ? undefined : dto.pricePerNight.toFixed(2),
      maxGuests: dto.maxGuests ?? undefined,
      bedrooms: dto.bedrooms ?? undefined,
      bathrooms: dto.bathrooms ?? undefined,
    };

    const property = await this.propertiesRepository.update(id, data);

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async delete(id: string): Promise<Property> {
    const property = await this.propertiesRepository.delete(id);

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }
}
