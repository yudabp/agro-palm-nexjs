import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterEmployeePositions } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let totalCount = 0;
    let positions = [];

    if (search) {
      // Get filtered data and count
      const searchFilter = or(
        ilike(masterEmployeePositions.name, `%${search}%`),
        ilike(masterEmployeePositions.level, `%${search}%`)
      );

      const [totalCountResult, filteredPositions] = await Promise.all([
        db.select({ count: masterEmployeePositions.id }).from(masterEmployeePositions).where(searchFilter),
        db.select().from(masterEmployeePositions).where(searchFilter)
          .orderBy(masterEmployeePositions.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      positions = filteredPositions;
    } else {
      // Get all data and count
      const [totalCountResult, allPositions] = await Promise.all([
        db.select({ count: masterEmployeePositions.id }).from(masterEmployeePositions),
        db.select().from(masterEmployeePositions)
          .orderBy(masterEmployeePositions.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      positions = allPositions;
    }
    
    // Format response according to PaginatedResponse interface
    const response = {
      data: positions,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
 } catch (error) {
    console.error('Error fetching employee positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee positions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, level } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Position name is required' },
        { status: 400 }
      );
    }

    // Check if position already exists
    const existing = await db.select()
      .from(masterEmployeePositions)
      .where(eq(masterEmployeePositions.name, name))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Position with this name already exists' },
        { status: 409 }
      );
    }

    const [newPosition] = await db.insert(masterEmployeePositions)
      .values({ name, level })
      .returning();

    return NextResponse.json(newPosition, { status: 201 });
  } catch (error) {
    console.error('Error creating employee position:', error);
    return NextResponse.json(
      { error: 'Failed to create employee position' },
      { status: 500 }
    );
  }
}
