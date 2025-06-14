import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { revalidateEntireSite } from '@/lib/revalidation';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const categories = await db
      .collection('gallery_categories')
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery categories' },
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

    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json(
        { message: 'Category name is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if category with the same name already exists
    const existingCategory = await db
      .collection('gallery_categories')
      .findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { message: 'A category with this name already exists' },
        { status: 400 }
      );
    }

    const result = await db.collection('gallery_categories').insertOne({
      name,
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await revalidateEntireSite();
    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to create category' },
      { status: 500 }
    );
  }
}
