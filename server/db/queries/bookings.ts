import { eq, and, or, gte, lte, ne, sql } from 'drizzle-orm';
import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { bookings, vehicles, cities, type Booking, type NewBooking } from '../schema';

export interface BookingWithDetails extends Booking {
  vehicle: {
    id: number;
    name: string;
    type: 'CAR' | 'BIKE';
  };
  fromCity: {
    id: number;
    name: string;
  };
  toCity: {
    id: number;
    name: string;
  };
}

/**
 * Get all bookings
 */
export async function getAllBookings(
  db: NeonHttpDatabase<any>
): Promise<Booking[]> {
  return await db.select().from(bookings);
}

/**
 * Get booking by ID
 */
export async function getBookingById(
  db: NeonHttpDatabase<any>,
  id: number
): Promise<Booking | undefined> {
  const result = await db.select().from(bookings).where(eq(bookings.id, id));
  return result[0];
}

/**
 * Get booking with full details
 */
export async function getBookingWithDetails(
  db: NeonHttpDatabase<any>,
  id: number
): Promise<BookingWithDetails | undefined> {
  const result = await db
    .select({
      id: bookings.id,
      vehicleId: bookings.vehicleId,
      fromCityId: bookings.fromCityId,
      toCityId: bookings.toCityId,
      startDateTime: bookings.startDateTime,
      endDateTime: bookings.endDateTime,
      tripDurationHours: bookings.tripDurationHours,
      pricePerHour: bookings.pricePerHour,
      pricePerDay: bookings.pricePerDay,
      totalAmount: bookings.totalAmount,
      customerName: bookings.customerName,
      customerEmail: bookings.customerEmail,
      customerPhone: bookings.customerPhone,
      status: bookings.status,
      paymentReference: bookings.paymentReference,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
      vehicle: {
        id: vehicles.id,
        name: vehicles.name,
        type: vehicles.type,
      },
      fromCity: {
        id: sql<number>`from_city.id`,
        name: sql<string>`from_city.name`,
      },
      toCity: {
        id: sql<number>`to_city.id`,
        name: sql<string>`to_city.name`,
      },
    })
    .from(bookings)
    .innerJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
    .innerJoin(
      sql`${cities} as from_city`,
      sql`${bookings.fromCityId} = from_city.id`
    )
    .innerJoin(
      sql`${cities} as to_city`,
      sql`${bookings.toCityId} = to_city.id`
    )
    .where(eq(bookings.id, id));

  return result[0] as BookingWithDetails | undefined;
}

/**
 * Get all bookings with details (for admin)
 */
export async function getAllBookingsWithDetails(
  db: NeonHttpDatabase<any>
): Promise<BookingWithDetails[]> {
  const result = await db
    .select({
      id: bookings.id,
      vehicleId: bookings.vehicleId,
      fromCityId: bookings.fromCityId,
      toCityId: bookings.toCityId,
      startDateTime: bookings.startDateTime,
      endDateTime: bookings.endDateTime,
      tripDurationHours: bookings.tripDurationHours,
      pricePerHour: bookings.pricePerHour,
      pricePerDay: bookings.pricePerDay,
      totalAmount: bookings.totalAmount,
      customerName: bookings.customerName,
      customerEmail: bookings.customerEmail,
      customerPhone: bookings.customerPhone,
      status: bookings.status,
      paymentReference: bookings.paymentReference,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
      vehicle: {
        id: vehicles.id,
        name: vehicles.name,
        type: vehicles.type,
      },
      fromCity: {
        id: sql<number>`from_city.id`,
        name: sql<string>`from_city.name`,
      },
      toCity: {
        id: sql<number>`to_city.id`,
        name: sql<string>`to_city.name`,
      },
    })
    .from(bookings)
    .innerJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
    .innerJoin(
      sql`${cities} as from_city`,
      sql`${bookings.fromCityId} = from_city.id`
    )
    .innerJoin(
      sql`${cities} as to_city`,
      sql`${bookings.toCityId} = to_city.id`
    )
    .orderBy(sql`${bookings.createdAt} DESC`);

  return result as BookingWithDetails[];
}

/**
 * Get overlapping bookings for a vehicle
 */
export async function getOverlappingBookings(
  db: NeonHttpDatabase<any>,
  vehicleId: number,
  startDateTime: Date,
  endDateTime: Date
): Promise<Booking[]> {
  // NOT (existingEnd <= requestedStart OR existingStart >= requestedEnd)
  return await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.vehicleId, vehicleId),
        ne(bookings.status, 'CANCELLED'),
        sql`NOT (${bookings.endDateTime} <= ${startDateTime} OR ${bookings.startDateTime} >= ${endDateTime})`
      )
    );
}

/**
 * Get all non-cancelled bookings for vehicles in a time range
 */
export async function getBookingsForVehicles(
  db: NeonHttpDatabase<any>,
  vehicleIds: number[],
  startDateTime: Date,
  endDateTime: Date
): Promise<Booking[]> {
  if (vehicleIds.length === 0) return [];

  return await db
    .select()
    .from(bookings)
    .where(
      and(
        sql`${bookings.vehicleId} IN (${sql.join(vehicleIds, sql`, `)})`,
        ne(bookings.status, 'CANCELLED'),
        sql`NOT (${bookings.endDateTime} <= ${startDateTime} OR ${bookings.startDateTime} >= ${endDateTime})`
      )
    );
}

/**
 * Create a new booking
 */
export async function createBooking(
  db: NeonHttpDatabase<any>,
  data: Omit<NewBooking, 'createdAt' | 'updatedAt'>
): Promise<Booking> {
  const result = await db.insert(bookings).values(data).returning();
  return result[0];
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  db: NeonHttpDatabase<any>,
  id: number,
  status: 'PENDING' | 'PAID' | 'CANCELLED',
  paymentReference?: string
): Promise<Booking | undefined> {
  const result = await db
    .update(bookings)
    .set({
      status,
      paymentReference: paymentReference || null,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, id))
    .returning();
  return result[0];
}
