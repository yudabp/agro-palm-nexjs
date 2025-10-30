import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterAfdelings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid afdeling ID' },
        { status: 400 }
      );
    }

    const [afdeling] = await db.select()
      .from(masterAfdelings)
      .where(eq(masterAfdelings.id, id))
      .limit(1);

    if (!afdeling) {
      return NextResponse.json(
        { error: 'Afdeling not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(afdeling);
  } catch (error) {
    console.error('Error fetching afdeling:', error);
    return NextResponse.json(
      { error: 'Failed to fetch afdeling' },
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
        { error: 'Invalid afdeling ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Afdeling name is required' },
        { status: 400 }
      );
    }

    // Check if afdeling exists
    const [existing] = await db.select()
      .from(masterAfdelings)
      .where(eq(masterAfdelings.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: 'Afdeling not found' },
        { status: 404 }
      );
    }

    // Check if another afdeling has this name
    const [duplicate] = await db.select()
      .from(masterAfdelings)
      .where(eq(masterAfdelings.name, name))
      .limit(1);

    if (duplicate && duplicate.id !== id) {
      return NextResponse.json(
        { error: 'Afdeling with this name already exists' },
        { status: 409 }
      );
    }

    const [updatedAfdeling] = await db.update(masterAfdelings)
      .set({ name, description, updatedAt: new Date() })
      .where(eq(masterAfdelings.id, id))
      .returning();

    return NextResponse.json(updatedAfdeling);
  } catch (error) {
    console.error('Error updating afdeling:', error);
    return NextResponse.json(
      { error: 'Failed to update afdeling' },
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
        { error: 'Invalid afdeling ID' },
        { status: 400 }
      );
    }

    const [deletedAfdeling] = await db.delete(masterAfdelings)
      .where(eq(masterAfdelings.id, id))
      .returning();

    if (!deletedAfdeling) {
      return NextResponse.json(
        { error: 'Afdeling not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Afdeling deleted successfully' });
  } catch (error) {
    console.error('Error deleting afdeling:', error);
    return NextResponse.json(
      { error: 'Failed to delete afdeling' },
      { status: 500 }
    );
  }
}