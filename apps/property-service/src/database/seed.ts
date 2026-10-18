import 'dotenv/config';

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { properties, type NewProperty } from './schema/properties.schema.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const client = postgres(databaseUrl, { max: 1 });
const db = drizzle({ client });

const hostIds = [
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222222',
  '33333333-3333-4333-8333-333333333333',
];

const locations = [
  { city: 'Dubai', count: 12 },
  { city: 'Abu Dhabi', count: 7 },
  { city: 'Sharjah', count: 5 },
  { city: 'Ajman', count: 3 },
  { city: 'Ras Al Khaimah', count: 3 },
];

const propertyTypes = [
  'Luxury Apartment',
  'Beachfront Villa',
  'Modern Studio',
  'Family Townhouse',
  'City Penthouse',
  'Cozy Apartment',
];

const seedProperties: NewProperty[] = [];

let propertyNumber = 0;

for (const location of locations) {
  for (let i = 0; i < location.count; i++) {
    propertyNumber++;

    const status =
      propertyNumber <= 24
        ? 'PUBLISHED'
        : propertyNumber <= 28
          ? 'DRAFT'
          : 'ARCHIVED';

    const type = propertyTypes[(propertyNumber - 1) % propertyTypes.length]!;

    seedProperties.push({
      hostId: hostIds[(propertyNumber - 1) % hostIds.length]!,
      title: `${type} ${propertyNumber}`,
      description:
        `Comfortable ${type.toLowerCase()} in ${location.city}, ` +
        'ideal for short stays and holidays.',
      city: location.city,
      country: 'United Arab Emirates',
      pricePerNight: (150 + propertyNumber * 35).toFixed(2),
      maxGuests: 1 + (propertyNumber % 8),
      bedrooms: 1 + (propertyNumber % 4),
      bathrooms: 1 + (propertyNumber % 3),
      status,
    });
  }
}

async function seed() {
  try {
    console.log('Starting StayHub property seed...');

    const existing = await db
      .select({ title: properties.title })
      .from(properties);

    const existingTitles = new Set(existing.map((property) => property.title));

    const newProperties = seedProperties.filter(
      (property) => !existingTitles.has(property.title),
    );

    if (newProperties.length === 0) {
      console.log('Seed properties already exist. Nothing to insert.');
      return;
    }

    const inserted = await db
      .insert(properties)
      .values(newProperties)
      .returning({
        id: properties.id,
        title: properties.title,
        city: properties.city,
        status: properties.status,
      });

    console.table(inserted);

    console.log(`Inserted ${inserted.length} properties.`);
  } finally {
    await client.end();
  }
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exitCode = 1;
});
