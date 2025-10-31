import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterVehicles } from '@/db/schema';
import { eq, ilike, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    let totalCount = 0;
    let vehicles = [];

    if (search) {
      // Get filtered data and count
      const searchFilter = ilike(masterVehicles.noPol, `%${search}%`);

      const [totalCountResult, filteredVehicles] = await Promise.all([
        db.select({ count: masterVehicles.id }).from(masterVehicles).where(searchFilter),
        db.select().from(masterVehicles).where(searchFilter)
          .orderBy(masterVehicles.noPol)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      vehicles = filteredVehicles;
    } else {
      // Get all data and count
      const [totalCountResult, allVehicles] = await Promise.all([
        db.select({ count: masterVehicles.id }).from(masterVehicles),
        db.select().from(masterVehicles)
          .orderBy(masterVehicles.noPol)
          .limit(limit)
          .offset((page - 1) * limit)
      ]);
      
      totalCount = totalCountResult.length;
      vehicles = allVehicles;
    }
    
    // Format response according to PaginatedResponse interface
    const response = {
      data: vehicles,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };

    return NextResponse.json(response);
 } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { noPol } = body;

    if (!noPol || typeof noPol !== 'string') {
      return NextResponse.json(
        { error: 'Vehicle number (no_pol) is required' },
        { status: 400 }
      );
    }

    // Check if vehicle already exists
    const existing = await db.select()
      .from(masterVehicles)
      .where(eq(masterVehicles.noPol, noPol))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Vehicle with this number already exists' },
        { status: 409 }
      );
    }

    const [newVehicle] = await db.insert(masterVehicles)
      .values({ noPol })
      .returning();

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}
