import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';

import { properties } from './properties.schema.js';

export const propertyImages = pgTable(
  'property_images',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    propertyId: uuid('property_id')
      .notNull()
      .references(() => properties.id, {
        onDelete: 'cascade',
      }),

    imageUrl: text('image_url').notNull(),

    altText: text('alt_text'),

    sortOrder: integer('sort_order').notNull().default(0),

    isCover: boolean('is_cover').notNull().default(false),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('property_images_property_id_idx').on(table.propertyId)],
);

export type PropertyImage = typeof propertyImages.$inferSelect;

export type NewPropertyImage = typeof propertyImages.$inferInsert;
