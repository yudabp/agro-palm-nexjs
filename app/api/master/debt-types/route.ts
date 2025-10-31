import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterDebtTypes } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let totalCount = 0;
    let debtTypes = [];

    if (search) {
      // Get filtered data and count
      const searchFilter = or(
        ilike(masterDebtTypes.name, `%${search}%`),
        ilike(masterDebtTypes.description, `%${search}%`)
      );

      const [totalCountResult, filteredDebtTypes] = await Promise.all([
        db.select({ count: masterDebtTypes.id }).from(masterDebtTypes).where(searchFilter),
        db.select().from(masterDebtTypes).where(searchFilter)
          .orderBy(masterDebtTypes.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      debtTypes = filteredDebtTypes;
    } else {
      // Get all data and count
      const [totalCountResult, allDebtTypes] = await Promise.all([
        db.select({ count: masterDebtTypes.id }).from(masterDebtTypes),
        db.select().from(masterDebtTypes)
          .orderBy(masterDebtTypes.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      debtTypes = allDebtTypes;
    }
    
    // Format response according to PaginatedResponse interface
    const response = {
      data: debtTypes,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
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
