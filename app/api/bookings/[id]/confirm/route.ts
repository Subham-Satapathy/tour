import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateInvoice } from '@/server/invoice/generateInvoice';
import { sendInvoiceEmail } from '@/server/email/sendInvoice';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    
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

    // Generate invoice after successful payment
    try {
      const invoiceNumber = await generateInvoice(bookingId);
      
      if (invoiceNumber) {
        // Send invoice email to customer
        await sendInvoiceEmail({
          email: updatedBooking.customerEmail,
          customerName: updatedBooking.customerName,
          bookingId: bookingId,
          invoiceNumber: invoiceNumber,
          totalAmount: updatedBooking.totalAmount,
        });
        
        console.log(`Invoice ${invoiceNumber} generated and sent for booking #${bookingId}`);
      } else {
        console.error(`Failed to generate invoice for booking #${bookingId}`);
      }
    } catch (invoiceError) {
      // Log error but don't fail the booking confirmation
      console.error('Error generating/sending invoice:', invoiceError);
    }

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
