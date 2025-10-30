import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterVehicles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }

    const [vehicle] = await db.select()
      .from(masterVehicles)
      .where(eq(masterVehicles.id, id))
      .limit(1);

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { noPol } = body;

    if (!noPol || typeof noPol !== 'string') {
      return NextResponse.json(
        { error: 'Vehicle number (no_pol) is required' },
        { status: 400 }
      );
    }

    // Check if vehicle exists
    const [existing] = await db.select()
      .from(masterVehicles)
      .where(eq(masterVehicles.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Check if another vehicle has this number
    const [duplicate] = await db.select()
      .from(masterVehicles)
      .where(eq(masterVehicles.noPol, noPol))
      .limit(1);

    if (duplicate && duplicate.id !== id) {
      return NextResponse.json(
        { error: 'Vehicle with this number already exists' },
        { status: 409 }
      );
    }

    const [updatedVehicle] = await db.update(masterVehicles)
      .set({ noPol, updatedAt: new Date() })
      .where(eq(masterVehicles.id, id))
      .returning();

    return NextResponse.json(updatedVehicle);
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid vehicle ID' },
        { status: 400 }
      );
    }

    const [deletedVehicle] = await db.delete(masterVehicles)
      .where(eq(masterVehicles.id, id))
      .returning();

    if (!deletedVehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}