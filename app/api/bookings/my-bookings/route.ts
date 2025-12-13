import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/server/db';
import { bookings, vehicles, cities } from '@/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create alias for toCity to avoid conflicts
    const toCity = alias(cities, 'to_city');

    // Fetch all bookings with joins in a single query
    const userBookings = await db
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
        vehicle: {
          id: vehicles.id,
          name: vehicles.name,
          type: vehicles.type,
          imageUrl: vehicles.imageUrl,
        },
        fromCity: {
          id: cities.id,
          name: cities.name,
        },
        toCity: {
          id: toCity.id,
          name: toCity.name,
        },
      })
      .from(bookings)
      .leftJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
      .leftJoin(cities, eq(bookings.fromCityId, cities.id))
      .leftJoin(toCity, eq(bookings.toCityId, toCity.id))
      .where(eq(bookings.customerEmail, session.user.email))
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json({
      bookings: userBookings,
    });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
