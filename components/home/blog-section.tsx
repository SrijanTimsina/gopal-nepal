import { Button } from '@/components/ui/button';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import clientPromise from '@/lib/mongodb';
import type { BlogPost } from '@/lib/models';
import BlogCard from '../cards/blog-card';

async function getLatestBlogPosts() {
  const client = await clientPromise;
  const db = client.db();
  const posts = await db
    .collection('blog')
    .find({ status: 'published' })
    .sort({ date: -1 })
    .limit(3)
    .toArray();
  return posts as BlogPost[];
}

export default async function BlogSection() {
  const posts = await getLatestBlogPosts();
  return (
    <section className="relative overflow-hidden bg-gray-50 py-16">
      <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/3 translate-x-1/3 transform rounded-full bg-blue-700/5"></div>
      <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 transform rounded-full bg-blue-700/5"></div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-navy">
              Latest from the Blog
            </h2>
            <div className="mt-2 h-1 w-20 rounded-full bg-primary"></div>
          </div>
          <Link href="/blog">
            <Button
              variant="default"
              className="transform shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              Read All Blogs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts &&
            posts.length > 0 &&
            posts.map((post) => (
              <BlogCard post={post} key={post._id?.toString()} />
            ))}
        </div>
      </div>
    </section>
  );
}
