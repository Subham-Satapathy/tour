import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { adminVehicleSchema } from '@/server/validation/schemas';
import { createVehicle } from '@/server/db/queries/vehicles';
import { requireAdmin } from '@/server/auth/checkAuth';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const validatedData = adminVehicleSchema.parse(body);

    const vehicle = await createVehicle(db, validatedData);

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Validation error', details: error },
        { status: 400 }
      );
    }

    console.error('Create vehicle error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
