import { pgTable, serial, varchar, text, integer, boolean, timestamp, pgEnum, decimal, index } from 'drizzle-orm/pg-core';

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
}, (table) => ({
  nameIdx: index('cities_name_idx').on(table.name),
  slugIdx: index('cities_slug_idx').on(table.slug),
}));

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
}, (table) => ({
  typeIdx: index('vehicles_type_idx').on(table.type),
  isActiveIdx: index('vehicles_is_active_idx').on(table.isActive),
  isFeaturedIdx: index('vehicles_is_featured_idx').on(table.isFeatured),
  fromCityIdx: index('vehicles_from_city_idx').on(table.fromCityId),
  toCityIdx: index('vehicles_to_city_idx').on(table.toCityId),
  fuelTypeIdx: index('vehicles_fuel_type_idx').on(table.fuelType),
  transmissionIdx: index('vehicles_transmission_idx').on(table.transmissionType),
  brandIdx: index('vehicles_brand_idx').on(table.brand),
  ratePerDayIdx: index('vehicles_rate_per_day_idx').on(table.ratePerDay),
}));

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
  securityDeposit: integer('security_deposit').default(0),
  customerName: varchar('customer_name', { length: 200 }).notNull(),
  customerEmail: varchar('customer_email', { length: 200 }).notNull(),
  customerPhone: varchar('customer_phone', { length: 20 }).notNull(),
  status: bookingStatusEnum('status').notNull().default('PENDING'),
  paymentReference: varchar('payment_reference', { length: 200 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  vehicleIdx: index('bookings_vehicle_idx').on(table.vehicleId),
  statusIdx: index('bookings_status_idx').on(table.status),
  customerEmailIdx: index('bookings_customer_email_idx').on(table.customerEmail),
  startDateTimeIdx: index('bookings_start_date_time_idx').on(table.startDateTime),
  endDateTimeIdx: index('bookings_end_date_time_idx').on(table.endDateTime),
  createdAtIdx: index('bookings_created_at_idx').on(table.createdAt),
}));

// User table (for customers)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 200 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  password: varchar('password', { length: 200 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('customer'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  phoneIdx: index('users_phone_idx').on(table.phone),
  roleIdx: index('users_role_idx').on(table.role),
  isActiveIdx: index('users_is_active_idx').on(table.isActive),
}));

// OTP Verification table
export const otpVerifications = pgTable('otp_verifications', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 200 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('otp_verifications_email_idx').on(table.email),
  expiresAtIdx: index('otp_verifications_expires_at_idx').on(table.expiresAt),
}));

// Invoice table
export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').notNull().references(() => bookings.id).unique(),
  invoiceNumber: varchar('invoice_number', { length: 100 }).notNull().unique(),
  pdfUrl: text('pdf_url'),
  amount: integer('amount').notNull(),
  generatedAt: timestamp('generated_at').notNull().defaultNow(),
}, (table) => ({
  bookingIdIdx: index('invoices_booking_id_idx').on(table.bookingId),
  invoiceNumberIdx: index('invoices_invoice_number_idx').on(table.invoiceNumber),
}));

// Tours table
export const tours = pgTable('tours', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull().unique(),
  description: text('description'),
  fromCityId: integer('from_city_id').notNull().references(() => cities.id),
  toCityId: integer('to_city_id').notNull().references(() => cities.id),
  distanceKm: integer('distance_km').notNull(), // Total distance in kilometers
  durationDays: integer('duration_days').notNull().default(1), // Tour duration in days
  basePrice: integer('base_price').notNull(), // Base price for the tour
  pricePerKm: integer('price_per_km').notNull(), // Additional rate per km
  highlights: text('highlights'), // JSON array of tour highlights
  imageUrl: varchar('image_url', { length: 500 }),
  galleryImages: text('gallery_images'), // JSON array of additional image URLs
  isActive: boolean('is_active').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  totalBookings: integer('total_bookings').notNull().default(0),
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('tours_slug_idx').on(table.slug),
  isActiveIdx: index('tours_is_active_idx').on(table.isActive),
  isFeaturedIdx: index('tours_is_featured_idx').on(table.isFeatured),
  fromCityIdx: index('tours_from_city_idx').on(table.fromCityId),
  toCityIdx: index('tours_to_city_idx').on(table.toCityId),
}));

// Types
export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type OtpVerification = typeof otpVerifications.$inferSelect;
export type NewOtpVerification = typeof otpVerifications.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type Tour = typeof tours.$inferSelect;
export type NewTour = typeof tours.$inferInsert;
