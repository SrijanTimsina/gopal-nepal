import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

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

    const post = await db.collection('blog').findOne({ _id: new ObjectId(id) });

    if (!post) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (post.status === 'draft') {
      const session = await getServerSession();
      if (!session || !session.user) {
        return NextResponse.json(
          { message: 'Unauthorized to view draft post' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to fetch blog post' },
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

    const { title, date, content, image, author, tags, status } =
      await request.json();

    // For drafts, only title is required
    if (status === 'draft') {
      if (!title) {
        return NextResponse.json(
          { message: 'Title is required even for drafts' },
          { status: 400 }
        );
      }
    } else {
      // For published posts, all fields are required
      if (!title || !date || !content || !image || !author) {
        return NextResponse.json(
          { message: 'Missing required fields for published post' },
          { status: 400 }
        );
      }
    }

    const client = await clientPromise;
    const db = client.db();

    // Get the current post to check if status is changing
    const currentPost = await db
      .collection('blog')
      .findOne({ _id: new ObjectId(id) });
    const statusChanged = currentPost && currentPost.status !== status;

    const result = await db.collection('blog').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          date: date || new Date().toISOString().split('T')[0],
          content: content || '',
          image: image || '',
          author: author || '',
          tags: tags || [],
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (status === 'published' || statusChanged) {
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath(`/blog/${id}`);
    }

    return NextResponse.json({ message: 'Blog post updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update blog post' },
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

    const post = await db.collection('blog').findOne({ _id: new ObjectId(id) });
    const wasPublished = post && post.status === 'published';

    const result = await db
      .collection('blog')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (wasPublished) {
      revalidatePath('/');
      revalidatePath('/blog');
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}
