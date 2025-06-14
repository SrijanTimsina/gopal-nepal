import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidateEntireSite } from '@/lib/revalidation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const client = await clientPromise;
    const db = client.db();

    let query = {};
    if (categoryId) {
      query = { categoryId };
    }

    const images = await db
      .collection('gallery_images')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const imagesWithCategories = await Promise.all(
      images.map(async (image) => {
        if (image.categoryId && ObjectId.isValid(image.categoryId)) {
          const category = await db.collection('gallery_categories').findOne({
            _id: new ObjectId(image.categoryId.toString()),
          });
          return {
            ...image,
            categoryName: category ? category.name : 'Unknown',
          };
        }
        return {
          ...image,
          categoryName: 'Unknown',
        };
      })
    );

    return NextResponse.json(imagesWithCategories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
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

    const result = await db.collection('gallery_images').insertOne({
      title,
      description: description || '',
      imageUrl,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await revalidateEntireSite();
    return NextResponse.json({ id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to create gallery image' },
      { status: 500 }
    );
  }
}
