import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Property } from './models/property.model.js';

const properties: Property[] = [
  {
    id: '1',
    title: 'Luxury Beach Villa',
    location: 'Dubai',
    pricePerNight: 850,
    maxGuests: 6,
    available: true,
  },
  {
    id: '2',
    title: 'Modern City Apartment',
    location: 'Abu Dhabi',
    pricePerNight: 420,
    maxGuests: 3,
    available: true,
  },
];

@Resolver(() => Property)
export class PropertiesResolver {
  @Query(() => [Property])
  properties(): Property[] {
    return properties;
  }

  @Query(() => Property, { nullable: true })
  property(@Args('id', { type: () => ID }) id: string): Property | null {
    return properties.find((p) => p.id === id) ?? null;
  }
}
