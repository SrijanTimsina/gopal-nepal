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

    const category = await db
      .collection('gallery_categories')
      .findOne({ _id: new ObjectId(id) });

    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to fetch category' },
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

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if another category with the same name already exists
    const existingCategory = await db.collection('gallery_categories').findOne({
      name,
      _id: { $ne: new ObjectId(id) },
    });

    if (existingCategory) {
      return NextResponse.json(
        { message: 'Another category with this name already exists' },
        { status: 400 }
      );
    }

    const result = await db.collection('gallery_categories').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description: description || '',
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    await revalidateEntireSite();
    return NextResponse.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update category' },
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

    // Check if there are images using this category
    const imagesCount = await db
      .collection('gallery_images')
      .countDocuments({ categoryId: id });

    if (imagesCount > 0) {
      return NextResponse.json(
        {
          message: `Cannot delete category. There are ${imagesCount} images using this category.`,
        },
        { status: 400 }
      );
    }

    const result = await db
      .collection('gallery_categories')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    await revalidateEntireSite();
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
