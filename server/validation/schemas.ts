import { z } from 'zod';

// Search vehicles schema
export const searchVehiclesSchema = z.object({
  fromCityId: z.number().int().positive(),
  toCityId: z.number().int().positive(),
  startDateTime: z.string().min(1),
  endDateTime: z.string().min(1),
  type: z.enum(['CAR', 'BIKE', 'BOTH']).optional(),
}).refine(
  (data) => new Date(data.startDateTime) < new Date(data.endDateTime),
  { message: 'Start date must be before end date' }
);

export type SearchVehiclesInput = z.infer<typeof searchVehiclesSchema>;

// Create booking schema
export const createBookingSchema = z.object({
  vehicleId: z.number().int().positive(),
  fromCityId: z.number().int().positive(),
  toCityId: z.number().int().positive(),
  startDateTime: z.string().min(1),
  endDateTime: z.string().min(1),
  customerName: z.string().min(2).max(200),
  customerEmail: z.string().email().max(200),
  customerPhone: z.string().min(10).max(20),
}).refine(
  (data) => new Date(data.startDateTime) < new Date(data.endDateTime),
  { message: 'Start date must be before end date' }
);

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// Admin vehicle schema
export const adminVehicleSchema = z.object({
  name: z.string().min(2).max(200),
  type: z.enum(['CAR', 'BIKE']),
  brand: z.string().max(100).optional(),
  model: z.string().max(100).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  color: z.string().max(50).optional(),
  licensePlate: z.string().max(50).optional(),
  seatingCapacity: z.number().int().min(1).max(50).optional(),
  mileage: z.string().max(50).optional(),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID', 'CNG']).optional(),
  transmissionType: z.enum(['MANUAL', 'AUTOMATIC']).optional(),
  features: z.string().optional(), // JSON string
  fromCityId: z.number().int().positive(),
  toCityId: z.number().int().positive(),
  ratePerHour: z.number().int().positive(),
  ratePerDay: z.number().int().positive(),
  extraKmCharge: z.number().int().min(0).optional(),
  includedKmPerDay: z.number().int().min(0).optional(),
  securityDeposit: z.number().int().min(0).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  galleryImages: z.string().optional(), // JSON string
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
});

export type AdminVehicleInput = z.infer<typeof adminVehicleSchema>;

// Admin login schema
export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// Update booking status schema
export const updateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']),
});

export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
