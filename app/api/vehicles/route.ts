import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { vehicles } from '@/server/db/schema';
import { eq, and, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const fromCityId = searchParams.get('fromCityId');
    const toCityId = searchParams.get('toCityId');
    const fuelType = searchParams.get('fuelType');
    const transmissionType = searchParams.get('transmissionType');
    const search = searchParams.get('search');

    const conditions = [eq(vehicles.isActive, true)];

    if (type && type !== 'ALL') {
      conditions.push(eq(vehicles.type, type as 'CAR' | 'BIKE'));
    }

    if (fromCityId) {
      conditions.push(eq(vehicles.fromCityId, parseInt(fromCityId)));
    }

    if (toCityId) {
      conditions.push(eq(vehicles.toCityId, parseInt(toCityId)));
    }

    if (fuelType) {
      conditions.push(eq(vehicles.fuelType, fuelType as any));
    }

    if (transmissionType) {
      conditions.push(eq(vehicles.transmissionType, transmissionType as any));
    }

    let result;
    if (search) {
      // Search in name and brand
      const searchConditions = [
        ...conditions,
        or(
          like(vehicles.name, `%${search}%`),
          like(vehicles.brand, `%${search}%`)
        )!
      ];
      result = await db.select().from(vehicles).where(and(...searchConditions));
    } else {
      result = await db.select().from(vehicles).where(and(...conditions));
    }

    return NextResponse.json({ vehicles: result });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles', vehicles: [] },
      { status: 500 }
    );
  }
}
