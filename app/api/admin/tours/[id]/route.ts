import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { tours } from '@/server/db/schema';
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

    const [tour] = await db
      .select()
      .from(tours)
      .where(eq(tours.id, parseInt(id)));

    if (!tour) {
      return corsResponse({ error: 'Tour not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse(tour, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to fetch tour' },
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

    const [updatedTour] = await db
      .update(tours)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(tours.id, parseInt(id)))
      .returning();

    if (!updatedTour) {
      return corsResponse({ error: 'Tour not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse(updatedTour, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to update tour' },
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

    const [deletedTour] = await db
      .delete(tours)
      .where(eq(tours.id, parseInt(id)))
      .returning();

    if (!deletedTour) {
      return corsResponse({ error: 'Tour not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse({ success: true }, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to delete tour' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
