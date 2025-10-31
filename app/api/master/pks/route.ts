import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterPks } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let totalCount = 0;
    let pks = [];

    if (search) {
      // Get filtered data and count
      const searchFilter = or(
        ilike(masterPks.name, `%${search}%`),
        ilike(masterPks.address, `%${search}%`),
        ilike(masterPks.phone, `%${search}%`)
      );

      const [totalCountResult, filteredPks] = await Promise.all([
        db.select({ count: masterPks.id }).from(masterPks).where(searchFilter),
        db.select().from(masterPks).where(searchFilter)
          .orderBy(masterPks.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      pks = filteredPks;
    } else {
      // Get all data and count
      const [totalCountResult, allPks] = await Promise.all([
        db.select({ count: masterPks.id }).from(masterPks),
        db.select().from(masterPks)
          .orderBy(masterPks.name)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      pks = allPks;
    }
    
    // Format response according to PaginatedResponse interface
    const response = {
      data: pks,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
 } catch (error) {
    console.error('Error fetching PKS:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PKS' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, phone } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'PKS name is required' },
        { status: 400 }
      );
    }

    const [newPks] = await db.insert(masterPks)
      .values({ name, address, phone })
      .returning();

    return NextResponse.json(newPks, { status: 201 });
  } catch (error) {
    console.error('Error creating PKS:', error);
    return NextResponse.json(
      { error: 'Failed to create PKS' },
      { status: 500 }
    );
  }
}
