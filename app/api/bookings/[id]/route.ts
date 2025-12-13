import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/server/db';
import { bookings, vehicles, cities } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const bookingId = parseInt(id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Create alias for toCity
    const toCity = alias(cities, 'to_city');

    // Fetch booking with all joins in a single query
    const [booking] = await db
      .select({
        id: bookings.id,
        vehicleId: bookings.vehicleId,
        fromCityId: bookings.fromCityId,
        toCityId: bookings.toCityId,
        startDateTime: bookings.startDateTime,
        endDateTime: bookings.endDateTime,
        customerName: bookings.customerName,
        customerEmail: bookings.customerEmail,
        customerPhone: bookings.customerPhone,
        tripDurationHours: bookings.tripDurationHours,
        pricePerHour: bookings.pricePerHour,
        pricePerDay: bookings.pricePerDay,
        totalAmount: bookings.totalAmount,
        securityDeposit: bookings.securityDeposit,
        status: bookings.status,
        createdAt: bookings.createdAt,
        vehicle: vehicles,
        fromCity: cities,
        toCity: toCity,
      })
      .from(bookings)
      .leftJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
      .leftJoin(cities, eq(bookings.fromCityId, cities.id))
      .leftJoin(toCity, eq(bookings.toCityId, toCity.id))
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      booking,
    });
  } catch (error) {
    console.error('Booking fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}
