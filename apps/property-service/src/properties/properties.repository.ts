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
import { eq } from 'drizzle-orm';
import { async } from 'rxjs';

@Injectable()
export class PropertiesRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly connection: DatabaseConnection,
  ) {}

  async findAll(): Promise<Property[]> {
    return this.connection.db.select().from(properties);
  }

  async findById(id: string): Promise<Property | undefined> {
    const [property] = await this.connection.db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
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
