import Link from 'next/link';
import clientPromise from '@/lib/mongodb';
import type { BlogPost } from '@/lib/models';
import BlogCard from '@/components/cards/blog-card';
import PageHeader from '@/components/page-header';

async function getBlogPosts() {
  const client = await clientPromise;
  const db = client.db();
  const posts = await db
    .collection('blog')
    .find({ status: 'published' })
    .sort({ createdAt: -1 })
    .toArray();

  return posts as BlogPost[];
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader
        title="My Blogs"
        breadcrumbs={[{ label: 'Blogs', href: '/blogs' }]}
      />
      {posts.length === 0 ? (
        <p className="mt-8 text-center">
          No blog posts available at the moment.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 items-start justify-start gap-x-3 gap-y-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <Link
              href={`/blog/${post._id}`}
              key={post._id?.toString()}
              className={`${index === 0 ? 'md:col-span-3 md:flex-row' : ''}`}
            >
              <BlogCard post={post} wide={index == 0} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
