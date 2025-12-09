import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone format (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { available: true }, // Don't reveal format requirement in API
        { status: 200 }
      );
    }

    // Check if phone exists
    const existingPhone = await db
      .select()
      .from(users)
      .where(eq(users.phone, cleanPhone))
      .limit(1);

    return NextResponse.json({
      available: existingPhone.length === 0,
    });
  } catch (error) {
    console.error('Error checking phone:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
