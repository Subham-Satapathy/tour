import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { createBookingSchema } from '@/server/validation/schemas';
import { getVehicleById } from '@/server/db/queries/vehicles';
import { getOverlappingBookings, createBooking, updateBookingStatus } from '@/server/db/queries/bookings';
import { validateBookingDates, createBookingData, simulatePayment, BookingError } from '@/server/domain/booking';
import { sendBookingConfirmationEmail } from '@/server/email/sendBookingConfirmation';
import { getCityById } from '@/server/db/queries/cities';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createBookingSchema.parse(body);

    const {
      vehicleId,
      fromCityId,
      toCityId,
      startDateTime,
      endDateTime,
      customerName,
      customerEmail,
      customerPhone,
    } = validatedData;

    // Convert string dates to Date objects
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    // Validate booking dates
    validateBookingDates(start, end);

    // Get vehicle
    const vehicle = await getVehicleById(db, vehicleId);
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    if (!vehicle.isActive) {
      return NextResponse.json(
        { error: 'Vehicle is not available' },
        { status: 400 }
      );
    }

    // Verify route matches
    if (vehicle.fromCityId !== fromCityId || vehicle.toCityId !== toCityId) {
      return NextResponse.json(
        { error: 'Vehicle does not serve this route' },
        { status: 400 }
      );
    }

    // Check availability
    const overlappingBookings = await getOverlappingBookings(
      db,
      vehicleId,
      start,
      end
    );

    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Vehicle is not available for the selected time range' },
        { status: 409 }
      );
    }

    // Create booking data
    const bookingData = createBookingData(
      {
        vehicleId,
        fromCityId,
        toCityId,
        startDateTime: start,
        endDateTime: end,
        customerName,
        customerEmail,
        customerPhone,
      },
      vehicle,
      'PENDING'
    );

    // Create booking
    const booking = await createBooking(db, bookingData);

    // Simulate payment
    const payment = await simulatePayment(booking.id);

    if (payment.success) {
      // Update booking status to PAID
      await updateBookingStatus(db, booking.id, 'PAID', payment.reference);

      // Get city details for email
      const fromCity = await getCityById(db, fromCityId);
      const toCity = await getCityById(db, toCityId);

      // Send confirmation email
      try {
        await sendBookingConfirmationEmail({
          bookingId: booking.id,
          customerName,
          customerEmail,
          vehicleName: vehicle.name,
          fromCity: fromCity?.name || 'Unknown',
          toCity: toCity?.name || 'Unknown',
          startDateTime: start,
          endDateTime: end,
          totalAmount: booking.totalAmount,
          tripDurationHours: booking.tripDurationHours,
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the booking if email fails
      }

      return NextResponse.json({
        success: true,
        bookingId: booking.id,
        totalAmount: booking.totalAmount,
      });
    } else {
      return NextResponse.json(
        { error: 'Payment failed' },
        { status: 402 }
      );
    }
  } catch (error) {
    console.error('Create booking error:', error);

    if (error instanceof BookingError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

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
