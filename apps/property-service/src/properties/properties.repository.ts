import { Inject, Injectable } from '@nestjs/common';
import {
  DATABASE_CONNECTION,
  type DatabaseConnection,
} from '../database/database.provider.js';
import {
  NewProperty,
  properties,
  Property,
} from '../database/schema/properties.schema.js';
import { and, desc, eq, gte, ilike, lte, SQL } from 'drizzle-orm';
import { async } from 'rxjs';
import { SearchPropertiesDto } from './dto/search-properties.dto.js';

@Injectable()
export class PropertiesRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly connection: DatabaseConnection,
  ) {}

  async findAll(): Promise<Property[]> {
    return this.connection.db.select().from(properties);
  }

  async findPublished(): Promise<Property[]> {
    return this.connection.db
      .select()
      .from(properties)
      .where(eq(properties.status, 'PUBLISHED'));
  }

  async search(filters: SearchPropertiesDto): Promise<Property[]> {
    const conditions: SQL[] = [eq(properties.status, 'PUBLISHED')];

    // Filter by city
    if (filters.city?.trim()) {
      conditions.push(ilike(properties.city, filters.city.trim()));
    }

    // Minimum nightly price
    if (filters.minPrice !== undefined) {
      conditions.push(
        gte(properties.pricePerNight, filters.minPrice.toFixed(2)),
      );
    }

    // Maximum nightly price
    if (filters.maxPrice !== undefined) {
      conditions.push(
        lte(properties.pricePerNight, filters.maxPrice.toFixed(2)),
      );
    }

    // Minimum guest capacity
    if (filters.guests !== undefined) {
      conditions.push(gte(properties.maxGuests, filters.guests));
    }

    // Pagination
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const offset = (page - 1) * limit;

    return this.connection.db
      .select()
      .from(properties)
      .where(and(...conditions))
      .orderBy(desc(properties.createdAt), desc(properties.id))
      .limit(limit)
      .offset(offset);
  }

  async findById(id: string): Promise<Property | undefined> {
    const [property] = await this.connection.db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    return property;
  }

  async findPublishedById(id: string): Promise<Property | undefined> {
    const [property] = await this.connection.db
      .select()
      .from(properties)
      .where(and(eq(properties.id, id), eq(properties.status, 'PUBLISHED')))
      .limit(1);

    return property;
  }

  async create(data: NewProperty): Promise<Property> {
    const [property] = await this.connection.db
      .insert(properties)
      .values(data)
      .returning();

    if (!property) {
      throw new Error('Failed to create property');
    }

    return property;
  }

  async update(
    id: string,
    data: Partial<
      Pick<
        NewProperty,
        | 'title'
        | 'description'
        | 'city'
        | 'country'
        | 'address'
        | 'pricePerNight'
        | 'maxGuests'
        | 'bedrooms'
        | 'bathrooms'
      >
    >,
  ): Promise<Property | undefined> {
    const [property] = await this.connection.db
      .update(properties)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(properties.id, id))
      .returning();

    return property;
  }

  async delete(id: string): Promise<Property | undefined> {
    const [property] = await this.connection.db
      .delete(properties)
      .where(eq(properties.id, id))
      .returning();

    return property;
  }
}
