import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

class AuthError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new AuthError('Unauthorized: No session found', 401);
  }

  if (session.user.role !== 'admin') {
    throw new AuthError('Forbidden: Admin access required', 403);
  }

  return session;
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
