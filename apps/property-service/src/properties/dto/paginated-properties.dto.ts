import type { PublicPropertyDto } from './public-property.dto.js';

export class PaginationMetaDto {
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
  hasNextPage!: boolean;
  hasPreviousPage!: boolean;
}

export class PaginatedPropertiesDto {
  data!: PublicPropertyDto[];
  meta!: PaginationMetaDto;
}

export function createPaginatedPropertiesDto(
  data: PublicPropertyDto[],
  total: number,
  page: number,
  limit: number,
): PaginatedPropertiesDto {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1 && totalPages > 0,
    },
  };
}
