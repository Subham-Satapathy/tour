import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/server/db';
import { bookings, vehicles, cities } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateInvoice, generateInvoicePDFBuffer } from '@/server/invoice/generateInvoice';
import { sendBookingConfirmationEmail } from '@/server/email/sendBookingConfirmation';

export const dynamic = 'force-dynamic';

export async function POST(
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

    const body = await request.json();
    const { paymentMethod, paymentDetails } = body;

    // Update booking status to PAID
    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: 'PAID',
      })
      .where(eq(bookings.id, bookingId))
      .returning();

    if (!updatedBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Fetch vehicle and city details for email
    const [vehicle] = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, updatedBooking.vehicleId))
      .limit(1);

    const [fromCity] = await db
      .select()
      .from(cities)
      .where(eq(cities.id, updatedBooking.fromCityId))
      .limit(1);

    const [toCity] = await db
      .select()
      .from(cities)
      .where(eq(cities.id, updatedBooking.toCityId))
      .limit(1);

    // Return success immediately to user, then send email asynchronously
    const response = NextResponse.json({
      success: true,
      booking: updatedBooking,
    });

    // Send email asynchronously (fire-and-forget) - don't await
    // This prevents blocking the response to the user
    Promise.resolve().then(async () => {
      try {
        const invoiceNumber = await generateInvoice(bookingId);
        const invoicePDF = await generateInvoicePDFBuffer(bookingId);
        
        await sendBookingConfirmationEmail(
          {
            bookingId: bookingId,
            customerName: updatedBooking.customerName,
            customerEmail: updatedBooking.customerEmail,
            vehicleName: vehicle.name,
            vehicleBrand: vehicle.brand || undefined,
            vehicleModel: vehicle.model || undefined,
            seatingCapacity: vehicle.seatingCapacity || undefined,
            fuelType: vehicle.fuelType || undefined,
            transmissionType: vehicle.transmissionType || undefined,
            fromCity: fromCity.name,
            toCity: toCity.name,
            startDateTime: new Date(updatedBooking.startDateTime),
            endDateTime: new Date(updatedBooking.endDateTime),
            totalAmount: updatedBooking.totalAmount,
            securityDeposit: updatedBooking.securityDeposit || undefined,
            tripDurationHours: updatedBooking.tripDurationHours,
            pricePerHour: updatedBooking.pricePerHour || undefined,
            pricePerDay: updatedBooking.pricePerDay || undefined,
            invoiceNumber: invoiceNumber || undefined,
          },
          invoicePDF || undefined
        );
        
        console.log(`Booking confirmation email sent with invoice for booking #${bookingId}`);
      } catch (emailError) {
        console.error('Error sending booking confirmation email:', emailError);
      }
    });

    return response;
  } catch (error) {
    console.error('Booking confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm booking' },
      { status: 500 }
    );
  }
}
