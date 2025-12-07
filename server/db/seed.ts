import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from './index';
import { cities, vehicles, adminUsers } from './schema';
import bcrypt from 'bcryptjs';
import { appConfig } from '@/config/appConfig';

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Seed cities
    console.log('📍 Seeding cities...');
    const cityData = [
      { name: 'Bhubaneswar', slug: 'bhubaneswar' },
      { name: 'Cuttack', slug: 'cuttack' },
      { name: 'Puri', slug: 'puri' },
      { name: 'Konark', slug: 'konark' },
      { name: 'Rourkela', slug: 'rourkela' },
    ];

    const insertedCities = await db.insert(cities).values(cityData).returning();
    console.log(`✅ Created ${insertedCities.length} cities\n`);

    // Create a map for easy lookup
    const cityMap = new Map(insertedCities.map((c) => [c.slug, c.id]));

    // Seed vehicles
    console.log('🚗 Seeding vehicles...');
    const vehicleData = [
      {
        name: 'Toyota Innova Crysta',
        type: 'CAR' as const,
        fromCityId: cityMap.get('bhubaneswar')!,
        toCityId: cityMap.get('puri')!,
        ratePerHour: 500,
        ratePerDay: 5000,
        description: 'Comfortable 7-seater SUV perfect for family trips',
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
        isActive: true,
      },
      {
        name: 'Honda City',
        type: 'CAR' as const,
        fromCityId: cityMap.get('bhubaneswar')!,
        toCityId: cityMap.get('cuttack')!,
        ratePerHour: 300,
        ratePerDay: 3000,
        description: 'Compact sedan ideal for city travel',
        imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400',
        isActive: true,
      },
      {
        name: 'Maruti Swift',
        type: 'CAR' as const,
        fromCityId: cityMap.get('cuttack')!,
        toCityId: cityMap.get('bhubaneswar')!,
        ratePerHour: 250,
        ratePerDay: 2500,
        description: 'Economical hatchback for budget travelers',
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400',
        isActive: true,
      },
      {
        name: 'Royal Enfield Classic 350',
        type: 'BIKE' as const,
        fromCityId: cityMap.get('bhubaneswar')!,
        toCityId: cityMap.get('konark')!,
        ratePerHour: 150,
        ratePerDay: 1200,
        description: 'Classic cruiser bike for an adventurous ride',
        imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400',
        isActive: true,
      },
      {
        name: 'Honda Activa',
        type: 'BIKE' as const,
        fromCityId: cityMap.get('bhubaneswar')!,
        toCityId: cityMap.get('cuttack')!,
        ratePerHour: 80,
        ratePerDay: 600,
        description: 'Easy-to-ride scooter for short trips',
        imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=400',
        isActive: true,
      },
      {
        name: 'Yamaha FZ',
        type: 'BIKE' as const,
        fromCityId: cityMap.get('puri')!,
        toCityId: cityMap.get('konark')!,
        ratePerHour: 120,
        ratePerDay: 1000,
        description: 'Sporty bike for coastal rides',
        imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400',
        isActive: true,
      },
    ];

    const insertedVehicles = await db.insert(vehicles).values(vehicleData).returning();
    console.log(`✅ Created ${insertedVehicles.length} vehicles\n`);

    // Seed admin user
    console.log('👤 Seeding admin user...');
    const passwordHash = await bcrypt.hash(appConfig.admin.defaultPassword, 10);

    const adminData = {
      email: appConfig.admin.defaultEmail,
      passwordHash,
    };

    const insertedAdmin = await db.insert(adminUsers).values(adminData).returning();
    console.log(`✅ Created admin user: ${insertedAdmin[0].email}`);
    console.log(`   Password: ${appConfig.admin.defaultPassword}\n`);

    console.log('✨ Database seeding completed successfully!\n');
    console.log('📝 Summary:');
    console.log(`   - Cities: ${insertedCities.length}`);
    console.log(`   - Vehicles: ${insertedVehicles.length}`);
    console.log(`   - Admin users: ${insertedAdmin.length}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
