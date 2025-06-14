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

    const article = await db
      .collection('news')
      .findOne({ _id: new ObjectId(id) });

    if (!article) {
      return NextResponse.json(
        { message: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to fetch article' },
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

    const { title, date, excerpt, image, link } = await request.json();

    if (!title || !date || !excerpt || !image || !link) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('news').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          date,
          link,
          excerpt,
          image,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Article not found' },
        { status: 404 }
      );
    }
    await revalidateEntireSite();
    return NextResponse.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update article' },
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
      .collection('news')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Article not found' },
        { status: 404 }
      );
    }
    await revalidateEntireSite();
    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
