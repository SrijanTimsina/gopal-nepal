import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    revalidatePath('/', 'layout');

    return NextResponse.json({
      revalidated: true,
      message: 'Entire site revalidated successfully',
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      {
        message: 'Failed to revalidate',
      },
      { status: 500 }
    );
  }
}
