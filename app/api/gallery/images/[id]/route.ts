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

    const image = await db
      .collection('gallery_images')
      .findOne({ _id: new ObjectId(id) });

    if (!image) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    // Get category name
    if (image.categoryId && ObjectId.isValid(image.categoryId)) {
      const category = await db.collection('gallery_categories').findOne({
        _id: new ObjectId(image.categoryId.toString()),
      });
      if (category) {
        image.categoryName = category.name;
      }
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to fetch image' },
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

    const { title, description, imageUrl, categoryId } = await request.json();

    if (!title || !imageUrl || !categoryId) {
      return NextResponse.json(
        { message: 'Title, image URL, and category are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Verify that the category exists
    if (ObjectId.isValid(categoryId)) {
      const category = await db
        .collection('gallery_categories')
        .findOne({ _id: new ObjectId(categoryId) });
      if (!category) {
        return NextResponse.json(
          { message: 'Selected category does not exist' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const result = await db.collection('gallery_images').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description: description || '',
          imageUrl,
          categoryId,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }
    await revalidateEntireSite();
    return NextResponse.json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update image' },
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
      .collection('gallery_images')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }
    await revalidateEntireSite();
    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
