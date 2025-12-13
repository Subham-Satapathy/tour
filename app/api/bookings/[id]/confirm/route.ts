import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/server/db';
import { bookings, vehicles, cities } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateInvoice, generateInvoicePDFBuffer } from '@/server/invoice/generateInvoice';
import { sendBookingConfirmationEmail } from '@/server/email/sendBookingConfirmation';

export const dynamic = 'force-dynamic';
export const maxDuration = 30; // Maximum execution time in seconds for Vercel

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

    // IMPORTANT: On Vercel, send email BEFORE returning response
    // Fire-and-forget doesn't work on Vercel because the function terminates after response
    try {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Starting invoice and email process for booking #${bookingId}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      
      // Step 1: Generate invoice number and save to database
      console.log(`[1/3] Generating invoice number...`);
      const invoiceNumber = await generateInvoice(bookingId);
      if (invoiceNumber) {
        console.log(`✅ Invoice number generated: ${invoiceNumber}`);
      } else {
        console.warn(`⚠️ Invoice number generation returned null`);
      }
      
      // Step 2: Skip PDF generation to avoid timeout on Vercel free tier (10s limit)
      console.log(`[2/3] Skipping PDF generation (Vercel timeout prevention)...`);
      const invoicePDF = null; // Skip PDF to avoid timeout
      
      // Step 3: Send email without PDF attachment
      console.log(`[3/3] Sending booking confirmation email...`);
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
        invoicePDF || undefined
      );
      
      console.log(`\n✅ Booking confirmation email sent for booking #${bookingId}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    } catch (emailError) {
      // Log error but don't fail the booking
      console.error(`\n❌ Error sending email for booking #${bookingId}:`, emailError);
      console.error('Stack trace:', emailError instanceof Error ? emailError.stack : 'No stack trace');
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    }

    // Return success response after email is sent
    return NextResponse.json({
      success: true,
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Booking confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm booking' },
      { status: 500 }
    );
  }
}
