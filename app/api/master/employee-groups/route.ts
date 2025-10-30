import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterEmployeeGroups } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let groups;
    if (search) {
      groups = await db.select()
        .from(masterEmployeeGroups)
        .where(like(masterEmployeeGroups.name, `%${search}%`))
        .orderBy(masterEmployeeGroups.name);
    } else {
      groups = await db.select().from(masterEmployeeGroups).orderBy(masterEmployeeGroups.name);
    }

    return NextResponse.json(groups);
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