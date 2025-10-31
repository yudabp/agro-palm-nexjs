import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterAfdelings } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let totalCount = 0;
    let afdelings = [];

    if (search) {
      // Get filtered data and count
      const searchFilter = or(
        ilike(masterAfdelings.name, `%${search}%`),
        ilike(masterAfdelings.description, `%${search}%`)
      );

      const [totalCountResult, filteredAfdelings] = await Promise.all([
        db.select({ count: masterAfdelings.id }).from(masterAfdelings).where(searchFilter),
        db.select().from(masterAfdelings).where(searchFilter)
          .orderBy(masterAfdelings.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      afdelings = filteredAfdelings;
    } else {
      // Get all data and count
      const [totalCountResult, allAfdelings] = await Promise.all([
        db.select({ count: masterAfdelings.id }).from(masterAfdelings),
        db.select().from(masterAfdelings)
          .orderBy(masterAfdelings.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      afdelings = allAfdelings;
    }
    
    // Format response according to PaginatedResponse interface
    const response = {
      data: afdelings,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching afdelings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch afdelings' },
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
        { error: 'Afdeling name is required' },
        { status: 400 }
      );
    }

    // Check if afdeling already exists
    const existing = await db.select()
      .from(masterAfdelings)
      .where(eq(masterAfdelings.name, name))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Afdeling with this name already exists' },
        { status: 409 }
      );
    }

    const [newAfdeling] = await db.insert(masterAfdelings)
      .values({ name, description })
      .returning();

    return NextResponse.json(newAfdeling, { status: 201 });
  } catch (error) {
    console.error('Error creating afdeling:', error);
    return NextResponse.json(
      { error: 'Failed to create afdeling' },
      { status: 500 }
    );
  }
}
