import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/db';
import { user } from '@/db/schema/auth';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token')?.value;
    const userId = cookieStore.get('user-id')?.value;

    if (!sessionToken || !userId) {
      return NextResponse.json(
        { user: null, authenticated: false },
        { status: 200 }
      );
    }

    // Get user from database
    const [foundUser] = await db.select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!foundUser) {
      return NextResponse.json(
        { user: null, authenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        emailVerified: foundUser.emailVerified,
      },
      authenticated: true,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { user: null, authenticated: false },
      { status: 500 }
    );
  }
}