import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { eq, and, or, lte, gte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      vehicleId,
      fromCityId,
      toCityId,
      startDateTime,
      endDateTime,
      customerName,
      customerEmail,
      customerPhone,
      tripDurationHours,
      pricePerHour,
      pricePerDay,
      totalAmount,
      securityDeposit,
    } = body;

    // Validate required fields
    if (!vehicleId || !fromCityId || !toCityId || !startDateTime || !endDateTime || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const now = new Date();

    if (start >= end) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    if (start < now) {
      return NextResponse.json(
        { error: 'Start date must be in the future' },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.vehicleId, vehicleId),
          eq(bookings.status, 'PAID'),
          or(
            and(
              lte(bookings.startDateTime, new Date(startDateTime)),
              gte(bookings.endDateTime, new Date(startDateTime))
            ),
            and(
              lte(bookings.startDateTime, new Date(endDateTime)),
              gte(bookings.endDateTime, new Date(endDateTime))
            ),
            and(
              gte(bookings.startDateTime, new Date(startDateTime)),
              lte(bookings.endDateTime, new Date(endDateTime))
            )
          )
        )
      );

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Vehicle is not available for the selected dates' },
        { status: 409 }
      );
    }

    // Create booking
    const [newBooking] = await db
      .insert(bookings)
      .values({
        vehicleId,
        fromCityId,
        toCityId,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        customerName,
        customerEmail,
        customerPhone,
        tripDurationHours,
        pricePerHour,
        pricePerDay,
        totalAmount,
        securityDeposit: securityDeposit || 0,
        status: 'PENDING',
      })
      .returning();

    return NextResponse.json(
      { 
        success: true,
        booking: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
