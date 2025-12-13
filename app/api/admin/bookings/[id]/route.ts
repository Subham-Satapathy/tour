import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin, AuthError } from '@/lib/auth';
import { corsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request.headers.get('origin'));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [booking] = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, parseInt(id)));

    if (!booking) {
      return corsResponse({ error: 'Booking not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse(booking, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to fetch booking' },
      statusCode,
      request.headers.get('origin')
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();

    const [updatedBooking] = await db
      .update(bookings)
      .set({
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(bookings.id, parseInt(id)))
      .returning();

    if (!updatedBooking) {
      return corsResponse({ error: 'Booking not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse(updatedBooking, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to update booking' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
