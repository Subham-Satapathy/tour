import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { getAllBookingsWithDetails } from '@/server/db/queries/bookings';
import { requireAdmin } from '@/server/auth/checkAuth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const bookings = await getAllBookingsWithDetails(db);

    return NextResponse.json({ bookings });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
