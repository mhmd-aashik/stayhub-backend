import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { PropertiesService } from './properties.service.js';
import {
  PublicPropertyDto,
  toPublicPropertyDto,
} from './dto/public-property.dto.js';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async findAll(): Promise<PublicPropertyDto[]> {
    const properties = await this.propertiesService.findPublished();
    return properties.map(toPublicPropertyDto);
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
