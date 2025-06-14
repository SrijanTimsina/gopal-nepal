import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { revalidateEntireSite } from '@/lib/revalidation';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const articles = await db
      .collection('news')
      .find({})
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(articles);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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

    const result = await db.collection('news').insertOne({
      title,
      date,
      link,
      excerpt,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await revalidateEntireSite();
    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to create article' },
      { status: 500 }
    );
  }
}
