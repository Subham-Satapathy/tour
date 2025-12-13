import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { bookings, vehicles, users, tours } from '@/server/db/schema';
import { eq, desc, count, sum, sql } from 'drizzle-orm';
import { requireAdmin, AuthError } from '@/lib/auth';
import { corsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request.headers.get('origin'));
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    // Total bookings
    const [totalBookingsResult] = await db
      .select({ count: count() })
      .from(bookings);

    // Total revenue
    const [totalRevenueResult] = await db
      .select({ total: sum(bookings.totalAmount) })
      .from(bookings)
      .where(eq(bookings.status, 'PAID'));

    // Total vehicles
    const [totalVehiclesResult] = await db
      .select({ count: count() })
      .from(vehicles)
      .where(eq(vehicles.isActive, true));

    // Total users
    const [totalUsersResult] = await db
      .select({ count: count() })
      .from(users);

    // Active bookings (not cancelled)
    const [activeBookingsResult] = await db
      .select({ count: count() })
      .from(bookings)
      .where(sql`${bookings.status} != 'CANCELLED' AND ${bookings.endDateTime} > NOW()`);

    // Pending bookings
    const [pendingBookingsResult] = await db
      .select({ count: count() })
      .from(bookings)
      .where(eq(bookings.status, 'PENDING'));

    // Total tours
    const [totalToursResult] = await db
      .select({ count: count() })
      .from(tours)
      .where(eq(tours.isActive, true));

    // Recent bookings with vehicle details
    const recentBookings = await db
      .select({
        id: bookings.id,
        vehicleId: bookings.vehicleId,
        vehicleName: vehicles.name,
        fromCityId: bookings.fromCityId,
        toCityId: bookings.toCityId,
        startDateTime: bookings.startDateTime,
        endDateTime: bookings.endDateTime,
        tripDurationHours: bookings.tripDurationHours,
        totalAmount: bookings.totalAmount,
        customerName: bookings.customerName,
        customerEmail: bookings.customerEmail,
        customerPhone: bookings.customerPhone,
        status: bookings.status,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .leftJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
      .orderBy(desc(bookings.createdAt))
      .limit(10);

    const stats = {
      totalBookings: Number(totalBookingsResult.count) || 0,
      totalRevenue: Number(totalRevenueResult.total) || 0,
      totalVehicles: Number(totalVehiclesResult.count) || 0,
      totalUsers: Number(totalUsersResult.count) || 0,
      activeBookings: Number(activeBookingsResult.count) || 0,
      pendingBookings: Number(pendingBookingsResult.count) || 0,
      totalTours: Number(totalToursResult.count) || 0,
      recentBookings,
    };

    return corsResponse(stats, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to fetch stats' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
