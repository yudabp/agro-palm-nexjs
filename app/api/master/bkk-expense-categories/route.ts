import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterBkkExpenseCategories } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let categories;
    if (search) {
      categories = await db.select()
        .from(masterBkkExpenseCategories)
        .where(like(masterBkkExpenseCategories.name, `%${search}%`))
        .orderBy(masterBkkExpenseCategories.name);
    } else {
      categories = await db.select().from(masterBkkExpenseCategories).orderBy(masterBkkExpenseCategories.name);
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching BKK expense categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch BKK expense categories' },
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
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category already exists
    const existing = await db.select()
      .from(masterBkkExpenseCategories)
      .where(eq(masterBkkExpenseCategories.name, name))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    const [newCategory] = await db.insert(masterBkkExpenseCategories)
      .values({ name, description })
      .returning();

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Error creating BKK expense category:', error);
    return NextResponse.json(
      { error: 'Failed to create BKK expense category' },
      { status: 500 }
    );
  }
}