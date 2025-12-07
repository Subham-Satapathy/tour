import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { getAllVehicles } from '@/server/db/queries/vehicles';
import { requireAdmin } from '@/server/auth/checkAuth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const vehicles = await getAllVehicles(db);

    return NextResponse.json({ vehicles });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('Get vehicles error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
