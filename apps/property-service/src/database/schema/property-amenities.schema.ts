import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';

import { properties } from './properties.schema.js';
import { amenities } from './amenities.schema.js';

export const propertyAmenities = pgTable(
  'property_amenities',
  {
    propertyId: uuid('property_id')
      .notNull()
      .references(() => properties.id, {
        onDelete: 'cascade',
      }),

    amenityId: uuid('amenity_id')
      .notNull()
      .references(() => amenities.id, {
        onDelete: 'cascade',
      }),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.propertyId, table.amenityId],
    }),

    index('property_amenities_amenity_id_idx').on(table.amenityId),
  ],
);

export type PropertyAmenity = typeof propertyAmenities.$inferSelect;

export type NewPropertyAmenity = typeof propertyAmenities.$inferInsert;
