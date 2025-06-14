import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import type { BlogPost } from '@/lib/models';
import { extractTextFromHtml } from '@/lib/blog-utils';
import { AnimatedLink } from '@/components/ui/animated-link';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';
import parse from 'html-react-parser';

export default function BlogCard({
  post,
  wide,
}: {
  post: BlogPost;
  wide?: boolean;
}) {
  return (
    <Link href={`/blog/${post._id}`} className="h-full">
      <Card
        key={post._id?.toString()}
        className={`group flex h-full transform overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${wide ? 'flex-col md:flex-row' : 'flex-col'}`}
      >
        <div className={`relative w-full ${wide ? 'md:w-1/2' : 'w-full'}`}>
          <div className="relative">
            {post.tags && post.tags.length > 0 && (
              <div className="absolute left-4 top-4 z-10">
                <Badge className="text-xs font-medium">{post.tags[0]}</Badge>
              </div>
            )}

            <div
              className={`relative h-48 ${wide ? 'h-48 md:h-80' : 'h-48'} overflow-hidden`}
            >
              <Image
                src={`https://utfs.io/f/${post.image}` || '/placeholder.svg'}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            </div>
          </div>
        </div>
        <CardContent className="mt-4 flex flex-1 flex-col justify-between gap-4">
          <div>
            <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4 text-secondary" />
                <span>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <User className="mr-1 h-4 w-4 text-secondary" />
                <span>{post.author}</span>
              </div>
            </div>
            <h3 className="mb-3 line-clamp-2 text-xl font-bold text-navy transition-colors duration-300 group-hover:text-primary">
              {post.title}
            </h3>

            <p
              className={`line-clamp-2 ${wide && 'md:line-clamp-5'} text-sm text-gray-600`}
            >
              {parse(extractTextFromHtml(post.content))}
            </p>
          </div>
          {post.tags && post.tags.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(1, 4).map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-gray-100 text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <div>
            <AnimatedLink href={`/blog/${post._id}`} className="font-semibold">
              <div className="flex flex-row items-center">
                Read Full Blog
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </AnimatedLink>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
