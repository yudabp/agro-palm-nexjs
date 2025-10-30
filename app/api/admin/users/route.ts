import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { user, userRoles, userRoleAssignments } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
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

    // Only Superadmin can view all users
    if (currentRole.role !== 'Superadmin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get all users with their roles
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        roleName: userRoles.name,
        roleDescription: userRoles.description,
      })
      .from(user)
      .leftJoin(
        userRoleAssignments,
        and(
          eq(userRoleAssignments.userId, user.id),
          eq(userRoleAssignments.isActive, true)
        )
      )
      .leftJoin(userRoles, eq(userRoleAssignments.roleId, userRoles.id))
      .orderBy(user.createdAt);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}