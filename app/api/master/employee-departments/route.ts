import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterEmployeeDepartments } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let departments;
    if (search) {
      departments = await db.select()
        .from(masterEmployeeDepartments)
        .where(like(masterEmployeeDepartments.name, `%${search}%`))
        .orderBy(masterEmployeeDepartments.name);
    } else {
      departments = await db.select().from(masterEmployeeDepartments).orderBy(masterEmployeeDepartments.name);
    }

    return NextResponse.json(departments);
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