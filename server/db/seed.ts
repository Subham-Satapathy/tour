import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { db } from './index';
import { cities, vehicles, adminUsers } from './schema';
import bcrypt from 'bcryptjs';
import { appConfig } from '@/config/appConfig';
import { sql } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await db.delete(vehicles);
    await db.delete(cities);
    await db.delete(adminUsers);
    console.log('✅ Cleared existing data\n');

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
        brand: 'Toyota',
        model: 'Innova Crysta',
        year: 2023,
        color: 'Silver',
        licensePlate: 'OD-02-AB-1234',
        seatingCapacity: 7,
        mileage: '12 km/l',
        fuelType: 'DIESEL' as const,
        transmissionType: 'AUTOMATIC' as const,
        features: 'AC, GPS Navigation, Bluetooth, USB Charger, Push Start, Cruise Control',
        fromCityId: cityMap.get('bhubaneswar')!,
        toCityId: cityMap.get('puri')!,
        ratePerHour: 500,
        ratePerDay: 5000,
        extraKmCharge: 12,
        includedKmPerDay: 250,
        securityDeposit: 5000,
        description: 'Comfortable 7-seater SUV perfect for family trips with spacious interiors and modern amenities',
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        galleryImages: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800,https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        isActive: true,
        isFeatured: true,
        totalBookings: 0,
        averageRating: null,
      },
      {
        name: 'Honda City',
        type: 'CAR' as const,
        brand: 'Honda',
        model: 'City',
        year: 2024,
        color: 'White',
        licensePlate: 'OD-02-CD-5678',
        seatingCapacity: 5,
        mileage: '18 km/l',
        fuelType: 'PETROL' as const,
        transmissionType: 'AUTOMATIC' as const,
        features: 'AC, Bluetooth, USB Charger, Sunroof, Rear Camera',
        fromCityId: cityMap.get('bhubaneswar')!,
        toCityId: cityMap.get('cuttack')!,
        ratePerHour: 300,
        ratePerDay: 3000,
        extraKmCharge: 10,
        includedKmPerDay: 200,
        securityDeposit: 3000,
        description: 'Compact sedan ideal for city travel with excellent fuel efficiency',
        imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
        galleryImages: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800',
        isActive: true,
        isFeatured: true,
        totalBookings: 0,
        averageRating: null,
      },
      {
        name: 'Maruti Swift',
        type: 'CAR' as const,
        brand: 'Maruti Suzuki',
        model: 'Swift',
        year: 2023,
        color: 'Red',
        licensePlate: 'OD-05-EF-9012',
        seatingCapacity: 5,
        mileage: '22 km/l',
        fuelType: 'PETROL' as const,
        transmissionType: 'MANUAL' as const,
        features: 'AC, Bluetooth, USB Charger, Power Windows',
        fromCityId: cityMap.get('cuttack')!,
        toCityId: cityMap.get('bhubaneswar')!,
        ratePerHour: 250,
        ratePerDay: 2500,
        extraKmCharge: 8,
        includedKmPerDay: 200,
        securityDeposit: 2000,
        description: 'Economical hatchback for budget travelers with great mileage',
        imageUrl: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
        galleryImages: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
        isActive: true,
        isFeatured: false,
        totalBookings: 0,
        averageRating: null,
      },
      {
        name: 'BMW i4',
        type: 'CAR' as const,
        brand: 'BMW',
        model: 'i4',
        year: 2024,
        color: 'Blue',
        licensePlate: 'OD-02-XY-7890',
        seatingCapacity: 5,
        mileage: '520 km range',
        fuelType: 'ELECTRIC' as const,
        transmissionType: 'AUTOMATIC' as const,
        features: 'Premium Sound System, Wireless Charging, Autopilot, Leather Seats, Panoramic Roof',
        fromCityId: cityMap.get('bhubaneswar')!,
        toCityId: cityMap.get('puri')!,
        ratePerHour: 800,
        ratePerDay: 8000,
        extraKmCharge: 15,
        includedKmPerDay: 300,
        securityDeposit: 20000,
        description: 'Luxury electric sedan with cutting-edge technology and premium comfort',
        imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
        galleryImages: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
        isActive: true,
        isFeatured: true,
        totalBookings: 0,
        averageRating: null,
      },
      {
        name: 'Royal Enfield Classic 350',
        type: 'BIKE' as const,
        brand: 'Royal Enfield',
        model: 'Classic 350',
        year: 2024,
        color: 'Black',
        licensePlate: 'OD-02-GH-3456',
        seatingCapacity: 2,
        mileage: '35 km/l',
        fuelType: 'PETROL' as const,
        transmissionType: 'MANUAL' as const,
        features: 'Digital Speedometer, LED Lights, USB Charger',
        fromCityId: cityMap.get('bhubaneswar')!,
        toCityId: cityMap.get('konark')!,
        ratePerHour: 150,
        ratePerDay: 1200,
        extraKmCharge: 5,
        includedKmPerDay: 150,
        securityDeposit: 2000,
        description: 'Classic cruiser bike for an adventurous ride along coastal roads',
        imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
        galleryImages: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
        isActive: true,
        isFeatured: true,
        totalBookings: 0,
        averageRating: null,
      },
      {
        name: 'Honda Activa 6G',
        type: 'BIKE' as const,
        brand: 'Honda',
        model: 'Activa 6G',
        year: 2023,
        color: 'Grey',
        licensePlate: 'OD-02-IJ-6789',
        seatingCapacity: 2,
        mileage: '45 km/l',
        fuelType: 'PETROL' as const,
        transmissionType: 'AUTOMATIC' as const,
        features: 'USB Charger, LED Lights, External Fuel Filler',
        fromCityId: cityMap.get('bhubaneswar')!,
        toCityId: cityMap.get('cuttack')!,
        ratePerHour: 80,
        ratePerDay: 600,
        extraKmCharge: 3,
        includedKmPerDay: 100,
        securityDeposit: 1000,
        description: 'Easy-to-ride scooter for short trips with excellent fuel efficiency',
        imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
        galleryImages: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
        isActive: true,
        isFeatured: false,
        totalBookings: 0,
        averageRating: null,
      },
      {
        name: 'Yamaha FZ-S',
        type: 'BIKE' as const,
        brand: 'Yamaha',
        model: 'FZ-S',
        year: 2024,
        color: 'Blue',
        licensePlate: 'OD-08-KL-2345',
        seatingCapacity: 2,
        mileage: '40 km/l',
        fuelType: 'PETROL' as const,
        transmissionType: 'MANUAL' as const,
        features: 'Digital Console, LED Lights, ABS, USB Charger',
        fromCityId: cityMap.get('puri')!,
        toCityId: cityMap.get('konark')!,
        ratePerHour: 120,
        ratePerDay: 1000,
        extraKmCharge: 4,
        includedKmPerDay: 150,
        securityDeposit: 1500,
        description: 'Sporty bike for coastal rides with powerful engine and modern styling',
        imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
        galleryImages: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
        isActive: true,
        isFeatured: true,
        totalBookings: 0,
        averageRating: null,
      },
      {
        name: 'Ducati Panigale V4',
        type: 'BIKE' as const,
        brand: 'Ducati',
        model: 'Panigale V4',
        year: 2024,
        color: 'Red',
        licensePlate: 'OD-02-MN-8901',
        seatingCapacity: 2,
        mileage: '18 km/l',
        fuelType: 'PETROL' as const,
        transmissionType: 'MANUAL' as const,
        features: 'TFT Display, Racing ABS, Traction Control, Quick Shifter',
        fromCityId: cityMap.get('bhubaneswar')!,
        toCityId: cityMap.get('puri')!,
        ratePerHour: 500,
        ratePerDay: 4500,
        extraKmCharge: 20,
        includedKmPerDay: 100,
        securityDeposit: 50000,
        description: 'Premium superbike for thrill seekers with race-track performance',
        imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
        galleryImages: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800',
        isActive: true,
        isFeatured: true,
        totalBookings: 0,
        averageRating: null,
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
