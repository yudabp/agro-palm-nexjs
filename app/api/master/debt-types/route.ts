import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterDebtTypes } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let debtTypes;
    if (search) {
      debtTypes = await db.select()
        .from(masterDebtTypes)
        .where(like(masterDebtTypes.name, `%${search}%`))
        .orderBy(masterDebtTypes.name);
    } else {
      debtTypes = await db.select().from(masterDebtTypes).orderBy(masterDebtTypes.name);
    }

    return NextResponse.json(debtTypes);
  } catch (error) {
    console.error('Error fetching debt types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debt types' },
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
        { error: 'Debt type name is required' },
        { status: 400 }
      );
    }

    // Check if debt type already exists
    const existing = await db.select()
      .from(masterDebtTypes)
      .where(eq(masterDebtTypes.name, name))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Debt type with this name already exists' },
        { status: 409 }
      );
    }

    const [newDebtType] = await db.insert(masterDebtTypes)
      .values({ name, description })
      .returning();

    return NextResponse.json(newDebtType, { status: 201 });
  } catch (error) {
    console.error('Error creating debt type:', error);
    return NextResponse.json(
      { error: 'Failed to create debt type' },
      { status: 500 }
    );
  }
}