import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidateEntireSite } from '@/lib/revalidation';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const video = await db
      .collection('videos')
      .findOne({ _id: new ObjectId(id) });

    if (!video) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to fetch video' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const { title, description, href, thumbnailUrl } = await request.json();

    if (!title || !description || !href) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('videos').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          href,
          thumbnailUrl,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }
    await revalidateEntireSite();
    return NextResponse.json({ message: 'Video updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db
      .collection('videos')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }
    await revalidateEntireSite();

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to delete video' },
      { status: 500 }
    );
  }
}
