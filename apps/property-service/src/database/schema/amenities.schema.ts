import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const amenities = pgTable(
  'amenities',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    name: varchar('name', {
      length: 100,
    }).notNull(),

    slug: varchar('slug', {
      length: 100,
    }).notNull(),

    icon: varchar('icon', {
      length: 100,
    }),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex('amenities_slug_unique_idx').on(table.slug)],
);

export type Amenity = typeof amenities.$inferSelect;

export type NewAmenity = typeof amenities.$inferInsert;
