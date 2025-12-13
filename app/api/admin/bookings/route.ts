import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdmin, AuthError } from '@/lib/auth';
import { corsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request.headers.get('origin'));
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const bookingsList = status && status !== 'all'
      ? await db
          .select()
          .from(bookings)
          .where(eq(bookings.status, status as any))
          .orderBy(desc(bookings.createdAt))
      : await db
          .select()
          .from(bookings)
          .orderBy(desc(bookings.createdAt));

    return corsResponse(bookingsList, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to fetch bookings' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
