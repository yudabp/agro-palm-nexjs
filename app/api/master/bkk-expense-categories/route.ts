import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterBkkExpenseCategories } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let totalCount = 0;
    let categories = [];

    if (search) {
      // Get filtered data and count
      const searchFilter = or(
        ilike(masterBkkExpenseCategories.name, `%${search}%`),
        ilike(masterBkkExpenseCategories.description, `%${search}%`)
      );

      const [totalCountResult, filteredCategories] = await Promise.all([
        db.select({ count: masterBkkExpenseCategories.id }).from(masterBkkExpenseCategories).where(searchFilter),
        db.select().from(masterBkkExpenseCategories).where(searchFilter)
          .orderBy(masterBkkExpenseCategories.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      categories = filteredCategories;
    } else {
      // Get all data and count
      const [totalCountResult, allCategories] = await Promise.all([
        db.select({ count: masterBkkExpenseCategories.id }).from(masterBkkExpenseCategories),
        db.select().from(masterBkkExpenseCategories)
          .orderBy(masterBkkExpenseCategories.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      categories = allCategories;
    }
    
    // Format response according to PaginatedResponse interface
    const response = {
      data: categories,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
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
