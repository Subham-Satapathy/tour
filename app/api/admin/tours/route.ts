import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { tours, cities } from '@/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { requireAdmin, AuthError } from '@/lib/auth';
import { corsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request.headers.get('origin'));
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const toursList = await db
      .select()
      .from(tours)
      .orderBy(desc(tours.createdAt));

    return corsResponse(toursList, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to fetch tours' },
      statusCode,
      request.headers.get('origin')
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    const [newTour] = await db
      .insert(tours)
      .values({
        ...body,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return corsResponse(newTour, 201, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to create tour' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
