import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterPks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid PKS ID' },
        { status: 400 }
      );
    }

    const [pks] = await db.select()
      .from(masterPks)
      .where(eq(masterPks.id, id))
      .limit(1);

    if (!pks) {
      return NextResponse.json(
        { error: 'PKS not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(pks);
  } catch (error) {
    console.error('Error fetching PKS:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PKS' },
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
        { error: 'Invalid PKS ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, address, phone } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'PKS name is required' },
        { status: 400 }
      );
    }

    // Check if PKS exists
    const [existing] = await db.select()
      .from(masterPks)
      .where(eq(masterPks.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: 'PKS not found' },
        { status: 404 }
      );
    }

    const [updatedPks] = await db.update(masterPks)
      .set({ name, address, phone, updatedAt: new Date() })
      .where(eq(masterPks.id, id))
      .returning();

    return NextResponse.json(updatedPks);
  } catch (error) {
    console.error('Error updating PKS:', error);
    return NextResponse.json(
      { error: 'Failed to update PKS' },
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
        { error: 'Invalid PKS ID' },
        { status: 400 }
      );
    }

    const [deletedPks] = await db.delete(masterPks)
      .where(eq(masterPks.id, id))
      .returning();

    if (!deletedPks) {
      return NextResponse.json(
        { error: 'PKS not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'PKS deleted successfully' });
  } catch (error) {
    console.error('Error deleting PKS:', error);
    return NextResponse.json(
      { error: 'Failed to delete PKS' },
      { status: 500 }
    );
  }
}