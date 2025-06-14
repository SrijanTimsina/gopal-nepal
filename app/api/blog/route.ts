import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { revalidateEntireSite } from '@/lib/revalidation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get('includeDrafts') === 'true';

    const session = includeDrafts ? await getServerSession() : null;
    const isAdmin = session?.user;

    const client = await clientPromise;
    const db = client.db();

    const query = isAdmin && includeDrafts ? {} : { status: 'published' };

    const posts = await db
      .collection('blog')
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
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

    const {
      title,
      date,
      content,
      image,
      author,
      tags,
      status = 'draft',
    } = await request.json();

    if (status === 'draft') {
      if (!title) {
        return NextResponse.json(
          { message: 'Title is required even for drafts' },
          { status: 400 }
        );
      }
    } else {
      if (!title || !date || !content || !image || !author) {
        return NextResponse.json(
          { message: 'Missing required fields for published post' },
          { status: 400 }
        );
      }
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('blog').insertOne({
      title,
      date: date || new Date().toISOString().split('T')[0],
      content: content || '',
      image: image || '',
      author: author || '',
      tags: tags || [],
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (status === 'published') {
      await revalidateEntireSite();
    }

    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}
