import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/server/db';
import { getAdminByEmail } from '@/server/db/queries/users';

class AuthError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function requireAdmin() {
  const headersList = await headers();
  const adminEmail = headersList.get('x-admin-email');
  const adminRole = headersList.get('x-admin-role');

  if (!adminEmail || !adminRole) {
    throw new AuthError('Unauthorized: No admin credentials found', 401);
  }

  // Verify the user exists in the database and has admin role
  const user = await getAdminByEmail(db, adminEmail);

  if (!user) {
    throw new AuthError('Forbidden: Admin access required', 403);
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new AuthError('Unauthorized: Authentication required', 401);
  }

  return session;
}

export { AuthError };
