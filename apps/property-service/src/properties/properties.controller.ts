import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service.js';
import {
  PublicPropertyDto,
  toPublicPropertyDto,
} from './dto/public-property.dto.js';
import { SearchPropertiesDto } from './dto/search-properties.dto.js';
import {
  PaginatedPropertiesDto,
  createPaginatedPropertiesDto,
} from './dto/paginated-properties.dto.js';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async search(
    @Query() filters: SearchPropertiesDto,
  ): Promise<PaginatedPropertiesDto> {
    // Step 1: Get records and total count
    const { properties, total } = await this.propertiesService.search(filters);

    // Step 2: Remove internal database fields
    const data = properties.map(toPublicPropertyDto);

    // Step 3: Build pagination metadata
    return createPaginatedPropertiesDto(
      data,
      total,
      filters.page,
      filters.limit,
    );
  }

  @Get(':id')
  async findById(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ): Promise<PublicPropertyDto> {
    const property = await this.propertiesService.findPublishedById(id);

    return toPublicPropertyDto(property);
  }
}
