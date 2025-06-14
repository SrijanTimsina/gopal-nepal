import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/models";

interface RecentPostsProps {
  posts: BlogPost[];
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-200 pt-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-navy">You Might Also Like</h2>
        <Link
          href="/blog"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all articles <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post._id?.toString()}
            href={`/blog/${post._id}`}
            className="group flex h-full flex-col"
          >
            <div className="flex h-full flex-col rounded-lg border border-transparent bg-gray-50 p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-sm">
              <div className="flex items-start gap-4">
                <div className="min-w-[60px] flex-shrink-0 rounded-md border border-gray-100 bg-white p-1 text-center shadow-sm">
                  <div className="text-xs text-gray-500">
                    {new Date(post.date).toLocaleString("default", {
                      month: "short",
                    })}
                  </div>
                  <div className="text-lg font-bold text-navy">
                    {new Date(post.date).getDate()}
                  </div>
                </div>

                <div>
                  <h3 className="line-clamp-2 text-lg font-medium transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
