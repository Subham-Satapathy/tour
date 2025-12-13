import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { cities } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin, AuthError } from '@/lib/auth';
import { corsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request.headers.get('origin'));
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const citiesList = await db.select().from(cities);

    return corsResponse(citiesList, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to fetch cities' },
      statusCode,
      request.headers.get('origin')
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();

    const [newCity] = await db
      .insert(cities)
      .values({
        name: body.name,
        slug: body.slug,
      })
      .returning();

    return corsResponse(newCity, 201, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to create city' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
