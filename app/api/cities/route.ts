import { NextResponse } from 'next/server';
import { db } from '@/server/db';
import { getAllCities } from '@/server/db/queries/cities';

export async function GET() {
  try {
    const cities = await getAllCities(db);
    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Get cities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
