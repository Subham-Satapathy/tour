import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
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

    const [user] = await db
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
      .where(eq(users.id, parseInt(id)));

    if (!user) {
      return corsResponse({ error: 'User not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse(user, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to fetch user' },
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

    const [updatedUser] = await db
      .update(users)
      .set({
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, parseInt(id)))
      .returning();

    if (!updatedUser) {
      return corsResponse({ error: 'User not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse(updatedUser, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to update user' },
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

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, parseInt(id)))
      .returning();

    if (!deletedUser) {
      return corsResponse({ error: 'User not found' }, 404, request.headers.get('origin'));
    }

    return corsResponse({ success: true }, 200, request.headers.get('origin'));
  } catch (error: any) {
    const statusCode = error instanceof AuthError ? error.statusCode : 500;
    return corsResponse(
      { error: error.message || 'Failed to delete user' },
      statusCode,
      request.headers.get('origin')
    );
  }
}
