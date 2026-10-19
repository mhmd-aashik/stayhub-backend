import type { Property } from '../../database/schema/properties.schema.js';

export class HostPropertyDto {
  id!: string;
  title!: string;
  description!: string | null;

  city!: string;
  country!: string;
  address!: string | null;

  pricePerNight!: string;
  maxGuests!: number;
  bedrooms!: number;
  bathrooms!: number;

  status!: Property['status'];

  createdAt!: Date;
  updatedAt!: Date;
}

export function toHostPropertyDto(property: Property): HostPropertyDto {
  return {
    id: property.id,
    title: property.title,
    description: property.description,

    city: property.city,
    country: property.country,
    address: property.address,

    pricePerNight: property.pricePerNight,
    maxGuests: property.maxGuests,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,

    status: property.status,

    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  };
}
