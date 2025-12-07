import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { searchVehiclesSchema } from '@/server/validation/schemas';
import { getVehiclesByRoute } from '@/server/db/queries/vehicles';
import { getBookingsForVehicles } from '@/server/db/queries/bookings';
import { filterAvailableVehicles } from '@/server/domain/availability';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = searchVehiclesSchema.parse(body);

    const { fromCityId, toCityId, startDateTime, endDateTime, type } = validatedData;

    // Convert string dates to Date objects
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    // Get vehicles by route
    let vehicles = await getVehiclesByRoute(
      db,
      fromCityId,
      toCityId,
      type && type !== 'BOTH' ? type : undefined
    );

    if (vehicles.length === 0) {
      return NextResponse.json({ vehicles: [] });
    }

    // Get all bookings for these vehicles in the time range
    const vehicleIds = vehicles.map((v) => v.id);
    const bookings = await getBookingsForVehicles(db, vehicleIds, start, end);

    // Create a map of vehicle ID to bookings
    const bookingsByVehicle = new Map<number, { start: Date; end: Date }[]>();
    for (const booking of bookings) {
      const vehicleBookings = bookingsByVehicle.get(booking.vehicleId) || [];
      vehicleBookings.push({
        start: booking.startDateTime,
        end: booking.endDateTime,
      });
      bookingsByVehicle.set(booking.vehicleId, vehicleBookings);
    }

    // Filter available vehicles
    const availableVehicles = filterAvailableVehicles(
      vehicles,
      { start, end },
      bookingsByVehicle
    );

    return NextResponse.json({ vehicles: availableVehicles });
  } catch (error) {
    console.error('Search vehicles error:', error);
    
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
