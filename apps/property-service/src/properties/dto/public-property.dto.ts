import type { Property } from '../../database/schema/properties.schema.js';

export class PublicPropertyDto {
  id!: string;
  title!: string;
  description!: string | null;
  city!: string;
  country!: string;
  pricePerNight!: string;
  maxGuests!: number;
  bedrooms!: number;
  bathrooms!: number;
}

export function toPublicPropertyDto(property: Property): PublicPropertyDto {
  return {
    id: property.id,
    title: property.title,
    description: property.description,
    city: property.city,
    country: property.country,
    pricePerNight: property.pricePerNight,
    maxGuests: property.maxGuests,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
  };
}
