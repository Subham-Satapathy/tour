import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { getAllTours } from '@/server/db/queries/tours';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tours = await getAllTours(db);
    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}
