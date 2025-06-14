import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const timelineItems = await db
      .collection('timeline')
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(timelineItems);
  } catch (error) {
    console.error('Error fetching timeline items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Set default order if not provided
    if (!data.order) {
      const lastItem = await db
        .collection('timeline')
        .find()
        .sort({ order: -1 })
        .limit(1)
        .toArray();
      data.order = lastItem.length > 0 ? lastItem[0].order + 1 : 1;
    }

    // Ensure images is an array
    if (!data.images || !Array.isArray(data.images)) {
      data.images = [];
    }

    data.createdAt = new Date();
    data.updatedAt = new Date();

    const result = await db.collection('timeline').insertOne(data);

    revalidatePath('/about');

    return NextResponse.json({
      _id: result.insertedId,
      ...data,
    });
  } catch (error) {
    console.error('Error creating timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to create timeline item' },
      { status: 500 }
    );
  }
}
