import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterEmployeeGroups } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let totalCount = 0;
    let groups = [];

    if (search) {
      // Get filtered data and count
      const searchFilter = or(
        ilike(masterEmployeeGroups.name, `%${search}%`),
        ilike(masterEmployeeGroups.description, `%${search}%`)
      );

      const [totalCountResult, filteredGroups] = await Promise.all([
        db.select({ count: masterEmployeeGroups.id }).from(masterEmployeeGroups).where(searchFilter),
        db.select().from(masterEmployeeGroups).where(searchFilter)
          .orderBy(masterEmployeeGroups.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      groups = filteredGroups;
    } else {
      // Get all data and count
      const [totalCountResult, allGroups] = await Promise.all([
        db.select({ count: masterEmployeeGroups.id }).from(masterEmployeeGroups),
        db.select().from(masterEmployeeGroups)
          .orderBy(masterEmployeeGroups.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      groups = allGroups;
    }
    
    // Format response according to PaginatedResponse interface
    const response = {
      data: groups,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
 } catch (error) {
    console.error('Error fetching employee groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee groups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      );
    }

    // Check if group already exists
    const existing = await db.select()
      .from(masterEmployeeGroups)
      .where(eq(masterEmployeeGroups.name, name))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Group with this name already exists' },
        { status: 409 }
      );
    }

    const [newGroup] = await db.insert(masterEmployeeGroups)
      .values({ name, description })
      .returning();

    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating employee group:', error);
    return NextResponse.json(
      { error: 'Failed to create employee group' },
      { status: 500 }
    );
  }
}
