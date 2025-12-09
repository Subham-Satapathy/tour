import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { generateInvoice } from '@/server/invoice/generateInvoice';
import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const bookingId = parseInt(params.id);

    if (isNaN(bookingId)) {
      return NextResponse.json(
        { error: 'Invalid booking ID' },
        { status: 400 }
      );
    }

    // Fetch booking to verify it belongs to the user
    const booking = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (booking.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if booking belongs to logged-in user
    if (booking[0].customerEmail !== session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized access to this booking' },
        { status: 403 }
      );
    }

    // Only allow invoice generation for PAID bookings
    if (booking[0].status !== 'PAID') {
      return NextResponse.json(
        { error: 'Invoice can only be generated for paid bookings' },
        { status: 400 }
      );
    }

    // Generate invoice
    const invoiceNumber = await generateInvoice(bookingId);

    if (!invoiceNumber) {
      return NextResponse.json(
        { error: 'Failed to generate invoice' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invoiceNumber,
      bookingId,
    });
  } catch (error) {
    console.error('Error in invoice generation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
