import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterEmployeeDepartments } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let totalCount = 0;
    let departments = [];

    if (search) {
      // Get filtered data and count
      const searchFilter = or(
        ilike(masterEmployeeDepartments.name, `%${search}%`),
        ilike(masterEmployeeDepartments.description, `%${search}%`)
      );

      const [totalCountResult, filteredDepartments] = await Promise.all([
        db.select({ count: masterEmployeeDepartments.id }).from(masterEmployeeDepartments).where(searchFilter),
        db.select().from(masterEmployeeDepartments).where(searchFilter)
          .orderBy(masterEmployeeDepartments.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      departments = filteredDepartments;
    } else {
      // Get all data and count
      const [totalCountResult, allDepartments] = await Promise.all([
        db.select({ count: masterEmployeeDepartments.id }).from(masterEmployeeDepartments),
        db.select().from(masterEmployeeDepartments)
          .orderBy(masterEmployeeDepartments.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      departments = allDepartments;
    }
    
    // Format response according to PaginatedResponse interface
    const response = {
      data: departments,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
 } catch (error) {
    console.error('Error fetching employee departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employee departments' },
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
        { error: 'Department name is required' },
        { status: 400 }
      );
    }

    // Check if department already exists
    const existing = await db.select()
      .from(masterEmployeeDepartments)
      .where(eq(masterEmployeeDepartments.name, name))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Department with this name already exists' },
        { status: 409 }
      );
    }

    const [newDepartment] = await db.insert(masterEmployeeDepartments)
      .values({ name, description })
      .returning();

    return NextResponse.json(newDepartment, { status: 201 });
  } catch (error) {
    console.error('Error creating employee department:', error);
    return NextResponse.json(
      { error: 'Failed to create employee department' },
      { status: 500 }
    );
  }
}
