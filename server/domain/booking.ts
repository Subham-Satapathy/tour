import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { calculatePrice, calculateTripDuration } from './pricing';
import { isVehicleAvailable } from './availability';
import { appConfig } from '@/config/appConfig';
import { type NewBooking } from '../db/schema';

export class BookingError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'BookingError';
  }
}

export interface CreateBookingParams {
  vehicleId: number;
  fromCityId: number;
  toCityId: number;
  startDateTime: Date;
  endDateTime: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface BookingResult {
  bookingId: number;
  totalAmount: number;
  tripDurationHours: number;
}

/**
 * Validate booking dates
 */
export function validateBookingDates(
  startDateTime: Date,
  endDateTime: Date
): void {
  const now = new Date();
  
  if (startDateTime < now) {
    throw new BookingError('Start date must be in the future', 'INVALID_START_DATE');
  }
  
  if (endDateTime <= startDateTime) {
    throw new BookingError('End date must be after start date', 'INVALID_END_DATE');
  }
}

/**
 * Create booking data object
 */
export function createBookingData(
  params: CreateBookingParams,
  vehicle: { ratePerHour: number; ratePerDay: number },
  status: 'PENDING' | 'PAID' = 'PENDING'
): Omit<NewBooking, 'id' | 'createdAt' | 'updatedAt'> {
  const durationHours = calculateTripDuration(
    params.startDateTime,
    params.endDateTime
  );

  const pricing = calculatePrice({
    durationHours,
    ratePerHour: vehicle.ratePerHour,
    ratePerDay: vehicle.ratePerDay,
    strategy: appConfig.pricingStrategy,
  });

  return {
    vehicleId: params.vehicleId,
    fromCityId: params.fromCityId,
    toCityId: params.toCityId,
    startDateTime: params.startDateTime,
    endDateTime: params.endDateTime,
    tripDurationHours: pricing.durationHours,
    pricePerHour: vehicle.ratePerHour,
    pricePerDay: vehicle.ratePerDay,
    totalAmount: pricing.totalAmount,
    customerName: params.customerName,
    customerEmail: params.customerEmail,
    customerPhone: params.customerPhone,
    status,
    paymentReference: null,
  };
}

/**
 * Simulate payment processing
 */
export async function simulatePayment(bookingId: number): Promise<{
  success: boolean;
  reference: string;
}> {
  // Simulate async payment processing
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // For demo purposes, always succeed
  return {
    success: true,
    reference: `PAY-${Date.now()}-${bookingId}`,
  };
}
