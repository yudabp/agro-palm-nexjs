import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userRoleAssignments, userRoles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Get current session
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

    // Only Superadmin can assign roles
    if (currentRole.role !== 'Superadmin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { roleId } = await request.json();

    if (!roleId) {
      return NextResponse.json(
        { error: 'Role ID is required' },
        { status: 400 }
      );
    }

    // Verify role exists
    const [role] = await db
      .select()
      .from(userRoles)
      .where(eq(userRoles.id, roleId))
      .limit(1);

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      );
    }

    // Deactivate existing role assignments for this user
    await db
      .update(userRoleAssignments)
      .set({ isActive: false })
      .where(eq(userRoleAssignments.userId, params.userId));

    // Create new role assignment
    const [newAssignment] = await db
      .insert(userRoleAssignments)
      .values({
        userId: params.userId,
        roleId: roleId,
        assignedBy: session.user.id,
        isActive: true,
        assignedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      message: 'Role assigned successfully',
      assignment: newAssignment,
      roleName: role.name,
    });
  } catch (error) {
    console.error('Error assigning role:', error);
    return NextResponse.json(
      { error: 'Failed to assign role' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
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

    // Get user's current role assignment
    const [assignment] = await db
      .select({
        roleName: userRoles.name,
        roleDescription: userRoles.description,
        permissions: userRoles.permissions,
        assignedAt: userRoleAssignments.assignedAt,
        assignedBy: userRoleAssignments.assignedBy,
      })
      .from(userRoleAssignments)
      .innerJoin(userRoles, eq(userRoleAssignments.roleId, userRoles.id))
      .where(
        and(
          eq(userRoleAssignments.userId, params.userId),
          eq(userRoleAssignments.isActive, true)
        )
      )
      .limit(1);

    if (!assignment) {
      return NextResponse.json(
        { error: 'No role assigned to user' },
        { status: 404 }
      );
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user role' },
      { status: 500 }
    );
  }
}