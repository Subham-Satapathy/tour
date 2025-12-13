import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { cities } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin, AuthError } from '@/lib/auth';
import { corsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request.headers.get('origin'));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const body = await request.json();

    const [updatedCity] = await db
      .update(cities)
      .set({
        name: body.name,
        slug: body.slug,
      })
      .where(eq(cities.id, parseInt(id)))
      .returning();

    if (!updatedCity) {
      return corsResponse({ error: 'City not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse(updatedCity, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to update city' },
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

    const [deletedCity] = await db
      .delete(cities)
      .where(eq(cities.id, parseInt(id)))
      .returning();

    if (!deletedCity) {
      return corsResponse({ error: 'City not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse({ success: true }, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to delete city' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
