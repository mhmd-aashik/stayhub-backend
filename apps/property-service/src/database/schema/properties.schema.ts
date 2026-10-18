import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';

export const propertyStatusEnum = pgEnum('property_status', [
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED',
]);

export const properties = pgTable(
  'properties',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    hostId: uuid('host_id').notNull(),

    title: varchar('title', {
      length: 200,
    }).notNull(),

    description: text('description'),

    city: varchar('city', {
      length: 100,
    }).notNull(),

    country: varchar('country', {
      length: 100,
    }).notNull(),

    address: text('address'),

    pricePerNight: numeric('price_per_night', {
      precision: 12,
      scale: 2,
    }).notNull(),

    maxGuests: integer('max_guests').notNull(),

    bedrooms: integer('bedrooms').notNull().default(1),

    bathrooms: integer('bathrooms').notNull().default(1),

    status: propertyStatusEnum('status').notNull().default('DRAFT'),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('properties_host_id_idx').on(table.hostId),
    index('properties_city_idx').on(table.city),
    index('properties_status_idx').on(table.status),
  ],
);

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
