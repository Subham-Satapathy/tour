import { NextResponse } from 'next/server';

const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  process.env.NEXT_PUBLIC_ADMIN_URL,
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean);

export function corsHeaders(origin?: string | null) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Email, X-Admin-Role',
    'Access-Control-Max-Age': '86400',
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else if (!origin || allowedOrigins.length === 0) {
    // Development fallback
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return headers;
}

export function corsResponse(data: any, status: number = 200, origin?: string | null) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders(origin),
  });
}

export function handleOptions(origin?: string | null) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}
