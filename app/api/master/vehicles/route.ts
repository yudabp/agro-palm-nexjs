import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterVehicles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const vehicles = await db.select().from(masterVehicles).orderBy(masterVehicles.noPol);
    return NextResponse.json(vehicles);
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