import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterPks } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let pks;
    if (search) {
      pks = await db.select()
        .from(masterPks)
        .where(like(masterPks.name, `%${search}%`))
        .orderBy(masterPks.name);
    } else {
      pks = await db.select().from(masterPks).orderBy(masterPks.name);
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