import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { desc, ne } from 'drizzle-orm';
import { requireAdmin, AuthError } from '@/lib/auth';
import { corsResponse, handleOptions } from '@/lib/cors';

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request.headers.get('origin'));
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const usersList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(ne(users.role, 'admin'))
      .orderBy(desc(users.createdAt));

    return corsResponse(usersList, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to fetch users' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
