import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { BlogPost } from '@/lib/models';
import RecentPosts from '@/components/blog/recent-posts';
import PageHeader from '@/components/page-header';
import parse from 'html-react-parser';
import { extractTextFromHtml } from '@/lib/blog-utils';

async function getBlogPost(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db();
  const post = await db.collection('blog').findOne({ _id: new ObjectId(id) });
  return post as BlogPost | null;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);

  if (post) {
    return {
      title: `Gopal Nepal - ${post.title}`,
      description: parse(extractTextFromHtml(post.content)),
      openGraph: {
        title: `Gopal Nepal - ${post.title}`,
        description: parse(extractTextFromHtml(post.content)),
        url: `https://gopal-nepal.vercel.app/blog/${post._id}`,
        images: [
          {
            url: post.image
              ? `https://utfs.io/f/${post.image}`
              : '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `Gopal Nepal - ${post.title}`,
        description: parse(extractTextFromHtml(post.content)),
        images: [
          post.image ? `https://utfs.io/f/${post.image}` : '/og-image.jpg',
        ],
      },
    };
  }
}

async function getRecentPosts(currentPostId: string, limit = 4) {
  if (!ObjectId.isValid(currentPostId)) {
    return [];
  }

  const client = await clientPromise;
  const db = client.db();
  const posts = await db
    .collection('blog')
    .find({ _id: { $ne: new ObjectId(currentPostId) }, status: 'published' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return posts as BlogPost[];
}

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

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    id: post._id.toString(),
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getBlogPost(params.id);

  if (!post) {
    notFound();
  }
  const recentPosts = await getRecentPosts(params.id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="mx-auto max-w-4xl">
        <PageHeader
          breadcrumbs={[
            { label: 'Blogs', href: '/blog' },
            {
              label: post.title,
              href: `/blog/${post._id}`,
            },
          ]}
        />
        <h1 className="mb-4 mt-4 text-3xl font-bold md:text-4xl">
          {post.title}
        </h1>
        <div className="mb-8 flex flex-wrap items-center text-gray-500">
          <span className="mr-4">{post.author}</span>
          <span>|</span>
          <span className="ml-4">{formatDate(post.date)}</span>
        </div>

        <div className="relative mb-6 w-full">
          <Image
            src={`https://utfs.io/f/${post.image}` || '/placeholder.svg'}
            alt={post.title}
            height={200}
            width={400}
            className="mx-auto h-auto w-full rounded-lg"
          />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="prose prose-img:rounded-lg prose-headings:text-navy prose-a:text-navy hover:prose-a:text-gold prose-a:transition-colors max-w-none">
          {parse(post.content)}
        </div>
      </article>

      <RecentPosts posts={recentPosts} />
    </div>
  );
}
