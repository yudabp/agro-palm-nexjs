import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterEmployeePositions } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let positions;
    if (search) {
      positions = await db.select()
        .from(masterEmployeePositions)
        .where(like(masterEmployeePositions.name, `%${search}%`))
        .orderBy(masterEmployeePositions.name);
    } else {
      positions = await db.select().from(masterEmployeePositions).orderBy(masterEmployeePositions.name);
    }

    return NextResponse.json(positions);
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