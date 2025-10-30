import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { masterAfdelings } from '@/db/schema';
import { eq, like } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let afdelings;
    if (search) {
      afdelings = await db.select()
        .from(masterAfdelings)
        .where(like(masterAfdelings.name, `%${search}%`))
        .orderBy(masterAfdelings.name);
    } else {
      afdelings = await db.select().from(masterAfdelings).orderBy(masterAfdelings.name);
    }

    return NextResponse.json(afdelings);
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