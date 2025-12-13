import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { vehicles, cities } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdmin, AuthError } from '@/lib/auth';
import { corsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request.headers.get('origin'));
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const vehiclesList = await db
      .select({
        id: vehicles.id,
        name: vehicles.name,
        type: vehicles.type,
        brand: vehicles.brand,
        model: vehicles.model,
        year: vehicles.year,
        color: vehicles.color,
        licensePlate: vehicles.licensePlate,
        seatingCapacity: vehicles.seatingCapacity,
        mileage: vehicles.mileage,
        fuelType: vehicles.fuelType,
        transmissionType: vehicles.transmissionType,
        features: vehicles.features,
        fromCityId: vehicles.fromCityId,
        toCityId: vehicles.toCityId,
        ratePerHour: vehicles.ratePerHour,
        ratePerDay: vehicles.ratePerDay,
        extraKmCharge: vehicles.extraKmCharge,
        includedKmPerDay: vehicles.includedKmPerDay,
        securityDeposit: vehicles.securityDeposit,
        description: vehicles.description,
        imageUrl: vehicles.imageUrl,
        galleryImages: vehicles.galleryImages,
        isActive: vehicles.isActive,
        isFeatured: vehicles.isFeatured,
        totalBookings: vehicles.totalBookings,
        averageRating: vehicles.averageRating,
        createdAt: vehicles.createdAt,
        updatedAt: vehicles.updatedAt,
        fromCity: cities,
        toCity: cities,
      })
      .from(vehicles)
      .leftJoin(cities, eq(vehicles.fromCityId, cities.id))
      .orderBy(desc(vehicles.createdAt));

    return corsResponse(vehiclesList, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to fetch vehicles' },
      statusCode,
      request.headers.get('origin')
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    const [newVehicle] = await db
      .insert(vehicles)
      .values({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return corsResponse(newVehicle, 201, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to create vehicle' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
