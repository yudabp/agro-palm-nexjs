import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();

  // Clear all auth cookies
  cookieStore.delete('session-token');
  cookieStore.delete('user-id');

  return NextResponse.json({ success: true });
}