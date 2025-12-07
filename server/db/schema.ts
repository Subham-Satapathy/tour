import { pgTable, serial, varchar, text, integer, boolean, timestamp, pgEnum, decimal } from 'drizzle-orm/pg-core';

// Enums
export const vehicleTypeEnum = pgEnum('vehicle_type', ['CAR', 'BIKE']);
export const fuelTypeEnum = pgEnum('fuel_type', ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG']);
export const transmissionTypeEnum = pgEnum('transmission_type', ['MANUAL', 'AUTOMATIC']);
export const bookingStatusEnum = pgEnum('booking_status', ['PENDING', 'PAID', 'CANCELLED']);

// City table
export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});

// Vehicle table
export const vehicles = pgTable('vehicles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  type: vehicleTypeEnum('type').notNull(),
  brand: varchar('brand', { length: 100 }),
  model: varchar('model', { length: 100 }),
  year: integer('year'),
  color: varchar('color', { length: 50 }),
  licensePlate: varchar('license_plate', { length: 50 }),
  seatingCapacity: integer('seating_capacity'),
  mileage: varchar('mileage', { length: 50 }), // e.g., "15 km/l" or "25,000 km"
  fuelType: fuelTypeEnum('fuel_type'),
  transmissionType: transmissionTypeEnum('transmission_type'),
  features: text('features'), // JSON string of features like AC, GPS, Bluetooth, etc.
  fromCityId: integer('from_city_id').notNull().references(() => cities.id),
  toCityId: integer('to_city_id').notNull().references(() => cities.id),
  ratePerHour: integer('rate_per_hour').notNull(),
  ratePerDay: integer('rate_per_day').notNull(),
  extraKmCharge: integer('extra_km_charge'), // Charge per km beyond included limit
  includedKmPerDay: integer('included_km_per_day'), // Free km included per day
  securityDeposit: integer('security_deposit'),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  galleryImages: text('gallery_images'), // JSON array of additional image URLs
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  totalBookings: integer('total_bookings').notNull().default(0),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Booking table
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id),
  fromCityId: integer('from_city_id').notNull().references(() => cities.id),
  toCityId: integer('to_city_id').notNull().references(() => cities.id),
  startDateTime: timestamp('start_date_time').notNull(),
  endDateTime: timestamp('end_date_time').notNull(),
  tripDurationHours: integer('trip_duration_hours').notNull(),
  pricePerHour: integer('price_per_hour').notNull(),
  pricePerDay: integer('price_per_day').notNull(),
  totalAmount: integer('total_amount').notNull(),
  customerName: varchar('customer_name', { length: 200 }).notNull(),
  customerEmail: varchar('customer_email', { length: 200 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
  status: bookingStatusEnum('status').notNull().default('PENDING'),
  paymentReference: varchar('payment_reference', { length: 200 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// AdminUser table
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 200 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 200 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Types
export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
