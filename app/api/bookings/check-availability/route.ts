import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { eq, and, or, lte, gte } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleId, startDateTime, endDateTime } = body;

    // Validate required fields
    if (!vehicleId || !startDateTime || !endDateTime) {
      return NextResponse.json(
        { error: 'Missing required fields', available: false },
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

    const available = overlappingBookings.length === 0;

    return NextResponse.json({ available });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Internal server error', available: false },
      { status: 500 }
    );
  }
}
