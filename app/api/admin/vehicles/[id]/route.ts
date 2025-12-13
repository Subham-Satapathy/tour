import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { vehicles } from '@/server/db/schema';
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

    const [vehicle] = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, parseInt(id)));

    if (!vehicle) {
      return corsResponse({ error: 'Vehicle not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse(vehicle, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to fetch vehicle' },
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

    const [updatedVehicle] = await db
      .update(vehicles)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, parseInt(id)))
      .returning();

    if (!updatedVehicle) {
      return corsResponse({ error: 'Vehicle not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse(updatedVehicle, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to update vehicle' },
      statusCode,
      request.headers.get('origin')
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const [deletedVehicle] = await db
      .delete(vehicles)
      .where(eq(vehicles.id, parseInt(id)))
      .returning();

    if (!deletedVehicle) {
      return corsResponse({ error: 'Vehicle not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse({ success: true }, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to delete vehicle' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
