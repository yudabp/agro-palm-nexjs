import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userRoles, userRoleAssignments } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user's active role assignment
    const [roleAssignment] = await db
      .select({
        roleName: userRoles.name,
        permissions: userRoles.permissions,
      })
      .from(userRoleAssignments)
      .innerJoin(userRoles, eq(userRoleAssignments.roleId, userRoles.id))
      .where(
        and(
          eq(userRoleAssignments.userId, session.user.id),
          eq(userRoleAssignments.isActive, true)
        )
      )
      .limit(1);

    if (!roleAssignment) {
      return NextResponse.json(
        { error: 'No role assigned to user' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      role: roleAssignment.roleName,
      permissions: roleAssignment.permissions,
    });
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user role' },
      { status: 500 }
    );
  }
}