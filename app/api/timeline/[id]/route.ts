import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const timelineItem = await db
      .collection('timeline')
      .findOne({ _id: new ObjectId(params.id) });

    if (!timelineItem) {
      return NextResponse.json(
        { error: 'Timeline item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(timelineItem);
  } catch (error) {
    console.error('Error fetching timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Ensure images is an array
    if (!data.images || !Array.isArray(data.images)) {
      data.images = [];
    }

    data.updatedAt = new Date();

    const result = await db
      .collection('timeline')
      .updateOne({ _id: new ObjectId(params.id) }, { $set: data });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Timeline item not found' },
        { status: 404 }
      );
    }

    revalidatePath('/about');

    return NextResponse.json({
      _id: params.id,
      ...data,
    });
  } catch (error) {
    console.error('Error updating timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to update timeline item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection('timeline')
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Timeline item not found' },
        { status: 404 }
      );
    }

    revalidatePath('/about');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to delete timeline item' },
      { status: 500 }
    );
  }
}
