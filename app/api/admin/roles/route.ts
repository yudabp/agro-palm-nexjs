import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userRoles } from '@/db/schema';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get the current session from cookies
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token')?.value;
    const userId = cookieStore.get('user-id')?.value;

    if (!sessionToken || !userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if current user is Superadmin
    const currentRoleResponse = await fetch(`${request.nextUrl.origin}/api/user/role`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!currentRoleResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to verify permissions' },
        { status: 500 }
      );
    }

    const currentRole = await currentRoleResponse.json();

    // Only Superadmin can view roles
    if (currentRole.role !== 'Superadmin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get all roles
    const roles = await db.select().from(userRoles).orderBy(userRoles.name);

    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roles' },
      { status: 500 }
    );
  }
}